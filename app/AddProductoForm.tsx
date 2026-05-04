"use client";

import { useState, useRef } from "react";
import { addProducto } from "./actions";
import { supabase } from "@/lib/supabase";

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-lg animate-fade-in"
      onAnimationEnd={onDone}
    >
      {message}
    </div>
  );
}

export default function AddProductoForm({ tipos }: { tipos: string[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
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
      setToast("Producto guardado ✓");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50";

  return (
    <>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
      >
        <span className="text-base leading-none">+</span>
        <span>Agregar</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
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
              {/* Image picker */}
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
                  <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Feria</label>
                  <input name="feria" defaultValue="Canton" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tipo *</label>
                  <input name="tipo_producto" list="tipos-list" required placeholder="Ej: Mueble" className={inputClass} />
                  <datalist id="tipos-list">
                    {tipos.map((t) => <option key={t} value={t} />)}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Producto *</label>
                <input name="producto" required placeholder="Nombre del producto" className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
                <input name="descripcion" placeholder="Descripción opcional" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Precio USD</label>
                  <input
                    name="precio_usd"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0.00"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">MOQ</label>
                  <input
                    name="moq"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    placeholder="1000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Precio ref. CLP</label>
                  <input
                    name="precio_ref_clp"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0.00"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Lugar ref.</label>
                  <input name="lugar_ref" placeholder="Ej: Falabella" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Proveedor</label>
                <input name="proveedor" placeholder="Nombre del proveedor" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Página web</label>
                  <input name="pagina" placeholder="www.ejemplo.com" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input name="email" type="email" inputMode="email" placeholder="contacto@proveedor.com" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Contacto ventas</label>
                  <input name="sales" placeholder="Nombre contacto" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">SKU</label>
                  <input name="sku" placeholder="SKU-001" className={inputClass} />
                </div>
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
