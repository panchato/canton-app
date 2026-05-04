"use client";

import { useRouter } from "next/navigation";

type Option = { value: string; label: string };

export default function SortSelect({
  options,
  current,
  tipo,
}: {
  options: Option[];
  current: string;
  tipo?: string;
}) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams();
    if (tipo) params.set("tipo", tipo);
    params.set("sort", e.target.value);
    router.push(`/?${params}`);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="text-xs font-medium text-gray-600 bg-gray-100 border-0 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
