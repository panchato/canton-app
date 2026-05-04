"use server";

import { revalidatePath } from "next/cache";
import { supabase, type Producto } from "@/lib/supabase";

export async function getProductos(tipoFiltro?: string) {
  let query = supabase
    .from("canton_productos")
    .select("*")
    .order("tipo_producto")
    .order("producto");

  if (tipoFiltro && tipoFiltro !== "todos") {
    query = query.eq("tipo_producto", tipoFiltro);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as Producto[];
}

export async function getTipos() {
  const { data, error } = await supabase
    .from("canton_productos")
    .select("tipo_producto")
    .order("tipo_producto");
  if (error) throw new Error(error.message);
  const tipos = [...new Set(data.map((r) => r.tipo_producto).filter(Boolean))];
  return tipos as string[];
}

export async function addProducto(formData: FormData) {
  const payload = {
    feria: formData.get("feria") as string || "Canton",
    tipo_producto: formData.get("tipo_producto") as string,
    producto: formData.get("producto") as string,
    descripcion: formData.get("descripcion") as string || null,
    precio_usd: formData.get("precio_usd") ? Number(formData.get("precio_usd")) : null,
    moq: formData.get("moq") ? Number(formData.get("moq")) : null,
    proveedor: formData.get("proveedor") as string || null,
    pagina: formData.get("pagina") as string || null,
    email: formData.get("email") as string || null,
    sales: formData.get("sales") as string || null,
    sku: formData.get("sku") as string || null,
    precio_ref_clp: formData.get("precio_ref_clp") ? Number(formData.get("precio_ref_clp")) : null,
    lugar_ref: formData.get("lugar_ref") as string || null,
  };

  const { error } = await supabase.from("canton_productos").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function deleteProducto(id: number) {
  const { error } = await supabase.from("canton_productos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}
