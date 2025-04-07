"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createOrder } from "@/lib/actions"
import { getMenuItemsByCategory, type MenuItem, type OrderItem } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"

export default function TotemPage() {
  const router = useRouter()
  const menuByCategory = getMenuItemsByCategory()
  const [cart, setCart] = useState<(OrderItem & { menuItem: MenuItem })[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerCpf, setCustomerCpf] = useState("")
  const [tableNumber, setTableNumber] = useState("")

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function addToCart(menuItem: MenuItem) {
    const existingItemIndex = cart.findIndex((item) => item.menuItemId === menuItem.id)

    if (existingItemIndex >= 0) {
      // Item já existe no carrinho, aumentar quantidade
      const updatedCart = [...cart]
      updatedCart[existingItemIndex].quantity += 1
      setCart(updatedCart)
    } else {
      // Adicionar novo item ao carrinho
      setCart([
        ...cart,
        {
          id: `temp-${Date.now()}`,
          menuItemId: menuItem.id,
          menuItemName: menuItem.name,
          quantity: 1,
          price: menuItem.price,
          notes: "",
          menuItem,
        },
      ])
    }
  }

  function updateQuantity(index: number, newQuantity: number) {
    if (newQuantity < 1) return

    const updatedCart = [...cart]
    updatedCart[index].quantity = newQuantity
    setCart(updatedCart)
  }

  function updateNotes(index: number, notes: string) {
    const updatedCart = [...cart]
    updatedCart[index].notes = notes
    setCart(updatedCart)
  }

  function removeFromCart(index: number) {
    setCart(cart.filter((_, i) => i !== index))
  }

  // Função para formatar o CPF enquanto o usuário digita
  function formatCpf(value: string) {
    // Remove todos os caracteres não numéricos
    const cpfNumbers = value.replace(/\D/g, "")

    // Aplica a formatação do CPF (XXX.XXX.XXX-XX)
    if (cpfNumbers.length <= 3) {
      return cpfNumbers
    } else if (cpfNumbers.length <= 6) {
      return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3)}`
    } else if (cpfNumbers.length <= 9) {
      return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}.${cpfNumbers.slice(6)}`
    } else {
      return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}.${cpfNumbers.slice(6, 9)}-${cpfNumbers.slice(9, 11)}`
    }
  }

  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formattedCpf = formatCpf(e.target.value)
    setCustomerCpf(formattedCpf)
  }

  async function handleSubmitOrder() {
    if (!customerName || !tableNumber || cart.length === 0) {
      alert("Por favor, preencha seu nome, número da mesa e adicione itens ao pedido.")
      return
    }

    try {
      // Preparar itens para envio (remover a propriedade menuItem)
      const orderItems = cart.map(({ menuItem, ...item }) => item)

      await createOrder(
        orderItems,
        customerName,
        false, // não é entrega
        customerCpf || undefined, // CPF é opcional
        undefined, // sem endereço de entrega
        Number.parseInt(tableNumber),
      )

      alert("Pedido realizado com sucesso!")
      setCart([])
      setCustomerName("")
      setCustomerCpf("")
      setTableNumber("")
      router.push("/")
    } catch (error) {
      console.error("Erro ao criar pedido:", error)
      alert("Erro ao criar pedido. Tente novamente.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Faça seu Pedido</h1>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            <span className="font-bold">{cart.length} itens</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue={menuByCategory[0]?.category}>
            <TabsList className="mb-4 flex flex-wrap">
              {menuByCategory.map((category) => (
                <TabsTrigger key={category.category} value={category.category}>
                  {category.category}
                </TabsTrigger>
              ))}
            </TabsList>

            {menuByCategory.map((category) => (
              <TabsContent
                key={category.category}
                value={category.category}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {category.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative h-40">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold">{item.name}</h3>
                        <span className="font-bold text-green-600">{formatCurrency(item.price)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                      <Button onClick={() => addToCart(item)} className="w-full" disabled={!item.available}>
                        {item.available ? "Adicionar ao Pedido" : "Indisponível"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-xl font-bold mb-4">Seu Pedido</h2>

          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Seu carrinho está vazio</div>
          ) : (
            <div className="space-y-4 mb-4">
              {cart.map((item, index) => (
                <div key={item.id} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{item.menuItemName}</h3>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>

                  <Textarea
                    placeholder="Observações (ex: sem cebola)"
                    className="text-sm"
                    value={item.notes}
                    onChange={(e) => updateNotes(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>

            <div className="space-y-4">
              <Input placeholder="Seu nome" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <Input placeholder="CPF (opcional)" value={customerCpf} onChange={handleCpfChange} maxLength={14} />
              <Input
                placeholder="Número da mesa"
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={cart.length === 0 || !customerName || !tableNumber}
            onClick={handleSubmitOrder}
          >
            Finalizar Pedido
          </Button>
        </div>
      </main>
    </div>
  )
}

