import { getProductos, getTipos } from "./actions";
import ProductosGrid from "./ProductosGrid";
import AddProductoForm from "./AddProductoForm";
import SortSelect from "./SortSelect";

export const dynamic = "force-dynamic";

const SORT_OPTIONS = [
  { value: "tipo_producto", label: "Tipo" },
  { value: "producto",     label: "Nombre" },
  { value: "precio_usd",  label: "Precio" },
  { value: "proveedor",   label: "Vendedor" },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; sort?: string }>;
}) {
  const { tipo, sort } = await searchParams;
  const [productos, tipos] = await Promise.all([
    getProductos(tipo, sort),
    getTipos(),
  ]);

  // Build a URL preserving existing params but swapping one key
  function href(key: string, value: string) {
    const params = new URLSearchParams();
    if (tipo) params.set("tipo", tipo);
    if (sort) params.set("sort", sort);
    params.set(key, value);
    return `/?${params}`;
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Lista Productos China</h1>
            <p className="text-xs text-gray-400">{productos.length} productos</p>
          </div>
          <div className="flex items-center gap-2">
            <SortSelect options={SORT_OPTIONS} current={sort ?? "tipo_producto"} tipo={tipo} />
            <AddProductoForm tipos={tipos} />
          </div>
        </div>

        {/* Filter pills */}
        <div className="overflow-x-auto px-4 pb-3">
          <div className="flex gap-2 w-max">
            <a
              href={sort ? `/?sort=${sort}` : "/"}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                !tipo ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              Todos
            </a>
            {tipos.map((t) => (
              <a
                key={t}
                href={href("tipo", t)}
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
