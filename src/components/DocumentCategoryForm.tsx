"use client";

import React from "react";
import { useMutation, useQueryClient } from "react-query";

interface Category {
  CodCategoria: number;
  CategoriaNome: string;
  CategoriaCor: string;
  CategoriaDescricao: string;
}

export default function DocumentCategoryForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (newCat: Omit<Category, "CodCategoria">) => {
      const res = await fetch("/api/arquivos/categoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat),
      });
      if (!res.ok) throw new Error("Erro ao criar categoria");
      return res.json();
    },
    {
      onSuccess: () => {
        // Invalidate categorias query to refetch
        queryClient.invalidateQueries("categorias");
      },
    }
  );

  const [form, setForm] = React.useState({
    CategoriaNome: "",
    CategoriaCor: "#000000",
    CategoriaDescricao: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form, {
      onSettled: () =>
        setForm({
          CategoriaNome: "",
          CategoriaCor: "#000000",
          CategoriaDescricao: "",
        }),
    });
  };

  return (
    <form
      className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-blue-800 mb-4">
        Criação de categorias
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Nome da Categoria <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Nome da Categoria"
            value={form.CategoriaNome}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, CategoriaNome: e.target.value }))
            }
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Cor da Categoria <span className="text-red-600">*</span>
          </label>
          <input
            type="color"
            value={form.CategoriaCor}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, CategoriaCor: e.target.value }))
            }
            required
            className="w-full h-10 border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Descrição
          </label>
          <input
            type="text"
            placeholder="Descrição da Categoria"
            value={form.CategoriaDescricao}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                CategoriaDescricao: e.target.value,
              }))
            }
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="bg-blue-700 text-white px-6 py-3 rounded-md shadow hover:bg-blue-800 transition-all duration-300 disabled:opacity-50"
        >
          {mutation.isLoading ? "Enviando..." : "Criar Categoria"}
        </button>

        {mutation.isError && (
          <p className="mt-4 text-red-600 font-semibold">
            {(mutation.error as Error).message}
          </p>
        )}
        {mutation.isSuccess && (
          <p className="mt-4 text-green-700">Categoria criada com sucesso!</p>
        )}
      </div>
    </form>
  );
}
