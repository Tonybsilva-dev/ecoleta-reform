import {
  Bookmark,
  Clock,
  Filter,
  MapPin,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { Map as MapComponent } from "@/components/map";

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="font-bold text-2xl text-gray-900">
                Ecoleta Reform
              </h1>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
                <span>•</span>
                <span>5 km</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </button>
              <button
                type="button"
                className="flex items-center space-x-2 rounded-md bg-green-600 px-4 py-2 font-medium text-sm text-white hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Material</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Filters and Items List */}
        <div className="flex w-96 flex-col border-gray-200 border-r bg-white">
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
        <div className="relative flex-1">
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
              >
                <span className="font-bold text-lg">+</span>
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
              >
                <span className="font-bold text-lg">-</span>
              </button>
            </div>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg hover:bg-gray-100"
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
        </div>
      </main>
    </div>
  );
}
