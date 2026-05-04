"use client";

import { useState } from "react";
import { deleteProducto } from "./actions";
import type { Producto } from "@/lib/supabase";

const fmt = (n: number | null, currency: string) =>
  n != null ? `${currency}${n.toLocaleString("es-CL")}` : "—";

export default function ProductosTable({ productos }: { productos: Producto[] }) {
  const [deleting, setDeleting] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este producto?")) return;
    setDeleting(id);
    await deleteProducto(id);
    setDeleting(null);
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        No hay productos para este filtro.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Tipo","Producto","Precio USD","MOQ","Precio CLP ref.","Proveedor","Email","SKU","Acciones"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {productos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.tipo_producto ?? "—"}</td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{p.producto}</td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{fmt(p.precio_usd, "US$")}</td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {p.moq != null ? p.moq.toLocaleString("es-CL") : "—"}
                </td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{fmt(p.precio_ref_clp, "$")}</td>
                <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{p.proveedor ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500">
                  {p.email ? (
                    <a href={`mailto:${p.email}`} className="text-blue-600 hover:underline">{p.email}</a>
                  ) : "—"}
                </td>
                <td className="px-4 py-3 text-gray-500">{p.sku ?? "—"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    className="text-red-500 hover:text-red-700 text-xs disabled:opacity-40"
                  >
                    {deleting === p.id ? "..." : "Eliminar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
