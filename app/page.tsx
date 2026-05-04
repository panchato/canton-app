import { getProductos, getTipos } from "./actions";
import ProductosGrid from "./ProductosGrid";
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
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Lista Cantón</h1>
            <p className="text-xs text-gray-400">{productos.length} productos</p>
          </div>
          <AddProductoForm tipos={tipos} />
        </div>

        {/* Filter pills — horizontally scrollable */}
        <div className="overflow-x-auto px-4 pb-3">
          <div className="flex gap-2 w-max">
            <a
              href="/"
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                !tipo ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              Todos
            </a>
            {tipos.map((t) => (
              <a
                key={t}
                href={`/?tipo=${encodeURIComponent(t)}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  tipo === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-4">
        <ProductosGrid productos={productos} />
      </div>
    </main>
  );
}
