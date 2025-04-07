"use client"

import { useEffect, useState } from "react"
import { getOrdersByStatus } from "@/lib/data"
import { OrderCard } from "@/components/order-card"

export default function EntregaPage() {
  const [readyOrders, setReadyOrders] = useState(getOrdersByStatus("ready").filter((order) => order.isDelivery))
  const [deliveredOrders, setDeliveredOrders] = useState(
    getOrdersByStatus("delivered").filter((order) => order.isDelivery),
  )

  // Simular atualização em tempo real (em um sistema real, usaria websockets ou SSE)
  useEffect(() => {
    const interval = setInterval(() => {
      setReadyOrders(getOrdersByStatus("ready").filter((order) => order.isDelivery))
      setDeliveredOrders(getOrdersByStatus("delivered").filter((order) => order.isDelivery))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Entregas</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Prontos para Entrega ({readyOrders.length})</h2>
            <div className="grid gap-4">
              {readyOrders.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center text-muted-foreground">
                  Não há pedidos prontos para entrega
                </div>
              ) : (
                readyOrders.map((order) => <OrderCard key={order.id} order={order} view="delivery" />)
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Entregas Realizadas Hoje ({deliveredOrders.length})</h2>
            <div className="grid gap-4">
              {deliveredOrders.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center text-muted-foreground">
                  Nenhuma entrega realizada hoje
                </div>
              ) : (
                deliveredOrders.map((order) => <OrderCard key={order.id} order={order} view="delivery" />)
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

