"use client"

import type React from "react"

import { useState } from "react"
import { getMenuItemsByCategory, getOrdersByStatus, type MenuItem, type OrderItem } from "@/lib/data"
import { createOrder } from "@/lib/actions"
import { OrderCard } from "@/components/order-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/utils"
import { Plus, Minus, Search } from "lucide-react"

export default function CaixaPage() {
  const menuByCategory = getMenuItemsByCategory()
  const pendingOrders = getOrdersByStatus("pending")
  const preparingOrders = getOrdersByStatus("preparing")
  const readyOrders = getOrdersByStatus("ready")

  const [cart, setCart] = useState<(OrderItem & { menuItem: MenuItem })[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerCpf, setCustomerCpf] = useState("")
  const [isDelivery, setIsDelivery] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

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
    if (!customerName || cart.length === 0) {
      alert("Por favor, preencha o nome do cliente e adicione itens ao pedido.")
      return
    }

    if (isDelivery && !deliveryAddress) {
      alert("Por favor, preencha o endereço de entrega.")
      return
    }

    if (!isDelivery && !tableNumber) {
      alert("Por favor, preencha o número da mesa.")
      return
    }

    try {
      // Preparar itens para envio (remover a propriedade menuItem)
      const orderItems = cart.map(({ menuItem, ...item }) => item)

      await createOrder(
        orderItems,
        customerName,
        isDelivery,
        customerCpf || undefined,
        isDelivery ? deliveryAddress : undefined,
        !isDelivery ? Number.parseInt(tableNumber) : undefined,
      )

      alert("Pedido criado com sucesso!")
      setCart([])
      setCustomerName("")
      setCustomerCpf("")
      setIsDelivery(false)
      setDeliveryAddress("")
      setTableNumber("")
    } catch (error) {
      console.error("Erro ao criar pedido:", error)
      alert("Erro ao criar pedido. Tente novamente.")
    }
  }

  // Filtrar itens do menu com base na pesquisa
  const filteredMenu = menuByCategory
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0)

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Caixa</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="novo-pedido">
            <TabsList className="mb-4">
              <TabsTrigger value="novo-pedido">Novo Pedido</TabsTrigger>
              <TabsTrigger value="pedidos">
                Pedidos ({pendingOrders.length + preparingOrders.length + readyOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="novo-pedido">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar produtos..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredMenu.map((category) => (
                <div key={category.category} className="mb-6">
                  <h2 className="text-lg font-bold mb-3">{category.category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((item) => (
                      <Card key={item.id} className="flex">
                        <CardContent className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold">{item.name}</h3>
                            <span className="font-bold text-green-600">{formatCurrency(item.price)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                          <Button onClick={() => addToCart(item)} size="sm" disabled={!item.available}>
                            {item.available ? "Adicionar" : "Indisponível"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="pedidos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingOrders.map((order) => (
                  <OrderCard key={order.id} order={order} view="cashier" />
                ))}
                {preparingOrders.map((order) => (
                  <OrderCard key={order.id} order={order} view="cashier" />
                ))}
                {readyOrders.map((order) => (
                  <OrderCard key={order.id} order={order} view="cashier" />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Novo Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4">
                <Input
                  placeholder="Nome do cliente"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />

                <Input placeholder="CPF (opcional)" value={customerCpf} onChange={handleCpfChange} maxLength={14} />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDelivery"
                    checked={isDelivery}
                    onChange={(e) => setIsDelivery(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isDelivery">Entrega</label>
                </div>

                {isDelivery ? (
                  <Textarea
                    placeholder="Endereço de entrega"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                ) : (
                  <Input
                    placeholder="Número da mesa"
                    type="number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  />
                )}
              </div>

              <h3 className="font-bold mb-2">Itens do Pedido</h3>

              {cart.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">Nenhum item adicionado</div>
              ) : (
                <div className="space-y-4 mb-4">
                  {cart.map((item, index) => (
                    <div key={item.id} className="border-b pb-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{item.menuItemName}</h4>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(index)} className="h-6 w-6">
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm">{formatCurrency(item.price * item.quantity)}</span>
                      </div>

                      <Input
                        placeholder="Observações"
                        className="text-sm mt-1"
                        value={item.notes}
                        onChange={(e) => updateNotes(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
              </div>

              <Button
                className="w-full"
                disabled={
                  cart.length === 0 ||
                  !customerName ||
                  (isDelivery && !deliveryAddress) ||
                  (!isDelivery && !tableNumber)
                }
                onClick={handleSubmitOrder}
              >
                Finalizar Pedido
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

