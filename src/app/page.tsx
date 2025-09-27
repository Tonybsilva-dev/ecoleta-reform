import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="space-y-8 p-8 text-center">
        <h1 className="mb-4 font-bold text-6xl text-green-800">{APP_NAME}</h1>
        <p className="mx-auto max-w-2xl text-gray-600 text-xl">
          {APP_DESCRIPTION}
        </p>
        <div className="text-gray-500 text-sm">
          Plataforma em desenvolvimento - Next.js 14 + TypeScript + Tailwind CSS
        </div>
      </div>
    </div>
  );
}
