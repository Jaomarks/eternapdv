"use client"

import { useEffect, useState } from "react"
import { getOrdersByStatus } from "@/lib/data"
import { OrderCard } from "@/components/order-card"

export default function CozinhaPage() {
  const [pendingOrders, setPendingOrders] = useState(getOrdersByStatus("pending"))
  const [preparingOrders, setPreparingOrders] = useState(getOrdersByStatus("preparing"))

  // Simular atualização em tempo real (em um sistema real, usaria websockets ou SSE)
  useEffect(() => {
    const interval = setInterval(() => {
      setPendingOrders(getOrdersByStatus("pending"))
      setPreparingOrders(getOrdersByStatus("preparing"))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Cozinha</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Pedidos Pendentes ({pendingOrders.length})</h2>
            <div className="grid gap-4">
              {pendingOrders.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center text-muted-foreground">
                  Não há pedidos pendentes
                </div>
              ) : (
                pendingOrders.map((order) => <OrderCard key={order.id} order={order} view="kitchen" />)
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Em Preparo ({preparingOrders.length})</h2>
            <div className="grid gap-4">
              {preparingOrders.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center text-muted-foreground">
                  Não há pedidos em preparo
                </div>
              ) : (
                preparingOrders.map((order) => <OrderCard key={order.id} order={order} view="kitchen" />)
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

