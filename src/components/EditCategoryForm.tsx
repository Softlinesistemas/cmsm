"use client";

import React, { useState } from "react";
import { useMutation } from "react-query";

interface Categoria {
  CodCategoria: number;
  CategoriaNome: string;
  CategoriaCor: string;
  CategoriaDescricao: string;
}

interface EditCategoryFormProps {
  initialCategory: Categoria;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditCategoryForm({
  initialCategory,
  onSuccess,
  onCancel,
}: EditCategoryFormProps) {
  const [formData, setFormData] = useState({
    CategoriaNome: initialCategory.CategoriaNome,
    CategoriaCor: initialCategory.CategoriaCor,
    CategoriaDescricao: initialCategory.CategoriaDescricao,
  });

  const mutation = useMutation(
    async () => {
      const res = await fetch(
        `/api/arquivos/categoria/${initialCategory.CodCategoria}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao atualizar categoria");
      }
      return res.json();
    },
    {
      onSuccess: () => {
        onSuccess();
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium text-sm text-gray-700">
          Nome da Categoria
        </label>
        <input
          type="text"
          value={formData.CategoriaNome}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, CategoriaNome: e.target.value }))
          }
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-medium text-sm text-gray-700">
          Cor da Categoria
        </label>
        <input
          type="color"
          value={formData.CategoriaCor}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, CategoriaCor: e.target.value }))
          }
          className="w-20 h-10 p-1 border rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium text-sm text-gray-700">
          Descrição
        </label>
        <textarea
          value={formData.CategoriaDescricao}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              CategoriaDescricao: e.target.value,
            }))
          }
          className="w-full border rounded px-3 py-2"
          rows={3}
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {mutation.isLoading ? "Salvando..." : "Salvar"}
        </button>
      </div>

      {mutation.isError && (
        <p className="text-red-600 text-sm">
          {(mutation.error as Error).message}
        </p>
      )}
    </form>
  );
}
