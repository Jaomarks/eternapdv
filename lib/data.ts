// Tipos de dados
export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
}

export type OrderItem = {
  id: string
  menuItemId: string
  menuItemName: string
  quantity: number
  price: number
  notes: string
}

export type Order = {
  id: string
  items: OrderItem[]
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
  total: number
  customerName: string
  customerCpf?: string // CPF opcional
  tableNumber?: number
  isDelivery: boolean
  deliveryAddress?: string
  createdAt: Date
  updatedAt: Date
}

// Dados de exemplo
export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "X-Burger",
    description: "Hambúrguer com queijo, alface, tomate e molho especial",
    price: 18.9,
    image: "/placeholder.svg?height=200&width=200",
    category: "Hambúrgueres",
    available: true,
  },
  {
    id: "2",
    name: "X-Bacon",
    description: "Hambúrguer com queijo, bacon, alface, tomate e molho especial",
    price: 22.9,
    image: "/placeholder.svg?height=200&width=200",
    category: "Hambúrgueres",
    available: true,
  },
  {
    id: "3",
    name: "X-Salada",
    description: "Hambúrguer com queijo, alface, tomate, cebola e molho especial",
    price: 19.9,
    image: "/placeholder.svg?height=200&width=200",
    category: "Hambúrgueres",
    available: true,
  },
  {
    id: "4",
    name: "Batata Frita P",
    description: "Porção pequena de batatas fritas crocantes",
    price: 8.9,
    image: "/placeholder.svg?height=200&width=200",
    category: "Acompanhamentos",
    available: true,
  },
  {
    id: "5",
    name: "Batata Frita G",
    description: "Porção grande de batatas fritas crocantes",
    price: 14.9,
    image: "/placeholder.svg?height=200&width=200",
    category: "Acompanhamentos",
    available: true,
  },
  {
    id: "6",
    name: "Refrigerante Lata",
    description: "Lata 350ml (Coca-Cola, Guaraná, Sprite)",
    price: 5.9,
    image: "/placeholder.svg?height=200&width=200",
    category: "Bebidas",
    available: true,
  },
  {
    id: "7",
    name: "Suco Natural",
    description: "Copo 300ml (Laranja, Limão, Abacaxi)",
    price: 7.9,
    image: "/placeholder.svg?height=200&width=200",
    category: "Bebidas",
    available: true,
  },
  {
    id: "8",
    name: "Milk Shake",
    description: "Copo 400ml (Chocolate, Morango, Baunilha)",
    price: 12.9,
    image: "/placeholder.svg?height=200&width=200",
    category: "Bebidas",
    available: true,
  },
]

// Pedidos de exemplo
export const orders: Order[] = [
  {
    id: "1",
    items: [
      {
        id: "1-1",
        menuItemId: "1",
        menuItemName: "X-Burger",
        quantity: 2,
        price: 18.9,
        notes: "Sem cebola",
      },
      {
        id: "1-2",
        menuItemId: "6",
        menuItemName: "Refrigerante Lata",
        quantity: 2,
        price: 5.9,
        notes: "Coca-Cola",
      },
    ],
    status: "preparing",
    total: 49.6,
    customerName: "João Silva",
    customerCpf: "123.456.789-00",
    tableNumber: 5,
    isDelivery: false,
    createdAt: new Date("2023-04-07T09:30:00"),
    updatedAt: new Date("2023-04-07T09:35:00"),
  },
  {
    id: "2",
    items: [
      {
        id: "2-1",
        menuItemId: "2",
        menuItemName: "X-Bacon",
        quantity: 1,
        price: 22.9,
        notes: "",
      },
      {
        id: "2-2",
        menuItemId: "5",
        menuItemName: "Batata Frita G",
        quantity: 1,
        price: 14.9,
        notes: "Bem passada",
      },
    ],
    status: "pending",
    total: 37.8,
    customerName: "Maria Oliveira",
    customerCpf: "987.654.321-00",
    isDelivery: true,
    deliveryAddress: "Rua das Flores, 123",
    createdAt: new Date("2023-04-07T10:15:00"),
    updatedAt: new Date("2023-04-07T10:15:00"),
  },
  {
    id: "3",
    items: [
      {
        id: "3-1",
        menuItemId: "3",
        menuItemName: "X-Salada",
        quantity: 3,
        price: 19.9,
        notes: "",
      },
      {
        id: "3-2",
        menuItemId: "7",
        menuItemName: "Suco Natural",
        quantity: 3,
        price: 7.9,
        notes: "2 de laranja, 1 de limão",
      },
    ],
    status: "ready",
    total: 83.4,
    customerName: "Carlos Pereira",
    tableNumber: 8,
    isDelivery: false,
    createdAt: new Date("2023-04-07T11:00:00"),
    updatedAt: new Date("2023-04-07T11:20:00"),
  },
  {
    id: "4",
    items: [
      {
        id: "4-1",
        menuItemId: "1",
        menuItemName: "X-Burger",
        quantity: 1,
        price: 18.9,
        notes: "",
      },
      {
        id: "4-2",
        menuItemId: "4",
        menuItemName: "Batata Frita P",
        quantity: 1,
        price: 8.9,
        notes: "",
      },
    ],
    status: "ready",
    total: 27.8,
    customerName: "Ana Souza",
    customerCpf: "111.222.333-44",
    tableNumber: 3,
    isDelivery: false,
    createdAt: new Date("2023-04-07T11:30:00"),
    updatedAt: new Date("2023-04-07T11:45:00"),
  },
]

// Funções para manipular os dados
export function getMenuItemsByCategory() {
  const categories = [...new Set(menuItems.map((item) => item.category))]
  return categories.map((category) => ({
    category,
    items: menuItems.filter((item) => item.category === category),
  }))
}

export function getOrderById(id: string) {
  return orders.find((order) => order.id === id)
}

export function getOrdersByStatus(status: Order["status"]) {
  return orders.filter((order) => order.status === status)
}

