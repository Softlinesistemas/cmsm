import { useEffect, useState } from "react";

export default function DocumentForm() {
  const [formData, setFormData] = useState({
    DocNome: "",
    DocCaminho: "",
    DocCategoria: "",
  });
  const [categorias, setCategorias] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Buscar categorias existentes
  useEffect(() => {
    fetch("/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Erro ao buscar categorias", err));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        setMsg({
          type: "error",
          text: json.error || "Erro ao enviar documento.",
        });
      } else {
        setMsg({
          type: "success",
          text: `Documento '${json.DocNome}' enviado com sucesso.`,
        });
        setFormData({ DocNome: "", DocCaminho: "", DocCategoria: "" });
      }
    } catch {
      setMsg({ type: "error", text: "Erro inesperado." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8 space-y-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-blue-800 mb-4">
        Envio de Documento
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Nome do Documento <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Contrato de aluguel"
            value={formData.DocNome}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, DocNome: e.target.value }))
            }
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Caminho (hash) <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: 0x44d1fa.pdf"
            value={formData.DocCaminho}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, DocCaminho: e.target.value }))
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
            value={formData.DocCategoria}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, DocCategoria: e.target.value }))
            }
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat: any) => (
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
          disabled={isSubmitting}
          className="bg-blue-700 text-white px-6 py-3 rounded-md shadow hover:bg-blue-800 transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? "Enviando..." : "Salvar Documento"}
        </button>

        {msg && (
          <p
            className={`mt-4 font-medium ${
              msg.type === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            {msg.text}
          </p>
        )}
      </div>
    </form>
  );
}
