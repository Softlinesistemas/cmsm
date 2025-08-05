import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

interface Category {
  CodCategoria: number;
  CategoriaNome: string;
}
interface DocResponse {
  DocNome: string;
}

export default function DocumentForm() {
  const queryClient = useQueryClient();
  const {
    data: categorias = [],
    isLoading: catsLoading,
    isError: catsError,
  } = useQuery("categorias", async () => {
    const res = await fetch("/api/arquivos/categoria");
    if (!res.ok) throw new Error("Erro ao buscar categorias");
    return res.json();
  });

  const mutation = useMutation(
    async (formData: FormData) => {
      const res = await fetch("/api/arquivos/docs", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Erro ao enviar documento");
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("docs");
      },
    }
  );

  const [form, setForm] = React.useState({ DocNome: "", DocCategoria: "" });
  const [file, setFile] = React.useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("DocNome", form.DocNome);
    data.append("DocCategoria", form.DocCategoria);
    if (file) data.append("file", file);
    mutation.mutate(data, {
      onSettled: () => setForm({ DocNome: "", DocCategoria: "" }),
    });
  };

  return (
    <form
      className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8 space-y-6"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold text-blue-800 mb-4">
        Envio de Documento
      </h2>

      {catsLoading && <p className="text-black">Carregando categorias...</p>}
      {catsError && <p className="text-red-600">Erro ao carregar categorias</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Documento <span className="text-red-600">*</span>
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Nome Personalizado
          </label>
          <input
            type="text"
            placeholder="Ex: Contrato de aluguel"
            value={form.DocNome}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, DocNome: e.target.value }))
            }
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Categoria <span className="text-red-600">*</span>
          </label>
          <select
            value={form.DocCategoria}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, DocCategoria: e.target.value }))
            }
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat: Category) => (
              <option key={cat.CodCategoria} value={cat.CodCategoria}>
                {cat.CategoriaNome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="bg-blue-700 text-white px-6 py-3 rounded-md shadow hover:bg-blue-800 transition-all duration-300 disabled:opacity-50"
        >
          {mutation.isLoading ? "Enviando..." : "Salvar Documento"}
        </button>
        {mutation.isError && (
          <p className="mt-4 text-red-600">
            {(mutation.error as Error).message}
          </p>
        )}
        {mutation.isSuccess && (
          <p className="mt-4 text-green-700">Documento enviado com sucesso.</p>
        )}
      </div>
    </form>
  );
}
