import React, { useState } from "react";

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

interface Props {
  categorias: Categoria[];
}

export default function CategoriasAccordion({ categorias }: Props) {
  const [openCategory, setOpenCategory] = useState<number | null>(null);

  const toggleCategory = (id: number) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 p-10">
      <h2 className="text-center text-blue-900 font-semibold uppercase text-md sm:text-md mb-6">
        Editais e Documentos
      </h2>

      <div className="space-y-4">
        {categorias.map((categoria) => (
          <div
            key={categoria.CodCategoria}
            className="bg-gray-100 rounded shadow"
          >
            {/* Cabeçalho Accordion */}
            <button
              onClick={() => toggleCategory(categoria.CodCategoria)}
              className="w-full flex items-center justify-between px-4 py-4 focus:outline-none"
              aria-expanded={openCategory === categoria.CodCategoria}
              aria-controls={`categoria-panel-${categoria.CodCategoria}`}
              id={`categoria-header-${categoria.CodCategoria}`}
              type="button"
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-block px-2 py-1 rounded text-white font-semibold"
                  style={{ backgroundColor: categoria.CategoriaCor }}
                  title={categoria.CategoriaCor}
                >
                  {categoria.CategoriaNome}
                </span>
                <p className="text-gray-700 text-sm">
                  {categoria.CategoriaDescricao}
                </p>
              </div>
              <span className="text-xl font-bold text-gray-600 select-none">
                {openCategory === categoria.CodCategoria ? "−" : "+"}
              </span>
            </button>

            {/* Conteúdo Accordion */}
            {openCategory === categoria.CodCategoria && (
              <div
                id={`categoria-panel-${categoria.CodCategoria}`}
                role="region"
                aria-labelledby={`categoria-header-${categoria.CodCategoria}`}
                className="border-t border-gray-300"
              >
                {categoria.docs.length > 0 ? (
                  categoria.docs.map((doc) => (
                    <div
                      key={doc.CodDoc}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-3 border-b border-gray-200"
                    >
                      <p className="mt-2 md:mt-0 md:ml-4 text-sm text-gray-800">
                        {doc.DocNome}
                      </p>
                      <a
                        href={`${process.env.NEXT_PUBLIC_IMAGE_URL}${doc.DocCaminho}`}
                        target="_blank"
                        download
                        className="text-blue-900 font-semibold px-4 py-2 rounded hover:text-blue-800 transition-colors"
                      >
                        Abrir
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-gray-600 italic">
                    Nenhum documento cadastrado nesta categoria.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
