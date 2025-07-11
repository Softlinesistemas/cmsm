'use client';
import { useQuery } from "react-query";
import { useState } from "react";
import { FaCheck, FaTimes, FaComment } from "react-icons/fa";
import api from "@/utils/api";
import toast from "react-hot-toast";
import LoadingIcon from "./common/LoadingIcon";

/**
 * Componente AvaliacaoRecursos
 * - Lista de recursos com dados: ID, Nome, CPF, Tipo e Status.
 * - Possui botões para Aprovar, Reprovar e Adicionar Observações.
 * - Modal para visualizar e adicionar observações ao recurso.
 */
const AvaliacaoRecursos = () => {
  // Estado inicial com lista de recursos
  const { data: candidatosRecursos, isLoading, refetch } = useQuery('candidatosRecursos', async () => {
    const response = await api.get('api/candidato/recurso');
    return response.data
  }, {
    retry: 5,
    refetchOnWindowFocus: false,
  });

  // Controle do modal
  const [modalAberto, setModalAberto] = useState<number | null>(null);
  const [observacao, setObservacao] = useState("");
  const [loadingAprovar, setLoadingAprovar] = useState(false);
  const [loadingReprovar, setLoadingReprovar] = useState(false);

  /**
   * Abre o modal para adicionar/visualizar observações.
   * @param recurso Recurso selecionado
   */
  const abrirModal = (id: any) => {
    setObservacao(""); // Limpa o campo para nova observação
    setModalAberto(id);
  };

  /**
   * Adiciona a observação ao recurso selecionado e fecha o modal.
   */
  const adicionarObservacao = async (numeroInscricao: number) => {
    if (observacao.trim() !== "") {
      try {  
        await api.put(`api/candidato/${numeroInscricao}`, { observacao });
        setObservacao("");
        refetch();
      } catch (error: any) {
        toast.error(error.response.data.error || error.response.data.message);;
      }
    }
  };

  const aprovarRecurso = async (numeroInscricao: number) => {
    setLoadingAprovar(true);
    try {  
      await api.put(`api/candidato/${numeroInscricao}`, { isencao: "Aprovado" });
      toast.success(`Pedido de insenção Aprovado para o candidato ${numeroInscricao}`);
      refetch();
    } catch (error: any) {
      toast.error(error.response.data.error || error.response.data.message);;
    }  
    setLoadingAprovar(false);
  };

  const desaprovarRecurso = async (numeroInscricao: number) => {
    setLoadingReprovar(true);
    try {  
      await api.put(`api/candidato/${numeroInscricao}`, { isencao: "Indeferido" });
      toast.success(`Pedido de insenção Indeferido para o candidato ${numeroInscricao}`);
      refetch();
    } catch (error: any) {
      toast.error(error.response.data.error || error.response.data.message);;
    }
    setLoadingReprovar(false);
  };

   const einCpfMask = (value: string) => {
    let cleaned = value.replace(/\D/g, "");

    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  };

  return (
    <div className="p-4 bg-blue-800 rounded-xl shadow-xl shadow-gray-400">
      {/* Título */}
      <h2 className="text-2xl font-bold mb-4 !text-white">Avaliação de Recursos</h2>

      {/* Tabela Responsiva */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg o  verflow-hidden">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="border px-4 py-2">CodIns</th>
              <th className="border px-4 py-2">Nome</th>
              <th className="border px-4 py-2">CPF</th>
              <th className="border px-4 py-2">Tipo</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {candidatosRecursos?.length ? candidatosRecursos?.map((r: any) => (
              <tr key={r.CodIns} className="bg-blue-50 hover:bg-blue-100 text-black">
                <td className="border px-4 py-2">{r.CodIns}</td>
                <td className="border px-4 py-2">{r.Nome}</td>
                <td className="border px-4 py-2">{einCpfMask(r.CPF)}</td>
                <td className="border px-4 py-2">Isenção</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      r.isencao === 'Deferido'
                        ? 'bg-green-600'
                        : r.isencao === 'Indeferido'
                        ? 'bg-red-600'
                        : 'bg-yellow-600'
                    }`}
                  >
                    {r.isencao || "Pendente"}
                  </span>
                </td>
                <td className="border px-4 py-2 flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => aprovarRecurso(r.CodIns)}
                    className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-500"
                  >
                    {loadingAprovar ? <LoadingIcon /> : <FaCheck />} Aprovar
                  </button>

                  <button
                    onClick={() => desaprovarRecurso(r.CodIns)}
                    className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500"
                  >
                    {loadingReprovar ? <LoadingIcon /> : <FaTimes />} Reprovar
                  </button>
                  <button
                    onClick={() => abrirModal(r.CodIns)}
                    className="flex items-center gap-1 bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
                  >
                    <FaComment /> Observações
                  </button>
                </td>
                {modalAberto ===  r.CodIns && (
                  <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
                      {/* Título do Modal */}
                      <h3 className="text-lg font-bold mb-2 text-blue-800">
                        Observações para {r.Nome}
                      </h3>
  
                      {/* Informações adicionais */}
                      <div className="flex w-full flex-col">
                        <p className="text-sm text-gray-600 mb-2">
                          CodIns: {r.CodIns}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          CPF: {einCpfMask(r.CPF)}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                        Tipo: Isenção
                        </p>                      
                      </div>
  
                      {/* Campo de observação */}
                      <textarea
                        value={observacao || r?.observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 mb-2 text-black"
                        rows={3}
                        maxLength={255}
                        placeholder="Digite a observação"
                      />
  
                      {/* Botões do modal */}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setModalAberto(null)}
                          className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => adicionarObservacao(r.CodIns)}
                          className="px-3 py-1 bg-blue-800 text-white rounded hover:bg-blue-700"
                        >
                          Salvar
                        </button>
                      </div>              
                    </div>
                  </div>
                )}
              </tr>
            )) : isLoading ? <LoadingIcon /> : <tr aria-colspan={6}><p>Ainda não há recursos para análise.</p></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal de Observações */}
    </div>
  );
};

export default AvaliacaoRecursos;