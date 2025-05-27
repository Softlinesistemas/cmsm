'use client'

import { useState } from "react";
import { FaCheck, FaTimes, FaComment } from "react-icons/fa";

// Componente principal de Avaliação de Recursos
const AvaliacaoRecursos = () => {
  // Estado dos recursos
  const [recursos, setRecursos] = useState([
    { id: 1, nome: 'Recurso 1', status: 'Pendente', observacoes: [] },
    { id: 2, nome: 'Recurso 2', status: 'Aprovado', observacoes: [] },
  ]);

  // Estado para o modal de observações
  const [modalAberto, setModalAberto] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [recursoSelecionado, setRecursoSelecionado] = useState<any | null>(null);

  // Função para aprovar um recurso
  const aprovarRecurso = (id: any) => {
    setRecursos((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'Aprovado' } : r
      )
    );
  };

  // Função para desaprovar um recurso
  const desaprovarRecurso = (id: any) => {
    setRecursos((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'Reprovado' } : r
      )
    );
  };

  // Função para abrir o modal de observações
  const abrirModal = (recurso : any) => {
    setRecursoSelecionado(recurso);
    setObservacao("");
    setModalAberto(true);
  };

  // Função para adicionar observação
  const adicionarObservacao = () => {
    if (observacao.trim() !== "") {
      setRecursos((prev) =>
        prev.map((r: any) =>
          r.id === recursoSelecionado?.id
            ? { ...r, observacoes: [...r.observacoes, observacao] }
            : r
        )
      );
      setModalAberto(false);
    }
  };

  return (
    <div className="p-4 bg-blue-800 rounded-xl shadow-gray-400 shadow-xl">
      <h2 className="text-2xl font-bold mb-4 !text-white">Avaliação de Recursos</h2>

      <table className="w-full table-auto border rounded-lg overflow-hidden">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nome</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {recursos.map((r) => (
            <tr key={r.id} className="bg-blue-50 hover:bg-blue-100 text-black ">
              <td className="border px-4 py-2">{r.id}</td>
              <td className="border px-4 py-2">{r.nome}</td>
              <td className="border px-4 py-2">{r.status}</td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  onClick={() => aprovarRecurso(r.id)}
                  className="flex items-center gap-1 bg-blue-800 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  <FaCheck /> Aprovar
                </button>
                <button
                  onClick={() => desaprovarRecurso(r.id)}
                  className="flex items-center gap-1 bg-red-800 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  <FaTimes /> Reprovar
                </button>
                <button
                  onClick={() => abrirModal(r)}
                  className="flex items-center gap-1 bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
                >
                  <FaComment /> Observações
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de observações */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-2 text-blue-800">Observações para {recursoSelecionado.nome}</h3>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-2 text-black"
              rows={3}
              placeholder="Digite a observação"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalAberto(false)}
                className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarObservacao}
                className="px-3 py-1 bg-blue-800 text-white rounded hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>

            {recursoSelecionado.observacoes.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-red-800">Linha do Tempo:</h4>
                <ul className="list-disc list-inside text-black">
                  {recursoSelecionado.observacoes.map((obs: string, index: number) => (
                    <li key={index}>{obs}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvaliacaoRecursos;
