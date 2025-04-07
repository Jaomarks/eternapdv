import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-100">
      <div className="max-w-5xl w-full text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Sistema POS para Lanchonete</h1>
        <p className="text-xl text-muted-foreground mb-6">Um sistema personalizado para o seu negócio!</p>
        <p className="text-muted-foreground">Selecione a interface que deseja acessar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full max-w-5xl">
        <Link href="/totem" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-center">Totem</CardTitle>
              <CardDescription className="text-center">Interface para autoatendimento dos clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-slate-200 p-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-700"
                >
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Acessar Totem</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/caixa" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-center">Caixa</CardTitle>
              <CardDescription className="text-center">Interface para operadores de caixa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-slate-200 p-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-700"
                >
                  <path d="M2 9V5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v4" />
                  <rect width="20" height="12" x="2" y="9" rx="2" />
                  <path d="M9 14h6" />
                  <path d="m13 12-2 4" />
                </svg>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Acessar Caixa</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/cozinha" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-center">Cozinha</CardTitle>
              <CardDescription className="text-center">Interface para a equipe de preparo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-slate-200 p-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-700"
                >
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                  <line x1="6" x2="18" y1="17" y2="17" />
                </svg>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Acessar Cozinha</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/entrega" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-center">Entrega</CardTitle>
              <CardDescription className="text-center">Interface para entregadores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-slate-200 p-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-700"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Acessar Entrega</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/monitor" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-center">Monitor</CardTitle>
              <CardDescription className="text-center">Tela de pedidos prontos para clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-slate-200 p-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-700"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Acessar Monitor</Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </main>
  )
}

