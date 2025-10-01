import { MapPin } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Skip Link for Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-green-600 px-4 py-2 font-medium text-white transition-all focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
      >
        Pular para o conteúdo principal
      </a>

      {/* Header */}
      <header className="sticky top-0 z-[9999] border-b bg-white/95 shadow-sm backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-green-600 sm:h-8 sm:w-8">
                <svg
                  className="h-3 w-3 text-white sm:h-5 sm:w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Logo Sustainable</title>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-lg sm:text-xl">
                {APP_NAME}
              </span>
            </div>

            <nav
              className="hidden items-center space-x-4 lg:space-x-6 xl:flex"
              aria-label="Navegação principal"
            >
              <Link
                href="#como-funciona"
                className="text-gray-600 text-sm transition-colors hover:text-gray-900 lg:text-base"
              >
                Como funciona
              </Link>
              <Link
                href="#impacto"
                className="text-gray-600 text-sm transition-colors hover:text-gray-900 lg:text-base"
              >
                Nosso impacto
              </Link>
              <Link
                href="#sobre"
                className="text-gray-600 text-sm transition-colors hover:text-gray-900 lg:text-base"
              >
                Sobre nós
              </Link>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                href="/signin"
                className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-medium text-gray-700 text-xs shadow-sm transition-colors hover:bg-gray-50 sm:px-4 sm:py-2 sm:text-sm"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center rounded-md border border-transparent bg-green-600 px-3 py-1.5 font-medium text-white text-xs shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:px-4 sm:py-2 sm:text-sm"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main
        id="main-content"
        className="relative overflow-hidden bg-gradient-to-br from-green-50 to-blue-50"
        aria-label="Seção principal - Apresentação do Sustainable"
      >
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-20">
              {/* Left Column - Content */}
              <div className="flex flex-col justify-center">
                <div className="mb-4 sm:mb-6">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 font-medium text-green-800 text-xs sm:px-3 sm:text-sm">
                    🌱 Sustentabilidade em primeiro lugar
                  </span>
                </div>

                <h1 className="mb-4 font-bold text-3xl text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
                  Transforme resíduos em{" "}
                  <span className="text-green-600">oportunidades</span>
                </h1>

                <p className="mb-6 text-base text-gray-600 leading-relaxed sm:mb-8 sm:text-lg md:text-xl">
                  {APP_DESCRIPTION}. Conecte-se com nossa comunidade e faça
                  parte da revolução sustentável.
                </p>

                <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:gap-4">
                  <Link
                    href="/register"
                    className="flex items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-4 font-medium text-base text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:px-8 sm:py-6 sm:text-lg"
                  >
                    Começar agora
                  </Link>
                  <Link
                    href="#como-funciona"
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-4 font-medium text-base text-gray-700 shadow-sm transition-colors hover:bg-gray-50 sm:gap-3 sm:px-8 sm:py-6 sm:text-lg"
                  >
                    Ver como funciona
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  <div className="text-center">
                    <div className="font-bold text-2xl text-green-600 sm:text-3xl">
                      1.2k+
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Usuários ativos
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-2xl text-green-600 sm:text-3xl">
                      5.8t
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      CO₂ evitado
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-2xl text-green-600 sm:text-3xl">
                      850+
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Itens reciclados
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className="flex items-center justify-center">
                <aside aria-label="Demonstração interativa de sustentabilidade">
                  <div className="relative">
                    {/* Card principal */}
                    <div className="relative h-[20rem] w-[20rem] overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 shadow-2xl sm:h-[24rem] sm:w-[24rem] md:h-[28rem] md:w-[28rem]">
                      {/* Conteúdo do card */}
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white sm:p-6 md:p-8">
                        <div className="mb-4 sm:mb-6">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm sm:mb-4 sm:h-16 sm:w-16 md:h-20 md:w-20">
                            <svg
                              className="h-6 w-6 text-white sm:h-8 sm:w-8 md:h-10 md:w-10"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              role="img"
                              aria-label="Ícone de reciclagem"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </div>
                          <h3 className="mb-2 font-bold text-lg text-white sm:mb-3 sm:text-xl md:text-2xl">
                            Economia Circular
                          </h3>
                          <p className="text-sm text-white/90 leading-relaxed sm:text-base md:text-lg">
                            Conecte-se com nossa comunidade sustentável e
                            transforme resíduos em recursos valiosos
                          </p>
                        </div>

                        {/* Elementos flutuantes representando materiais */}
                        <div className="absolute top-4 left-4 h-2 w-2 animate-bounce rounded-full bg-yellow-400 shadow-lg sm:top-6 sm:left-6 sm:h-2.5 sm:w-2.5 md:top-8 md:left-8 md:h-3 md:w-3"></div>
                        <div className="absolute top-8 right-6 h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 shadow-lg delay-500 sm:top-12 sm:right-8 sm:h-2 sm:w-2 md:top-16 md:right-12"></div>
                        <div className="absolute bottom-12 left-8 h-2 w-2 animate-bounce rounded-full bg-red-400 shadow-lg delay-1000 sm:bottom-16 sm:left-12 sm:h-2.5 sm:w-2.5 md:bottom-20 md:left-16"></div>
                        <div className="absolute right-4 bottom-6 h-1.5 w-1.5 animate-bounce rounded-full bg-green-400 shadow-lg delay-1500 sm:right-6 sm:bottom-8 sm:h-2 sm:w-2 md:right-8 md:bottom-12"></div>
                        <div className="absolute top-12 left-1/2 h-1 w-1 animate-bounce rounded-full bg-purple-400 shadow-lg delay-2000 sm:top-16 sm:h-1.5 sm:w-1.5 md:top-24"></div>
                        <div className="absolute right-1/3 bottom-12 h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400 shadow-lg delay-2500 sm:bottom-16 sm:h-2 sm:w-2 md:bottom-24"></div>
                      </div>

                      {/* Efeito de partículas */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="-top-2 -left-2 sm:-top-3 sm:-left-3 md:-top-4 md:-left-4 absolute h-4 w-4 animate-pulse rounded-full bg-white/10 sm:h-6 sm:w-6 md:h-8 md:w-8"></div>
                        <div className="-right-1 sm:-right-2 absolute top-1/4 h-3 w-3 animate-pulse rounded-full bg-white/10 delay-1000 sm:h-4 sm:w-4 md:h-6 md:w-6"></div>
                        <div className="-bottom-1 sm:-bottom-2 absolute left-1/4 h-2 w-2 animate-pulse rounded-full bg-white/10 delay-2000 sm:h-3 sm:w-3 md:h-4 md:w-4"></div>
                        <div className="-right-2 sm:-right-3 md:-right-4 absolute bottom-1/4 h-2.5 w-2.5 animate-pulse rounded-full bg-white/10 delay-3000 sm:h-3.5 sm:w-3.5 md:h-5 md:w-5"></div>
                      </div>

                      {/* Botão de ação - posicionado independentemente */}
                      <Link
                        href="/map"
                        className="-translate-x-1/2 absolute bottom-4 left-1/2 z-10 inline-flex cursor-pointer items-center gap-1 rounded-full bg-white/20 px-4 py-2 font-medium text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30 sm:bottom-6 sm:gap-2 sm:px-5 sm:py-2.5 md:bottom-8 md:px-6 md:py-3"
                      >
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                        <span className="text-xs sm:text-sm md:text-base">
                          Explorar Mapa
                        </span>
                      </Link>
                    </div>

                    {/* Cards flutuantes com estatísticas */}
                    <div className="-top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 absolute h-8 w-8 animate-float rounded-full bg-white shadow-lg sm:h-12 sm:w-12 md:h-16 md:w-16">
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="font-bold text-green-600 text-xs sm:text-sm">
                          ♻️
                        </span>
                      </div>
                    </div>
                    <div className="-bottom-2 -left-2 sm:-bottom-3 sm:-left-3 md:-bottom-4 md:-left-4 absolute h-6 w-6 animate-float rounded-full bg-white shadow-lg delay-1000 sm:h-8 sm:w-8 md:h-12 md:w-12">
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="font-bold text-emerald-600 text-xs">
                          🌱
                        </span>
                      </div>
                    </div>
                    <div className="-left-3 sm:-left-4 md:-left-6 absolute top-1/2 h-5 w-5 animate-float rounded-full bg-white shadow-lg delay-2000 sm:h-6 sm:w-6 md:h-10 md:w-10">
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="font-bold text-teal-600 text-xs">
                          💚
                        </span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* How it Works Section */}
      <section
        id="como-funciona"
        className="bg-white py-12 sm:py-16 md:py-20"
        aria-label="Como funciona - Processo de uso da plataforma"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-8 max-w-4xl text-center sm:mb-12 md:mb-16">
            <h2 className="mb-3 font-bold text-2xl text-gray-900 sm:mb-4 sm:text-3xl md:text-4xl">
              Como funciona
            </h2>
            <p className="text-base text-gray-600 sm:text-lg md:text-xl">
              Três passos simples para começar sua jornada sustentável
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            <Card className="p-4 text-center transition-shadow hover:shadow-lg sm:p-6 md:p-8">
              <CardHeader>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 sm:mb-4 sm:h-14 sm:w-14 md:h-16 md:w-16">
                  <svg
                    className="h-6 w-6 text-green-600 sm:h-7 sm:w-7 md:h-8 md:w-8"
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
                <CardTitle className="text-lg sm:text-xl">
                  1. Cadastre-se
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Crie sua conta gratuita e escolha seu perfil: cidadão, coletor
                  ou organização.
                </p>
              </CardContent>
            </Card>

            <Card className="p-4 text-center transition-shadow hover:shadow-lg sm:p-6 md:p-8">
              <CardHeader>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 sm:mb-4 sm:h-14 sm:w-14 md:h-16 md:w-16">
                  <svg
                    className="h-6 w-6 text-blue-600 sm:h-7 sm:w-7 md:h-8 md:w-8"
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
                <CardTitle className="text-lg sm:text-xl">2. Explore</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Navegue pelo mapa e encontre materiais para reciclar ou pontos
                  de coleta próximos.
                </p>
              </CardContent>
            </Card>

            <Card className="p-4 text-center transition-shadow hover:shadow-lg sm:p-6 md:p-8">
              <CardHeader>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 sm:mb-4 sm:h-14 sm:w-14 md:h-16 md:w-16">
                  <svg
                    className="h-6 w-6 text-purple-600 sm:h-7 sm:w-7 md:h-8 md:w-8"
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
                <CardTitle className="text-lg sm:text-xl">
                  3. Conecte-se
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Faça contato, negocie e complete a transação de forma segura e
                  sustentável.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section
        id="impacto"
        className="bg-green-50 py-12 sm:py-16 md:py-20"
        aria-label="Nosso impacto - Estatísticas e resultados"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <h2 className="mb-4 font-bold text-2xl text-gray-900 sm:mb-6 sm:text-3xl md:text-4xl">
                  Nosso impacto no planeta
                </h2>
                <p className="mb-6 text-base text-gray-600 sm:mb-8 sm:text-lg">
                  Cada ação conta. Veja como nossa comunidade está fazendo a
                  diferença para um futuro mais sustentável.
                </p>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 sm:h-12 sm:w-12">
                      <svg
                        className="h-5 w-5 text-white sm:h-6 sm:w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>CO₂ evitado</title>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-xl sm:text-2xl">
                        5.8 toneladas
                      </div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        de CO₂ evitado
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 sm:h-12 sm:w-12">
                      <svg
                        className="h-5 w-5 text-white sm:h-6 sm:w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Itens reciclados</title>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-xl sm:text-2xl">
                        850+ itens
                      </div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        reciclados com sucesso
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 sm:h-12 sm:w-12">
                      <svg
                        className="h-5 w-5 text-white sm:h-6 sm:w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Pessoas impactadas</title>
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.5.7-1.5 1.5S15.2 11 16 11h1.5l1.5 4.5H16V22h4z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-xl sm:text-2xl">
                        1.2k+ pessoas
                      </div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        impactadas positivamente
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-2xl bg-white p-4 shadow-xl sm:p-6 md:p-8">
                  <h3 className="mb-4 text-center font-semibold text-gray-900 text-lg sm:mb-6 sm:text-xl">
                    Metas para 2026
                  </h3>

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="font-medium text-gray-700 text-xs sm:text-sm">
                          Redução de CO₂
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">
                          15t
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-200 sm:h-2">
                        <div
                          className="h-1.5 rounded-full bg-green-600 sm:h-2"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="font-medium text-gray-700 text-xs sm:text-sm">
                          Itens reciclados
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">
                          2.5k
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-200 sm:h-2">
                        <div
                          className="h-1.5 rounded-full bg-blue-600 sm:h-2"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="font-medium text-gray-700 text-xs sm:text-sm">
                          Novos usuários
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">
                          5k
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-200 sm:h-2">
                        <div
                          className="h-1.5 rounded-full bg-purple-600 sm:h-2"
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
      <section
        className="bg-white py-12 sm:py-16 md:py-20"
        aria-label="Recursos e funcionalidades da plataforma"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-8 max-w-4xl text-center sm:mb-12 md:mb-16">
            <h2 className="mb-3 font-bold text-2xl text-gray-900 sm:mb-4 sm:text-3xl md:text-4xl">
              Por que escolher o Sustainable?
            </h2>
            <p className="text-base text-gray-600 sm:text-lg md:text-xl">
              Funcionalidades que tornam a sustentabilidade acessível e
              divertida
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-4 transition-shadow hover:shadow-lg sm:p-6">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 sm:mb-4 sm:h-12 sm:w-12">
                  <svg
                    className="h-5 w-5 text-green-600 sm:h-6 sm:w-6"
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
                <CardTitle className="text-base sm:text-lg">
                  Mapa Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Encontre pontos de coleta e materiais próximos a você com
                  nossa tecnologia de geolocalização.
                </p>
              </CardContent>
            </Card>

            <Card className="p-4 transition-shadow hover:shadow-lg sm:p-6">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 sm:mb-4 sm:h-12 sm:w-12">
                  <svg
                    className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6"
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
                <CardTitle className="text-base sm:text-lg">
                  Gamificação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Ganhe EcoPoints, complete missões e suba de nível enquanto
                  cuida do planeta.
                </p>
              </CardContent>
            </Card>

            <Card className="p-4 transition-shadow hover:shadow-lg sm:p-6">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 sm:mb-4 sm:h-12 sm:w-12">
                  <svg
                    className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6"
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
                <CardTitle className="text-base sm:text-lg">
                  Comunidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Conecte-se com pessoas e organizações que compartilham seus
                  valores sustentáveis.
                </p>
              </CardContent>
            </Card>

            <Card className="p-4 transition-shadow hover:shadow-lg sm:p-6">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 sm:mb-4 sm:h-12 sm:w-12">
                  <svg
                    className="h-5 w-5 text-orange-600 sm:h-6 sm:w-6"
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
                <CardTitle className="text-base sm:text-lg">
                  Relatórios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Acompanhe seu impacto ambiental com relatórios detalhados e
                  métricas em tempo real.
                </p>
              </CardContent>
            </Card>

            <Card className="p-4 transition-shadow hover:shadow-lg sm:p-6">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 sm:mb-4 sm:h-12 sm:w-12">
                  <svg
                    className="h-5 w-5 text-red-600 sm:h-6 sm:w-6"
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
                <CardTitle className="text-base sm:text-lg">
                  Segurança
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Transações seguras e verificação de usuários para garantir
                  confiança na plataforma.
                </p>
              </CardContent>
            </Card>

            <Card className="p-4 transition-shadow hover:shadow-lg sm:p-6">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 sm:mb-4 sm:h-12 sm:w-12">
                  <svg
                    className="h-5 w-5 text-teal-600 sm:h-6 sm:w-6"
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
                <CardTitle className="text-base sm:text-lg">
                  Fácil de usar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Interface intuitiva e responsiva que funciona perfeitamente no
                  celular e desktop.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="bg-green-600 py-12 sm:py-16 md:py-20"
        aria-label="Chamada para ação - Comece sua jornada sustentável"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 font-bold text-2xl text-white sm:mb-6 sm:text-3xl md:text-4xl">
              Pronto para fazer a diferença?
            </h2>
            <p className="mb-6 text-base text-green-100 sm:mb-8 sm:text-lg md:text-xl">
              Junte-se a milhares de pessoas que já estão transformando o mundo
              através da sustentabilidade.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href="/register"
                className="flex items-center justify-center rounded-md border border-transparent bg-white px-6 py-4 font-medium text-base text-green-600 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600 sm:px-8 sm:py-6 sm:text-lg"
              >
                Criar conta gratuita
              </Link>
              <Link
                href="/signin"
                className="flex items-center justify-center gap-2 rounded-lg border border-white bg-transparent px-6 py-4 font-medium text-base text-white shadow-sm transition-colors hover:bg-white hover:text-green-600 sm:gap-3 sm:px-8 sm:py-6 sm:text-lg"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-white sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center space-x-2 sm:mb-4 sm:space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-green-600 sm:h-8 sm:w-8">
                  <svg
                    className="h-3 w-3 text-white sm:h-5 sm:w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Logo Sustainable</title>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <span className="font-bold text-lg sm:text-xl">{APP_NAME}</span>
              </div>
              <p className="mb-4 text-gray-400 text-sm sm:text-base">
                Conectando pessoas e organizações para um futuro mais
                sustentável.
              </p>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-base sm:mb-4 sm:text-lg">
                Produto
              </h3>
              <ul className="space-y-1.5 text-gray-400 sm:space-y-2">
                <li>
                  <Link
                    href="#como-funciona"
                    className="text-sm transition-colors hover:text-white sm:text-base"
                  >
                    Como funciona
                  </Link>
                </li>
                <li>
                  <Link
                    href="#impacto"
                    className="text-sm transition-colors hover:text-white sm:text-base"
                  >
                    Nosso impacto
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/map"
                    className="text-sm transition-colors hover:text-white sm:text-base"
                  >
                    Mapa
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-sm transition-colors hover:text-white sm:text-base"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-base sm:mb-4 sm:text-lg">
                Empresa
              </h3>
              <ul className="space-y-1.5 text-gray-400 sm:space-y-2">
                <li>
                  <Link
                    href="#sobre"
                    className="text-sm transition-colors hover:text-white sm:text-base"
                  >
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm transition-colors hover:text-white sm:text-base"
                  >
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link
                    href="/press"
                    className="text-sm transition-colors hover:text-white sm:text-base"
                  >
                    Imprensa
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm transition-colors hover:text-white sm:text-base"
                  >
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-base sm:mb-4 sm:text-lg">
                Suporte
              </h3>
              <ul className="space-y-1.5 text-gray-400 sm:space-y-2">
                <li>
                  <Link
                    href="/help"
                    className="text-sm transition-colors hover:text-white sm:text-base"
                  >
                    Central de ajuda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm transition-colors hover:text-white sm:text-base"
                  >
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm transition-colors hover:text-white sm:text-base"
                  >
                    Termos de uso
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="text-sm transition-colors hover:text-white sm:text-base"
                  >
                    Segurança
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-gray-800 border-t pt-6 text-center text-gray-400 sm:mt-12 sm:pt-8">
            <p className="text-xs sm:text-sm">
              &copy; 2025 {APP_NAME}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
