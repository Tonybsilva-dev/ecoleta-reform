import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 font-bold text-6xl text-foreground">
            {APP_NAME}
          </h1>
          <p className="mb-8 text-muted-foreground text-xl">
            {APP_DESCRIPTION}
          </p>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/auth/signin">Entrar</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>

          <Separator className="mb-8" />

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">
                  Sustentabilidade
                </CardTitle>
                <CardDescription>
                  Promovemos práticas sustentáveis através da reciclagem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Conectamos pessoas e organizações para criar um impacto
                  positivo no meio ambiente.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Comunidade</CardTitle>
                <CardDescription>
                  Construímos uma rede colaborativa de cidadãos conscientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Faça parte de uma comunidade que se preocupa com o futuro do
                  planeta.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">Inovação</CardTitle>
                <CardDescription>
                  Tecnologia a serviço da preservação ambiental
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Utilizamos tecnologia moderna para facilitar a gestão de
                  resíduos.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-muted-foreground text-sm">
            Plataforma em desenvolvimento - Next.js 14 + TypeScript + Tailwind
            CSS + Auth.js
          </div>
        </div>
      </div>
    </div>
  );
}
