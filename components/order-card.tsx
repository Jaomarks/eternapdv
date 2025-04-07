"use client"

import type { Order } from "@/lib/data"
import { updateOrderStatus } from "@/lib/actions"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface OrderCardProps {
  order: Order
  view: "kitchen" | "cashier" | "delivery"
}

export function OrderCard({ order, view }: OrderCardProps) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    preparing: "bg-blue-100 text-blue-800",
    ready: "bg-green-100 text-green-800",
    delivered: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const statusText = {
    pending: "Pendente",
    preparing: "Preparando",
    ready: "Pronto",
    delivered: "Entregue",
    cancelled: "Cancelado",
  }

  async function handleStatusChange(newStatus: Order["status"]) {
    await updateOrderStatus(order.id, newStatus)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {order.customerName} • {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <Badge className={statusColors[order.status]}>{statusText[order.status]}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.menuItemName}
                {item.notes && <span className="block text-xs text-muted-foreground">Obs: {item.notes}</span>}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        {order.isDelivery && order.deliveryAddress && (
          <div className="mt-4 text-sm">
            <p className="font-medium">Endereço de entrega:</p>
            <p className="text-muted-foreground">{order.deliveryAddress}</p>
          </div>
        )}

        {!order.isDelivery && order.tableNumber && (
          <div className="mt-4 text-sm">
            <p className="font-medium">Mesa: {order.tableNumber}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2 pt-0">
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>

        {view === "kitchen" && order.status === "pending" && (
          <Button onClick={() => handleStatusChange("preparing")}>Iniciar Preparo</Button>
        )}

        {view === "kitchen" && order.status === "preparing" && (
          <Button onClick={() => handleStatusChange("ready")}>Marcar como Pronto</Button>
        )}

        {view === "cashier" && order.status === "ready" && !order.isDelivery && (
          <Button onClick={() => handleStatusChange("delivered")}>Entregar ao Cliente</Button>
        )}

        {view === "delivery" && order.status === "ready" && order.isDelivery && (
          <Button onClick={() => handleStatusChange("delivered")}>Confirmar Entrega</Button>
        )}
      </CardFooter>
    </Card>
  )
}

