'use client';

import { useState } from "react";

interface ProcessoSolicitacao {
  id: number;
  tipo: string;
  processoRelacionado: string;
  status: 'Em análise' | 'Deferido' | 'Indeferido' | 'Concluído';
  dataSolicitacao: string;
  observacoes?: string;
  historico: string[]; // histórico de atualizações
}

export default function Processo() {
  // Dados iniciais
  const [solicitacoes] = useState<ProcessoSolicitacao[]>([
    {
      id: 1,
      tipo: 'Solicitação de Isenção de Taxa',
      processoRelacionado: 'Processo Seletivo 2025 - Ensino Médio',
      status: 'Deferido',
      dataSolicitacao: '02/06/2025',
      historico: [
        '02/06/2025: Solicitação criada.',
        '05/06/2025: Documentos analisados.',
        '10/06/2025: Solicitação deferida.'
      ]
    },
    {
      id: 2,
      tipo: 'Recurso contra Indeferimento da Inscrição',
      processoRelacionado: 'Processo Seletivo 2025 - Ensino Médio',
      status: 'Em análise',
      dataSolicitacao: '05/06/2025',
      historico: [
        '05/06/2025: Recurso enviado.',
        '08/06/2025: Em análise pelo comitê.'
      ]
    },
    {
      id: 3,
      tipo: 'Solicitação de Sala Especial',
      processoRelacionado: 'Processo Seletivo 2025 - Ensino Fundamental',
      status: 'Indeferido',
      dataSolicitacao: '01/06/2025',
      observacoes: 'Faltou documento comprobatório',
      historico: [
        '01/06/2025: Solicitação criada.',
        '07/06/2025: Documentos insuficientes, indeferido.'
      ]
    },
    {
      id: 4,
      tipo: 'Recurso Final - Resultado Provisório',
      processoRelacionado: 'Processo Seletivo 2024 - Isenção',
      status: 'Concluído',
      dataSolicitacao: '10/03/2024',
      historico: [
        '10/03/2024: Recurso enviado.',
        '15/03/2024: Resultado revisado.',
        '20/03/2024: Processo finalizado.'
      ]
    },
  ]);

  // Estados para filtro
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('Todos');

  // Estado para modal
  const [modalAberto, setModalAberto] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<ProcessoSolicitacao | null>(null);

  // Função para abrir modal
  function abrirModal(solicitacao: ProcessoSolicitacao) {
    setSolicitacaoSelecionada(solicitacao);
    setModalAberto(true);
  }

  // Função para fechar modal
  function fecharModal() {
    setModalAberto(false);
    setSolicitacaoSelecionada(null);
  }

  // Aplicar filtros
  const listaFiltrada = solicitacoes.filter(item => {
    const tipoOk = filtroTipo === 'Todos' || item.tipo === filtroTipo;
    const statusOk = filtroStatus === 'Todos' || item.status === filtroStatus;
    return tipoOk && statusOk;
  });

  // Tipos e status disponíveis para filtro (dinâmico a partir da lista)
  const tiposDisponiveis = Array.from(new Set(solicitacoes.map(s => s.tipo)));
  const statusDisponiveis = Array.from(new Set(solicitacoes.map(s => s.status)));

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
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
          >
            <option value="Todos">Todos os Tipos</option>
            {tiposDisponiveis.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded p-2"
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
          >
            <option value="Todos">Todos os Status</option>
            {statusDisponiveis.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* LISTA DE SOLICITAÇÕES */}
        <div className="grid gap-4">
          {listaFiltrada.length === 0 && (
            <p className="text-center text-gray-600">Nenhuma solicitação encontrada para os filtros selecionados.</p>
          )}

          {listaFiltrada.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg cursor-pointer transition"
              onClick={() => abrirModal(item)}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-blue-700">{item.tipo}</h2>
                <span
                  className={`
                    text-sm px-3 py-1 rounded-full font-medium
                    ${item.status === 'Deferido' ? 'bg-green-100 text-green-700' :
                      item.status === 'Indeferido' ? 'bg-red-100 text-red-700' :
                      item.status === 'Concluído' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'}
                  `}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-1">
                <strong>Referente a:</strong> {item.processoRelacionado}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Data da Solicitação:</strong> {item.dataSolicitacao}
              </p>

              {item.observacoes && (
                <p className="text-sm text-red-600 mt-1">
                  <strong>Obs:</strong> {item.observacoes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL - HISTÓRICO */}
      {modalAberto && solicitacaoSelecionada && (
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

            <p className="mb-2 text-black"><strong>Tipo:</strong> {solicitacaoSelecionada.tipo}</p>
            <p className="mb-2 text-black"><strong>Processo Relacionado:</strong> {solicitacaoSelecionada.processoRelacionado}</p>
            <p className="mb-2 text-black"><strong>Status:</strong> {solicitacaoSelecionada.status}</p>
            <p className="mb-2 text-black"><strong>Data da Solicitação:</strong> {solicitacaoSelecionada.dataSolicitacao}</p>
            {solicitacaoSelecionada.observacoes && (
              <p className="mb-2 text-red-600"><strong>Observações:</strong> {solicitacaoSelecionada.observacoes}</p>
            )}

            <hr className="my-4" />

            <div className="max-h-48 overflow-y-auto text-gray-700">
              {solicitacaoSelecionada.historico.map((evento, i) => (
                <p key={i} className="mb-1 text-sm">{evento}</p>
              ))}
            </div>

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
  );
}
