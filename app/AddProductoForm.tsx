"use client";

import { useState, useRef } from "react";
import { addProducto } from "./actions";
import { supabase } from "@/lib/supabase";

export default function AddProductoForm({ tipos }: { tipos: string[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split(".").pop();
    const path = `new-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true });
    if (error) throw new Error(error.message);
    return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    setLoading(true);
    try {
      const fd = new FormData(formRef.current);
      if (imageFile) {
        fd.set("foto", await uploadImage(imageFile));
      }
      await addProducto(fd);
      formRef.current.reset();
      setImageFile(null);
      setImagePreview(null);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  const field = (name: string, label: string, type = "text", required = false) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}{required && " *"}</label>
      <input
        name={name}
        type={type}
        required={required}
        step={type === "number" ? "0.01" : undefined}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
      />
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
      >
        <span className="text-base leading-none">+</span>
        <span>Agregar</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          {/* Bottom sheet on mobile, centered modal on desktop */}
          <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Nuevo producto</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-3">
              {/* Image picker at top */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Foto</label>
                <label className="block cursor-pointer">
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-48 object-cover rounded-xl border border-gray-200" />
                  ) : (
                    <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-1 text-gray-400">
                      <span className="text-2xl">📷</span>
                      <span className="text-xs">Toca para elegir imagen</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Feria</label>
                  <input name="feria" defaultValue="Canton" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tipo *</label>
                  <input name="tipo_producto" list="tipos-list" required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                  <datalist id="tipos-list">
                    {tipos.map((t) => <option key={t} value={t} />)}
                  </datalist>
                </div>
              </div>

              {field("producto", "Producto", "text", true)}
              {field("descripcion", "Descripción")}

              <div className="grid grid-cols-2 gap-3">
                {field("precio_usd", "Precio USD", "number")}
                {field("moq", "MOQ", "number")}
                {field("precio_ref_clp", "Precio ref. CLP", "number")}
                {field("lugar_ref", "Lugar ref.")}
              </div>

              {field("proveedor", "Proveedor")}

              <div className="grid grid-cols-2 gap-3">
                {field("pagina", "Página web")}
                {field("email", "Email", "email")}
                {field("sales", "Contacto ventas")}
                {field("sku", "SKU")}
              </div>

              <div className="flex gap-3 pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
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
