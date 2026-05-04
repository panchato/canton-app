import { createClient } from "@supabase/supabase-js";

export type Producto = {
  id: number;
  feria: string | null;
  tipo_producto: string | null;
  producto: string;
  descripcion: string | null;
  precio_usd: number | null;
  moq: number | null;
  proveedor: string | null;
  pagina: string | null;
  email: string | null;
  sales: string | null;
  sku: string | null;
  foto: string | null;
  precio_ref_clp: number | null;
  lugar_ref: string | null;
  created_at: string;
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
