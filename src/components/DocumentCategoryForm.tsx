import { useEffect, useState } from "react";

export default function DocumentCategoryForm() {
  const [formData, setFormData] = useState({
    CategoriaNome: "",
    CategoriaCor: "",
    CategoriaDescricao: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Erro ao criar categoria");
      } else {
        setData(json);
        setFormData({
          CategoriaNome: "",
          CategoriaCor: "",
          CategoriaDescricao: "",
        });
      }
    } catch (err) {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

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
            value={formData.CategoriaNome}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                CategoriaNome: e.target.value,
              }))
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
            type="text"
            placeholder="Ex: #FFAA00"
            value={formData.CategoriaCor}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                CategoriaCor: e.target.value,
              }))
            }
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Descrição
          </label>
          <input
            type="text"
            placeholder="Descrição da Categoria"
            value={formData.CategoriaDescricao}
            onChange={(e) =>
              setFormData((prev) => ({
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
          disabled={isLoading}
          className="bg-blue-700 text-white px-6 py-3 rounded-md shadow hover:bg-blue-800 transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? "Enviando..." : "Criar Categoria"}
        </button>

        {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

        {data && !error && (
          <div className="mt-4 text-green-700">
            Categoria <strong>{data.CategoriaNome}</strong> criada com sucesso!
          </div>
        )}
      </div>
    </form>
  );
}
