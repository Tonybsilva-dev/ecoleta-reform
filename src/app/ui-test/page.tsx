"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Progress,
  Separator,
} from "@/components/ui";

export default function UITestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="font-bold text-4xl text-foreground">
            shadcn/ui Test Page
          </h1>
          <p className="mt-2 text-muted-foreground">
            Teste de todos os componentes shadcn/ui para verificar estilização
          </p>
        </div>

        <Separator />

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              Teste de diferentes variantes de botões
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>Teste de elementos de formulário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Digite seu email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
              />
            </div>
            <Button className="w-full">Entrar</Button>
          </CardContent>
        </Card>

        {/* Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Teste de barra de progresso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>33%</span>
              </div>
              <Progress value={33} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Carregamento</span>
                <span>75%</span>
              </div>
              <Progress value={75} />
            </div>
          </CardContent>
        </Card>

        {/* Cards Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card 1</CardTitle>
              <CardDescription>Descrição do card 1</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Este é o conteúdo do primeiro card para teste de estilização.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card 2</CardTitle>
              <CardDescription>Descrição do card 2</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Este é o conteúdo do segundo card para teste de estilização.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Color Test Section */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette Test</CardTitle>
            <CardDescription>Teste da paleta de cores do tema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <div className="h-16 w-full rounded bg-primary"></div>
                <p className="text-muted-foreground text-xs">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 w-full rounded bg-secondary"></div>
                <p className="text-muted-foreground text-xs">Secondary</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 w-full rounded bg-muted"></div>
                <p className="text-muted-foreground text-xs">Muted</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 w-full rounded bg-accent"></div>
                <p className="text-muted-foreground text-xs">Accent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dark Mode Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Dark Mode Test</CardTitle>
            <CardDescription>
              Adicione a classe "dark" ao elemento html para testar o modo
              escuro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Para testar o modo escuro, abra o DevTools e execute:
            </p>
            <code className="mt-2 block rounded bg-muted p-2 text-sm">
              document.documentElement.classList.add("dark")
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
