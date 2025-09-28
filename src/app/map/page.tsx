"use client";

import { ArrowLeft, Bookmark, Clock, MapPin, Search, Star } from "lucide-react";
import Link from "next/link";
import { Map as MapComponent } from "@/components/map";
import { APP_NAME } from "@/lib/constants";

export default function MapPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-[9999] border-b bg-white/95 shadow-sm backdrop-blur-md">
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
              <div className="flex items-center space-x-2">
                <Link href="/" className="font-bold text-gray-900 text-xl">
                  {APP_NAME}
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden items-center space-x-2 text-gray-600 text-sm md:flex">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
                <span>•</span>
                <span>5 km</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Filters and Items List */}
        <div className="flex w-100 flex-col border-gray-200 border-r bg-white">
          {/* Navigation Header */}
          <div className="border-gray-200 border-b bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-semibold text-gray-900 text-lg">
                  Mapa Sustentável
                </h1>
                <p className="text-gray-600 text-sm">
                  Explore materiais próximos a você
                </p>
              </div>
              <Link
                href="/"
                className="flex items-center space-x-1 rounded-md px-3 py-2 text-gray-600 text-sm transition-colors hover:bg-gray-200 hover:text-gray-900"
                title="Voltar para o início"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="border-gray-200 border-b p-4">
            <div className="relative mb-4">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar materiais..."
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <h3 className="mb-2 font-medium text-gray-900 text-sm">
                Categoria
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full bg-green-100 px-3 py-1 text-green-800 text-xs hover:bg-green-200"
                >
                  Todos
                </button>
                <button
                  type="button"
                  className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 text-xs hover:bg-gray-200"
                >
                  Plástico
                </button>
                <button
                  type="button"
                  className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 text-xs hover:bg-gray-200"
                >
                  Papel
                </button>
                <button
                  type="button"
                  className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 text-xs hover:bg-gray-200"
                >
                  Vidro
                </button>
                <button
                  type="button"
                  className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 text-xs hover:bg-gray-200"
                >
                  Metal
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-green-50 p-3">
                <div className="font-bold text-2xl text-green-600">47</div>
                <div className="text-green-700 text-sm">Materiais</div>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <div className="font-bold text-2xl text-blue-600">1.2k</div>
                <div className="text-blue-700 text-sm">EcoPoints</div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 text-lg">
                  Materiais Recicláveis
                </h2>
                <span className="text-gray-500 text-sm">47 encontrados</span>
              </div>

              {/* Item Cards */}
              <div className="space-y-3">
                {/* Item 1 */}
                <div className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <span className="font-semibold text-blue-600 text-sm">
                            P
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Garrafas PET
                          </h3>
                          <p className="text-gray-500 text-sm">João Silva</p>
                        </div>
                      </div>
                      <div className="mb-2 flex items-center space-x-4 text-gray-600 text-sm">
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          Vila Madalena, SP
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          2h atrás
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-600">
                          R$ 2,50/kg
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span className="text-gray-600 text-sm">4.8</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      <Bookmark className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <span className="font-semibold text-green-600 text-sm">
                            V
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Vidros Limpos
                          </h3>
                          <p className="text-gray-500 text-sm">Maria Santos</p>
                        </div>
                      </div>
                      <div className="mb-2 flex items-center space-x-4 text-gray-600 text-sm">
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          Pinheiros, SP
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          4h atrás
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-600">
                          R$ 1,80/kg
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span className="text-gray-600 text-sm">4.9</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      <Bookmark className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                          <span className="font-semibold text-sm text-yellow-600">
                            M
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Latas de Alumínio
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Carlos Oliveira
                          </p>
                        </div>
                      </div>
                      <div className="mb-2 flex items-center space-x-4 text-gray-600 text-sm">
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          Itaim Bibi, SP
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          6h atrás
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-600">
                          R$ 3,20/kg
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span className="text-gray-600 text-sm">4.7</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      <Bookmark className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                          <span className="font-semibold text-purple-600 text-sm">
                            E
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Eletrônicos
                          </h3>
                          <p className="text-gray-500 text-sm">Ana Costa</p>
                        </div>
                      </div>
                      <div className="mb-2 flex items-center space-x-4 text-gray-600 text-sm">
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          Jardins, SP
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          1d atrás
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-600">
                          R$ 15,00/un
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span className="text-gray-600 text-sm">4.6</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      <Bookmark className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="relative flex-1 rounded-sm">
          <MapComponent
            center={[-23.5505, -46.6333]} // São Paulo
            zoom={13}
            height="100%"
            className="w-full"
          />

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <div className="rounded-lg bg-white p-2 shadow-lg">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
                title="Aumentar zoom"
              >
                <span className="font-bold text-lg">+</span>
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
                title="Diminuir zoom"
              >
                <span className="font-bold text-lg">-</span>
              </button>
            </div>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg hover:bg-gray-100"
              title="Minha localização"
            >
              <MapPin className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Map Info */}
          <div className="absolute bottom-4 left-4 rounded-lg bg-white p-3 shadow-lg">
            <div className="flex items-center space-x-2 text-gray-600 text-sm">
              <input type="checkbox" className="rounded" defaultChecked />
              <span>Buscar conforme movo o mapa</span>
            </div>
          </div>

          {/* Back to Home Button - Mobile */}
          <div className="absolute right-4 bottom-4 md:hidden">
            <Link
              href="/"
              className="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white shadow-lg transition-colors hover:bg-green-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
