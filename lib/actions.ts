"use server"

import { revalidatePath } from "next/cache"
import { type Order, type OrderItem, orders } from "./data"

// Função para criar um novo pedido
export async function createOrder(
  items: Omit<OrderItem, "id">[],
  customerName: string,
  isDelivery: boolean,
  customerCpf?: string,
  deliveryAddress?: string,
  tableNumber?: number,
) {
  // Em um sistema real, isso seria salvo em um banco de dados
  const newOrder: Order = {
    id: (orders.length + 1).toString(),
    items: items.map((item, index) => ({
      ...item,
      id: `${orders.length + 1}-${index + 1}`,
    })),
    status: "pending",
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    customerName,
    customerCpf,
    tableNumber,
    isDelivery,
    deliveryAddress,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Adicionar o pedido à lista (simulando um banco de dados)
  orders.push(newOrder)

  // Revalidar os caminhos relevantes
  revalidatePath("/caixa")
  revalidatePath("/cozinha")
  revalidatePath("/entrega")
  revalidatePath("/monitor")

  return newOrder
}

// Função para atualizar o status de um pedido
export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex === -1) {
    throw new Error(`Pedido com ID ${orderId} não encontrado`)
  }

  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
    updatedAt: new Date(),
  }

  // Revalidar os caminhos relevantes
  revalidatePath("/caixa")
  revalidatePath("/cozinha")
  revalidatePath("/entrega")
  revalidatePath("/monitor")

  return orders[orderIndex]
}

