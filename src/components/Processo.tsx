'use client'

import { useState } from "react";
import api from "@/utils/api";
import { useQuery } from "react-query";
import moment from "moment-timezone";

export default function Processo() {
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('Todos');
  const [modalAberto, setModalAberto] = useState(false);

  const { data: solicitacoes, isLoading, refetch } = useQuery(
    ['recursos', filtroStatus],
    async () => {
      const response = await api.get(`api/candidato/recurso/listagem?status=${filtroStatus}`);
      return response.data;
    },
    {
      retry: 5,
    }
  );

  function abrirModal(solicitacao: any) {
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Meus Processos e Solicitações
        </h1>

        {/* FILTROS */}
        <div className="flex gap-4 justify-center mb-6">

          <select
            className="border border-gray-300 rounded p-2"
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
          >
            <option value="Todos">Todos os Status</option>
            <option value="Pendente">Pendente</option>    
            <option value="Deferido">Deferido</option>    
            <option value="Indeferido">Indeferido</option>    
          </select>
        </div>

        {/* LISTA DE SOLICITAÇÕES */}
        <div className="grid gap-4">
          {solicitacoes?.resultados?.length ? solicitacoes.resultados.map((item: any) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg cursor-pointer transition"
              onClick={() => abrirModal(item)}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-blue-700">Isenção</h2>
                <span
                  className={`
                    text-sm px-3 py-1 rounded-full font-medium
                    ${item.isencao === 'Deferido' ? 'bg-green-100 text-green-700' :
                      item.isencao === 'Indeferido' ? 'bg-red-100 text-red-700' :                      
                      'bg-yellow-100 text-yellow-700'}
                  `}
                >
                  {item.isencao}
                </span>
              </div>           
              <p className="text-sm text-gray-600 mb-1">
                <strong>Candidato:</strong> {item.Nome} - CodIns: {item.CodIns}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Referente a:</strong> {solicitacoes.processoSel}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Data da Solicitação:</strong> {moment(item.DataCad).tz("America/Sao_Paulo").format("DD/MM/YYYY")} {item.HoraCad}
              </p>

              {item.observacoes && (
                <p className="text-sm text-red-600 mt-1">
                  <strong>Obs:</strong> {item.observacoes}
                </p>
              )}
              {/* MODAL - HISTÓRICO */}
              {modalAberto && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  onClick={fecharModal}
                >
                  <div
                    className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
                    onClick={e => e.stopPropagation()} 
                  >
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      Histórico da Solicitação
                    </h3>
        
                    <p className="mb-2 text-black"><strong>Processo Relacionado:</strong> {solicitacoes.processoSel}</p>
                    <p className="mb-2 text-black"><strong>Tipo:</strong>Isenção</p>
                    <p className="mb-2 text-black"><strong>Candidato:</strong> {item.Nome} - CodIns: {item.CodIns}</p>
                    <p className="mb-2 text-black"><strong>Status:</strong> {item.isencao}</p>
                    <p className="mb-2 text-black"><strong>Data da Solicitação:</strong> {moment(item.DataCad).tz("America/Sao_Paulo").format("DD/MM/YYYY")} {item.HoraCad}</p>
                    {item.observacao && (
                      <p className="mb-2 text-red-600"><strong>Observações:</strong> {item.observacao}</p>
                    )}                 
        
                    <button
                      onClick={fecharModal}
                      className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )) : <p className="text-center text-gray-600">Nenhuma solicitação encontrada para os filtros selecionados.</p>}
        </div>
      </div>

    </div>
  );
}
