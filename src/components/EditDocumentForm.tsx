"use client";
import React from "react";
import { useQuery, useMutation } from "react-query";

interface Doc {
  CodDoc: number;
  DocNome: string;
  DocCategoria: number;
}
interface Category {
  CodCategoria: number;
  CategoriaNome: string;
}
interface Props {
  initialDoc: Doc;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditDocumentForm({
  initialDoc,
  onSuccess,
  onCancel,
}: Props) {
  const { data: categorias = [] } = useQuery<Category[]>(
    "categorias",
    async () => {
      const res = await fetch("/api/arquivos/categoria");
      if (!res.ok) throw new Error("Erro ao buscar categorias");
      return res.json();
    }
  );

  const mutation = useMutation(
    async (payload: { DocNome: string; DocCategoria: number }) => {
      const res = await fetch(`/api/arquivos/docs/${initialDoc.CodDoc}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao atualizar documento");
      return res.json();
    },
    { onSuccess }
  );

  const [form, setForm] = React.useState({
    DocNome: initialDoc.DocNome,
    DocCategoria: initialDoc.DocCategoria,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      DocNome: form.DocNome,
      DocCategoria: parseInt(String(form.DocCategoria), 10),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nome do Documento</label>
        <input
          type="text"
          value={form.DocNome}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, DocNome: e.target.value }))
          }
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Categoria</label>
        <select
          value={form.DocCategoria}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              DocCategoria: parseInt(e.target.value, 10),
            }))
          }
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Selecione</option>
          {categorias.map((cat) => (
            <option key={cat.CodCategoria} value={cat.CodCategoria}>
              {cat.CategoriaNome}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {mutation.isLoading ? "Salvando..." : "Salvar"}
        </button>
      </div>
      {mutation.isError && (
        <p className="text-red-600">{(mutation.error as Error).message}</p>
      )}
    </form>
  );
}
