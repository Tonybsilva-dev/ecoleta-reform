import { Map as MapComponent } from "@/components/map";

export default function MapTestPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 font-bold text-3xl text-gray-900">
            Teste do Mapa Leaflet
          </h1>
          <p className="text-gray-600">
            Esta página testa a integração do Leaflet com Next.js
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="mb-2 font-semibold text-gray-800 text-xl">
              Mapa Padrão (São Paulo)
            </h2>
            <MapComponent
              center={[-23.5505, -46.6333]}
              zoom={13}
              height="400px"
              className="rounded-lg border shadow-sm"
            />
          </div>

          <div>
            <h2 className="mb-2 font-semibold text-gray-800 text-xl">
              Mapa do Rio de Janeiro
            </h2>
            <MapComponent
              center={[-22.9068, -43.1729]}
              zoom={12}
              height="300px"
              className="rounded-lg border shadow-sm"
            />
          </div>

          <div>
            <h2 className="mb-2 font-semibold text-gray-800 text-xl">
              Mapa de Brasília
            </h2>
            <MapComponent
              center={[-15.7801, -47.9292]}
              zoom={11}
              height="350px"
              className="rounded-lg border shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
