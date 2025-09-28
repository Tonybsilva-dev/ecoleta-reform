import { Map as MapComponent } from "@/components/map";

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-2xl text-gray-900">
                Mapa Sustentável
              </h1>
              <p className="text-gray-600">
                Explore pontos de coleta e materiais próximos a você
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
              >
                Filtros
              </button>
              <button
                type="button"
                className="rounded-md bg-green-600 px-4 py-2 font-medium text-sm text-white hover:bg-green-700"
              >
                Adicionar Item
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="h-[calc(100vh-80px)]">
          <MapComponent
            center={[-23.5505, -46.6333]} // São Paulo
            zoom={13}
            height="100%"
            className="w-full"
          />
        </div>
      </main>
    </div>
  );
}
