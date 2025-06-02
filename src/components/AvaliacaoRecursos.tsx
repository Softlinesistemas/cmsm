'use client';

import { useState } from "react";
import { FaCheck, FaTimes, FaComment } from "react-icons/fa";

/**
 * Componente AvaliacaoRecursos
 * - Lista de recursos com dados: ID, Nome, CPF, Tipo e Status.
 * - Possui botões para Aprovar, Reprovar e Adicionar Observações.
 * - Modal para visualizar e adicionar observações ao recurso.
 */
const AvaliacaoRecursos = () => {
  // Estado inicial com lista de recursos
  const [recursos, setRecursos] = useState([
    {
      id: 1,
      nome: 'Recurso 1',
      cpf: '000.000.000-00',
      tipo: 'Recurso de Concurso',
      status: 'Pendente',
      observacoes: ['Primeira observação'],
    },
    {
      id: 2,
      nome: 'Recurso 2',
      cpf: '111.111.111-11',
      tipo: 'Recurso de Inscrição',
      status: 'Aprovado',
      observacoes: [],
    },
  ]);

  // Controle do modal
  const [modalAberto, setModalAberto] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [recursoSelecionado, setRecursoSelecionado] = useState<any | null>(null);

  /**
   * Aprova o recurso alterando o status para "Aprovado".
   * @param id ID do recurso
   */
  const aprovarRecurso = (id: number) => {
    setRecursos((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'Aprovado' } : r
      )
    );
  };

  /**
   * Reprova o recurso alterando o status para "Reprovado".
   * @param id ID do recurso
   */
  const desaprovarRecurso = (id: number) => {
    setRecursos((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'Reprovado' } : r
      )
    );
  };

  /**
   * Abre o modal para adicionar/visualizar observações.
   * @param recurso Recurso selecionado
   */
  const abrirModal = (recurso: any) => {
    setRecursoSelecionado(recurso);
    setObservacao(""); // Limpa o campo para nova observação
    setModalAberto(true);
  };

  /**
   * Adiciona a observação ao recurso selecionado e fecha o modal.
   */
  const adicionarObservacao = () => {
    if (observacao.trim() !== "") {
      setRecursos((prev) =>
        prev.map((r) =>
          r.id === recursoSelecionado?.id
            ? { ...r, observacoes: [...r.observacoes, observacao] }
            : r
        )
      );
      setModalAberto(false);
    }
  };

  return (
    <div className="p-4 bg-blue-800 rounded-xl shadow-xl shadow-gray-400">
      {/* Título */}
      <h2 className="text-2xl font-bold mb-4 !text-white">Avaliação de Recursos</h2>

      {/* Tabela Responsiva */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg overflow-hidden">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Nome</th>
              <th className="border px-4 py-2">CPF</th>
              <th className="border px-4 py-2">Tipo</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {recursos.map((r) => (
              <tr key={r.id} className="bg-blue-50 hover:bg-blue-100 text-black">
                <td className="border px-4 py-2">{r.id}</td>
                <td className="border px-4 py-2">{r.nome}</td>
                <td className="border px-4 py-2">{r.cpf}</td>
                <td className="border px-4 py-2">{r.tipo}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs
                      ${
                        r.status === 'Aprovado' ? 'bg-green-600' :
                        r.status === 'Reprovado' ? 'bg-red-600' :
                        'bg-yellow-600'
                      }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="border px-4 py-2 flex flex-wrap gap-2 justify-center">
                  {/* Botão Aprovar */}
                  <button
                    onClick={() => aprovarRecurso(r.id)}
                    className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-500"
                  >
                    <FaCheck /> Aprovar
                  </button>

                  {/* Botão Reprovar */}
                  <button
                    onClick={() => desaprovarRecurso(r.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500"
                  >
                    <FaTimes /> Reprovar
                  </button>

                  {/* Botão Observações */}
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
      </div>

      {/* Modal de Observações */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
            {/* Título do Modal */}
            <h3 className="text-lg font-bold mb-2 text-blue-800">
              Observações para {recursoSelecionado.nome}
            </h3>

            {/* Informações adicionais */}
            <p className="text-sm text-gray-600 mb-2">
              CPF: {recursoSelecionado.cpf} | Tipo: {recursoSelecionado.tipo}
            </p>

            {/* Campo de observação */}
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-2 text-black"
              rows={3}
              placeholder="Digite a observação"
            />

            {/* Botões do modal */}
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

            {/* Linha do tempo das observações */}
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