"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { deleteProducto, updateFoto } from "./actions";
import { supabase } from "@/lib/supabase";
import type { Producto } from "@/lib/supabase";

const fmtPrice = (n: number | null, prefix: string) =>
  n != null
    ? `${prefix}${n.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : null;

const fmtMoq = (n: number | null) =>
  n != null ? n.toLocaleString("es-CL") : null;

function ProductoCard({ p }: { p: Producto }) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [localFoto, setLocalFoto] = useState(p.foto);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${p.id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      await updateFoto(p.id, data.publicUrl);
      setLocalFoto(data.publicUrl);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${p.producto}"?`)) return;
    setDeleting(true);
    await deleteProducto(p.id);
  }

  return (
    <>
      {lightbox && localFoto && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <img
            src={localFoto}
            alt={p.producto}
            className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}

      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-opacity ${deleting ? "opacity-40 pointer-events-none" : ""}`}>
        {/* Image area */}
        <div className="relative aspect-square bg-gray-50">
          {localFoto ? (
            <button className="w-full h-full" onClick={() => setLightbox(true)}>
              <Image
                src={localFoto}
                alt={p.producto}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </button>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 text-5xl select-none">
              📦
            </div>
          )}

          {/* Upload button overlay */}
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-sm hover:bg-white transition-colors disabled:opacity-50"
            title="Subir foto"
          >
            {uploading ? (
              <span className="block h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImagePick}
          />

          {/* Category badge */}
          {p.tipo_producto && (
            <span className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full leading-tight max-w-[calc(100%-4rem)] truncate">
              {p.tipo_producto}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col gap-1 flex-1">
          <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{p.producto}</p>

          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            {fmtPrice(p.precio_usd, "US$") && (
              <span className="text-blue-600 font-bold text-sm">{fmtPrice(p.precio_usd, "US$")}</span>
            )}
            {fmtMoq(p.moq) && (
              <span className="text-gray-400 text-xs">MOQ {fmtMoq(p.moq)}</span>
            )}
          </div>

          {fmtPrice(p.precio_ref_clp, "$") && (
            <p className="text-gray-500 text-xs">Ref. CLP: {fmtPrice(p.precio_ref_clp, "$")}</p>
          )}

          {p.proveedor && (
            <p className="text-gray-400 text-xs truncate mt-0.5">{p.proveedor}</p>
          )}

          {p.email && (
            <a href={`mailto:${p.email}`} className="text-blue-500 text-xs truncate hover:underline">
              {p.email}
            </a>
          )}
        </div>

        {/* Delete */}
        <div className="px-3 pb-3">
          <button
            onClick={handleDelete}
            className="w-full text-xs text-red-400 hover:text-red-600 py-1.5 border border-red-100 hover:border-red-200 rounded-xl transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </>
  );
}

export default function ProductosGrid({ productos }: { productos: Producto[] }) {
  if (productos.length === 0) {
    return (
      <div className="text-center py-20 text-gray-300 text-4xl select-none">
        <p>📦</p>
        <p className="text-base text-gray-400 mt-3">No hay productos</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {productos.map((p) => (
        <ProductoCard key={p.id} p={p} />
      ))}
    </div>
  );
}
