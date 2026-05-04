"use client";

import { useState, useRef } from "react";
import { addProducto } from "./actions";

export default function AddProductoForm({ tipos }: { tipos: string[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    setLoading(true);
    await addProducto(new FormData(formRef.current));
    formRef.current.reset();
    setLoading(false);
    setOpen(false);
  }

  const field = (name: string, label: string, type = "text", required = false) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}{required && " *"}</label>
      <input
        name={name}
        type={type}
        required={required}
        step={type === "number" ? "0.01" : undefined}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        + Agregar producto
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Nuevo producto</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Feria</label>
                <input name="feria" defaultValue="Canton" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tipo producto *</label>
                <input
                  name="tipo_producto"
                  list="tipos-list"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <datalist id="tipos-list">
                  {tipos.map((t) => <option key={t} value={t} />)}
                </datalist>
              </div>

              <div className="col-span-2">
                {field("producto", "Producto", "text", true)}
              </div>
              <div className="col-span-2">
                {field("descripcion", "Descripción")}
              </div>

              {field("precio_usd", "Precio USD", "number")}
              {field("moq", "MOQ", "number")}
              {field("precio_ref_clp", "Precio ref. CLP", "number")}
              {field("lugar_ref", "Lugar ref.")}

              <div className="col-span-2">
                {field("proveedor", "Proveedor")}
              </div>
              {field("pagina", "Página web")}
              {field("email", "Email", "email")}
              {field("sales", "Contacto ventas")}
              {field("sku", "SKU")}

              <div className="col-span-2 flex justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
