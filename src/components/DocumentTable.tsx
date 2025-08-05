"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditDocumentForm from "./EditDocumentForm";
import EditCategoryForm from "./EditCategoryForm";

interface Doc {
  CodDoc: number;
  DocNome: string;
  DocCaminho: string;
  DocCategoria: number;
}
interface Categoria {
  CodCategoria: number;
  CategoriaNome: string;
  CategoriaCor: string;
  CategoriaDescricao: string;
  docs: Doc[];
}

export default function DocumentTable() {
  const queryClient = useQueryClient();
  const [editingDoc, setEditingDoc] = useState<Doc | null>(null);
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(
    null
  );

  const {
    data: categorias = [],
    isLoading,
    isError,
  } = useQuery<Categoria[]>("docs", async () => {
    const res = await fetch("/api/arquivos/docs");
    if (!res.ok) throw new Error("Erro ao carregar dados");
    return res.json();
  });

  const deleteDocMutation = useMutation(
    async (codDoc: number) => {
      const res = await fetch(`/api/arquivos/docs/${codDoc}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao excluir documento");
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("docs");
      },
    }
  );

  const deleteCategoryMutation = useMutation(
    async (codCategoria: number) => {
      const res = await fetch(`/api/arquivos/categoria/${codCategoria}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao excluir categoria");
      }
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("docs");
      },
    }
  );

  if (isLoading)
    return (
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <p className="text-black">Carregando categorias...</p>
      </div>
    );

  if (isError)
    return (
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <p className="text-red-600">Erro ao carregar categorias.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">
      <h1>Listagem de documentos</h1>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Categoria</th>
            <th className="border px-4 py-2">Descrição</th>
            <th className="border px-4 py-2">Documentos</th>
            <th className="border px-4 py-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.CodCategoria} className="align-top border-t">
              <td className="border px-4 py-2 font-semibold">
                <span
                  className="inline-block px-2 rounded"
                  style={{ backgroundColor: cat.CategoriaCor }}
                >
                  <p className="text-white">{cat.CategoriaNome}</p>
                </span>
              </td>
              <td className="border px-4 py-2">{cat.CategoriaDescricao}</td>
              <td className="border px-4 py-2">
                {cat.docs.length === 0 ? (
                  <em>Sem documentos</em>
                ) : (
                  <ul className="list-disc list-inside space-y-1">
                    {cat.docs.map((doc) => (
                      <li
                        key={doc.CodDoc}
                        className="flex justify-between items-center"
                      >
                        <a
                          href={`${process.env.NEXT_PUBLIC_IMAGE_URL}${doc.DocCaminho}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {doc.DocNome}
                        </a>
                        <div className="flex gap-2">
                          <button
                            className="text-yellow-600 hover:text-yellow-800"
                            title="Editar documento"
                            onClick={() => setEditingDoc(doc)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            title="Excluir documento"
                            onClick={() => deleteDocMutation.mutate(doc.CodDoc)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button
                  className="text-yellow-600 hover:text-yellow-800"
                  title="Editar categoria"
                  onClick={() => setEditingCategory(cat)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  title="Excluir categoria"
                  onClick={() =>
                    deleteCategoryMutation.mutate(cat.CodCategoria)
                  }
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal: Editar Documento */}
      {editingDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Editar Documento</h3>
            <EditDocumentForm
              initialDoc={editingDoc}
              onSuccess={() => {
                queryClient.invalidateQueries("docs");
                setEditingDoc(null);
              }}
              onCancel={() => setEditingDoc(null)}
            />
          </div>
        </div>
      )}

      {/* Modal: Editar Categoria */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Editar Categoria</h3>
            <EditCategoryForm
              initialCategory={editingCategory}
              onSuccess={() => {
                queryClient.invalidateQueries("docs");
                setEditingCategory(null);
              }}
              onCancel={() => setEditingCategory(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
