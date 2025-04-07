"use client"

import { useEffect, useState, useRef } from "react"
import { getOrdersByStatus, type Order } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MonitorPage() {
  const [readyOrders, setReadyOrders] = useState(getOrdersByStatus("ready"))
  const [preparingOrders, setPreparingOrders] = useState(getOrdersByStatus("preparing"))
  const [newReadyOrder, setNewReadyOrder] = useState<Order | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const previousReadyOrderIdsRef = useRef<string[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)

  // Inicializar o contexto de áudio após interação do usuário
  useEffect(() => {
    // Criar o contexto de áudio apenas uma vez
    if (!audioContextRef.current) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        audioContextRef.current = new AudioContext()
      } catch (e) {
        console.error("Web Audio API não suportada pelo navegador:", e)
      }
    }

    // Tentar resumir o contexto de áudio se estiver suspenso
    const resumeAudioContext = () => {
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume()
      }
    }

    // Adicionar event listeners para interação do usuário
    document.addEventListener("click", resumeAudioContext)
    document.addEventListener("touchstart", resumeAudioContext)

    return () => {
      document.removeEventListener("click", resumeAudioContext)
      document.removeEventListener("touchstart", resumeAudioContext)
    }
  }, [])

  // Função para tocar o som de alerta
  const playAlertSound = () => {
    if (!soundEnabled || !audioContextRef.current) return

    try {
      const context = audioContextRef.current

      // Criar um oscilador para gerar o som
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      // Configurar o oscilador
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(880, context.currentTime) // Nota A5
      oscillator.frequency.setValueAtTime(587.33, context.currentTime + 0.2) // Nota D5
      oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.4) // Nota E5

      // Configurar o volume
      gainNode.gain.setValueAtTime(0, context.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.7, context.currentTime + 0.1)
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.8)

      // Conectar os nós
      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      // Tocar o som
      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + 0.8)
    } catch (e) {
      console.error("Erro ao tocar som:", e)
    }
  }

  // Simular atualização em tempo real (em um sistema real, usaria websockets ou SSE)
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedReadyOrders = getOrdersByStatus("ready")
      const updatedPreparingOrders = getOrdersByStatus("preparing")

      // Detectar novos pedidos prontos
      const currentReadyOrderIds = updatedReadyOrders.map((order) => order.id)
      const previousReadyOrderIds = previousReadyOrderIdsRef.current

      const newlyReadyOrderIds = currentReadyOrderIds.filter((id) => !previousReadyOrderIds.includes(id))

      if (newlyReadyOrderIds.length > 0) {
        // Pegar o primeiro novo pedido pronto
        const newOrder = updatedReadyOrders.find((order) => order.id === newlyReadyOrderIds[0]) || null

        if (newOrder) {
          // Tocar som de alerta
          playAlertSound()

          // Mostrar overlay com animação
          setNewReadyOrder(newOrder)
          setShowOverlay(true)

          // Após 3 segundos, esconder o overlay
          setTimeout(() => {
            setShowOverlay(false)
            // Após a animação de saída (1s), limpar o pedido destacado
            setTimeout(() => {
              setNewReadyOrder(null)
            }, 1000)
          }, 3000)
        }
      }

      previousReadyOrderIdsRef.current = currentReadyOrderIds
      setReadyOrders(updatedReadyOrders)
      setPreparingOrders(updatedPreparingOrders)
    }, 3000)

    return () => clearInterval(interval)
  }, [soundEnabled]) // Adicionar soundEnabled como dependência

  // Função para alternar o som
  const toggleSound = () => {
    setSoundEnabled((prev) => !prev)

    // Se estiver ativando o som, tocar um som de teste
    if (!soundEnabled) {
      setTimeout(() => {
        playAlertSound()
      }, 100)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative">
      {/* Overlay para novo pedido pronto */}
      {showOverlay && newReadyOrder && (
        <div
          className={cn(
            "fixed inset-0 bg-black/70 flex items-center justify-center z-50",
            showOverlay ? "opacity-100" : "opacity-0",
            "transition-opacity duration-500",
          )}
        >
          <div
            className={cn(
              "bg-green-600 rounded-lg p-8 text-center transform transition-all duration-1000",
              showOverlay ? "scale-100" : "scale-0",
            )}
          >
            <h2 className="text-4xl font-bold text-white mb-4">PEDIDO PRONTO!</h2>
            <div className="text-6xl font-bold text-white mb-2">{newReadyOrder.customerName}</div>
            <div className="text-3xl text-white">Pedido #{newReadyOrder.id}</div>
          </div>
        </div>
      )}

      <header className="bg-slate-800 p-4 text-white border-b border-slate-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-center flex-1">Status dos Pedidos</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSound}
            className="text-white hover:bg-slate-700"
            title={soundEnabled ? "Desativar som" : "Ativar som"}
          >
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 flex flex-col lg:flex-row gap-6">
        {/* Coluna lateral - Pedidos em preparo */}
        <div className="lg:w-1/4 bg-slate-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-white flex items-center">
            <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
            Em Preparo
          </h2>

          {preparingOrders.length === 0 ? (
            <div className="text-slate-400 text-center py-4">Nenhum pedido em preparo</div>
          ) : (
            <div className="space-y-2">
              {preparingOrders.map((order) => (
                <Card
                  key={order.id}
                  className="bg-slate-700 border-0 hover:bg-slate-600 transition-colors duration-300"
                >
                  <CardContent className="p-3 text-white">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{order.customerName}</span>
                      <Badge className="bg-yellow-500 text-slate-900">#{order.id}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Área principal - Pedidos prontos */}
        <div className="lg:w-3/4 bg-slate-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-white flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Pedidos Prontos
          </h2>

          {readyOrders.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-400 text-xl">
              Nenhum pedido pronto no momento
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readyOrders.map((order) => (
                <Card
                  key={order.id}
                  className="border-0 shadow-lg transition-all duration-500 animate-pulse-slow"
                  style={{
                    animation: "pulseColor 4s ease-in-out infinite",
                  }}
                >
                  <CardContent className="p-6 flex justify-between items-center">
                    <h3 className="text-3xl font-bold text-white">{order.customerName}</h3>
                    <Badge className="text-xl px-3 py-1 bg-white text-green-700">#{order.id}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-800 p-4 text-center text-white border-t border-slate-700">
        <p className="text-lg">Por favor, aguarde a chamada do seu nome para retirar seu pedido</p>
      </footer>

      {/* Adicionar estilos para a animação de pulsação de cor */}
      <style jsx global>{`
        @keyframes pulseColor {
          0%, 100% { background-color: #16a34a; } /* verde-600 */
          50% { background-color: #22c55e; } /* verde-500 */
        }
        .animate-pulse-slow {
          animation: pulseColor 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

