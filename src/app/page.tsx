import Image from "next/image";
import Link from "next/link";
import { PinContainer } from "@/components/ui/3d-pin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                <svg
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Logo Ecoleta</title>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-xl">
                {APP_NAME}
              </span>
            </div>

            <nav className="hidden items-center space-x-6 md:flex">
              <Link
                href="#como-funciona"
                className="text-gray-600 transition-colors hover:text-gray-900"
              >
                Como funciona
              </Link>
              <Link
                href="#impacto"
                className="text-gray-600 transition-colors hover:text-gray-900"
              >
                Nosso impacto
              </Link>
              <Link
                href="#sobre"
                className="text-gray-600 transition-colors hover:text-gray-900"
              >
                Sobre nós
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <Link
                href="/auth/signin"
                className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm shadow-sm transition-colors hover:bg-gray-50"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 font-medium text-sm text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Left Column - Content */}
              <div className="flex flex-col justify-center">
                <div className="mb-6">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 font-medium text-green-800 text-sm">
                    🌱 Sustentabilidade em primeiro lugar
                  </span>
                </div>

                <h1 className="mb-6 font-bold text-5xl text-gray-900 lg:text-6xl">
                  Transforme resíduos em{" "}
                  <span className="text-green-600">oportunidades</span>
                </h1>

                <p className="mb-8 text-gray-600 text-xl leading-relaxed">
                  {APP_DESCRIPTION}. Conecte-se com nossa comunidade e faça
                  parte da revolução sustentável.
                </p>

                <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/register"
                    className="flex items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-6 font-medium text-lg text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Começar agora
                  </Link>
                  <Link
                    href="#como-funciona"
                    className="flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-8 py-6 font-medium text-gray-700 text-lg shadow-sm transition-colors hover:bg-gray-50"
                  >
                    Ver como funciona
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="font-bold text-3xl text-green-600">
                      1.2k+
                    </div>
                    <div className="text-gray-600 text-sm">Usuários ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-3xl text-green-600">
                      5.8t
                    </div>
                    <div className="text-gray-600 text-sm">CO₂ evitado</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-3xl text-green-600">
                      850+
                    </div>
                    <div className="text-gray-600 text-sm">
                      Itens reciclados
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className="flex items-center justify-center">
                <PinContainer title="Ecoleta Reform" href="/map">
                  <div className="flex h-[24rem] w-[24rem] basis-full flex-col p-6 text-slate-100/90 tracking-tight sm:basis-1/2">
                    <h3 className="!pb-3 !m-0 max-w-xs font-bold text-lg text-white">
                      Mapa Sustentável
                    </h3>
                    <div className="!m-0 !p-0 font-normal text-base">
                      <span className="text-slate-200">
                        Descubra pontos de coleta e materiais próximos a você.
                        Conecte-se com nossa comunidade sustentável.
                      </span>
                    </div>
                    <div className="relative mt-6 flex w-full flex-1 overflow-hidden rounded-lg bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 shadow-2xl">
                      <Image
                        src="/MapChart_Map.svg"
                        alt="Mapa Sustentável"
                        fill
                        className="object-contain p-4"
                      />
                      {/* Floating elements */}
                      <div className="absolute top-6 left-6 h-2 w-2 animate-bounce rounded-full bg-white/90 shadow-lg"></div>
                      <div className="absolute top-12 right-8 h-2 w-2 animate-bounce rounded-full bg-white/80 shadow-lg delay-1000"></div>
                      <div className="absolute bottom-8 left-12 h-2 w-2 animate-bounce rounded-full bg-white/90 shadow-lg delay-2000"></div>
                      <div className="absolute right-6 bottom-6 h-2 w-2 animate-bounce rounded-full bg-white/80 shadow-lg delay-3000"></div>
                    </div>
                  </div>
                </PinContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <h2 className="mb-4 font-bold text-4xl text-gray-900">
              Como funciona
            </h2>
            <p className="text-gray-600 text-xl">
              Três passos simples para começar sua jornada sustentável
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="p-8 text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Cadastro</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <CardTitle className="text-xl">1. Cadastre-se</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Crie sua conta gratuita e escolha seu perfil: cidadão, coletor
                  ou organização.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Explorar</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-xl">2. Explore</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Navegue pelo mapa e encontre materiais para reciclar ou pontos
                  de coleta próximos.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <svg
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Conectar</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-xl">3. Conecte-se</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Faça contato, negocie e complete a transação de forma segura e
                  sustentável.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impacto" className="bg-green-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 font-bold text-4xl text-gray-900">
                  Nosso impacto no planeta
                </h2>
                <p className="mb-8 text-gray-600 text-lg">
                  Cada ação conta. Veja como nossa comunidade está fazendo a
                  diferença para um futuro mais sustentável.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>CO₂ evitado</title>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-2xl text-gray-900">
                        5.8 toneladas
                      </div>
                      <div className="text-gray-600">de CO₂ evitado</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Itens reciclados</title>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-2xl text-gray-900">
                        850+ itens
                      </div>
                      <div className="text-gray-600">
                        reciclados com sucesso
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Pessoas impactadas</title>
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.5.7-1.5 1.5S15.2 11 16 11h1.5l1.5 4.5H16V22h4z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-2xl text-gray-900">
                        1.2k+ pessoas
                      </div>
                      <div className="text-gray-600">
                        impactadas positivamente
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-2xl bg-white p-8 shadow-xl">
                  <h3 className="mb-6 text-center font-semibold text-gray-900 text-xl">
                    Metas para 2024
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="font-medium text-gray-700 text-sm">
                          Redução de CO₂
                        </span>
                        <span className="text-gray-500 text-sm">15t</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="font-medium text-gray-700 text-sm">
                          Itens reciclados
                        </span>
                        <span className="text-gray-500 text-sm">2.5k</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="font-medium text-gray-700 text-sm">
                          Novos usuários
                        </span>
                        <span className="text-gray-500 text-sm">5k</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-purple-600"
                          style={{ width: "40%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <h2 className="mb-4 font-bold text-4xl text-gray-900">
              Por que escolher o Ecoleta?
            </h2>
            <p className="text-gray-600 text-xl">
              Funcionalidades que tornam a sustentabilidade acessível e
              divertida
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Mapa Inteligente</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <CardTitle>Mapa Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Encontre pontos de coleta e materiais próximos a você com
                  nossa tecnologia de geolocalização.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Gamificação</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <CardTitle>Gamificação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ganhe EcoPoints, complete missões e suba de nível enquanto
                  cuida do planeta.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Comunidade</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <CardTitle>Comunidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Conecte-se com pessoas e organizações que compartilham seus
                  valores sustentáveis.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                  <svg
                    className="h-6 w-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Relatórios</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <CardTitle>Relatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Acompanhe seu impacto ambiental com relatórios detalhados e
                  métricas em tempo real.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Segurança</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <CardTitle>Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Transações seguras e verificação de usuários para garantir
                  confiança na plataforma.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100">
                  <svg
                    className="h-6 w-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Fácil de usar</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <CardTitle>Fácil de usar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Interface intuitiva e responsiva que funciona perfeitamente no
                  celular e desktop.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 font-bold text-4xl text-white">
              Pronto para fazer a diferença?
            </h2>
            <p className="mb-8 text-green-100 text-xl">
              Junte-se a milhares de pessoas que já estão transformando o mundo
              através da sustentabilidade.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="flex items-center justify-center rounded-md border border-transparent bg-white px-8 py-6 font-medium text-green-600 text-lg shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
              >
                Criar conta gratuita
              </Link>
              <Link
                href="/auth/signin"
                className="flex items-center justify-center gap-3 rounded-lg border border-white bg-transparent px-8 py-6 font-medium text-lg text-white shadow-sm transition-colors hover:bg-white hover:text-green-600"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Logo Ecoleta</title>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <span className="font-bold text-xl">{APP_NAME}</span>
              </div>
              <p className="mb-4 text-gray-400">
                Conectando pessoas e organizações para um futuro mais
                sustentável.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-lg">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="#como-funciona"
                    className="transition-colors hover:text-white"
                  >
                    Como funciona
                  </Link>
                </li>
                <li>
                  <Link
                    href="#impacto"
                    className="transition-colors hover:text-white"
                  >
                    Nosso impacto
                  </Link>
                </li>
                <li>
                  <Link
                    href="/map"
                    className="transition-colors hover:text-white"
                  >
                    Mapa
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="transition-colors hover:text-white"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-lg">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="#sobre"
                    className="transition-colors hover:text-white"
                  >
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="transition-colors hover:text-white"
                  >
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link
                    href="/press"
                    className="transition-colors hover:text-white"
                  >
                    Imprensa
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="transition-colors hover:text-white"
                  >
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-lg">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/help"
                    className="transition-colors hover:text-white"
                  >
                    Central de ajuda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="transition-colors hover:text-white"
                  >
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="transition-colors hover:text-white"
                  >
                    Termos de uso
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="transition-colors hover:text-white"
                  >
                    Segurança
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-gray-800 border-t pt-8 text-center text-gray-400">
            <p>&copy; 2024 {APP_NAME}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
