import { getProductos, getTipos } from "./actions";
import ProductosTable from "./ProductosTable";
import AddProductoForm from "./AddProductoForm";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo } = await searchParams;
  const [productos, tipos] = await Promise.all([
    getProductos(tipo),
    getTipos(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lista de Precios — Cantón</h1>
            <p className="text-sm text-gray-500 mt-1">{productos.length} productos</p>
          </div>
          <AddProductoForm tipos={tipos} />
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          <a
            href="/"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !tipo || tipo === "todos"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            Todos
          </a>
          {tipos.map((t) => (
            <a
              key={t}
              href={`/?tipo=${encodeURIComponent(t)}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tipo === t
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {t}
            </a>
          ))}
        </div>

        <ProductosTable productos={productos} />
      </div>
    </main>
  );
}
