'use client'

import { useState } from "react";

// Dados mockados com lógica de status baseada na pontuação
const dadosMock = [
  { inscricao: '2025001', nome: 'João Silva', cpf: '123.456.789-00', contatoResponsavel: '(84) 99999-0000', pontuacao: 87.5, modalidade: '6anos' },
  { inscricao: '2025002', nome: 'Maria Souza', cpf: '987.654.321-00', contatoResponsavel: '(84) 98888-0000', pontuacao: 62.3, modalidade: '1ano' },
  { inscricao: '2025003', nome: 'Lucas Lima', cpf: '111.222.333-44', contatoResponsavel: '(84) 97777-0000', pontuacao: 79.2, modalidade: '6anos' },
  { inscricao: '2025004', nome: 'Ana Paula', cpf: '222.333.444-55', contatoResponsavel: '(84) 91111-0000', pontuacao: 55.0, modalidade: '1ano' },
  { inscricao: '2025005', nome: 'Carlos Mendes', cpf: '333.444.555-66', contatoResponsavel: '(84) 92222-0000', pontuacao: 90.4, modalidade: '6anos' },
  { inscricao: '2025006', nome: 'Fernanda Torres', cpf: '444.555.666-77', contatoResponsavel: '(84) 93333-0000', pontuacao: 81.1, modalidade: '6anos' },
  { inscricao: '2025007', nome: 'Bruno Rocha', cpf: '555.666.777-88', contatoResponsavel: '(84) 94444-0000', pontuacao: 47.3, modalidade: '1ano' },
  { inscricao: '2025008', nome: 'Isabela Dias', cpf: '666.777.888-99', contatoResponsavel: '(84) 95555-0000', pontuacao: 77.9, modalidade: '6anos' },
  { inscricao: '2025009', nome: 'Ricardo Alves', cpf: '777.888.999-00', contatoResponsavel: '(84) 96666-0000', pontuacao: 58.5, modalidade: '1ano' },
  { inscricao: '2025010', nome: 'Juliana Costa', cpf: '888.999.000-11', contatoResponsavel: '(84) 97777-0000', pontuacao: 83.2, modalidade: '6anos' },
].map(dado => ({
  ...dado,
  status:
    dado.pontuacao >= 80 ? 'Aprovado e Classificado' :
      dado.pontuacao < 59 ? 'Reprovado' :
        'Aprovado'
}));

const Resultados = () => {
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState<'6anos' | '1ano'>('6anos');
  const [filtroStatus, setFiltroStatus] = useState<'Todos' | 'Aprovado' | 'Aprovado e Classificado' | 'Reprovado'>('Todos');

  // Filtro por modalidade e status
  const resultadosFiltrados = dadosMock.filter((r) => {
    const filtroModalidade = r.modalidade === modalidadeSelecionada;
    const filtroPorStatus = filtroStatus === 'Todos' || r.status === filtroStatus;
    return filtroModalidade && filtroPorStatus;
  });

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Resultados por Modalidade</h2>

        {/* Botões de modalidade */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <p className="font-semibold text-black">Selecionar Ano:</p>
          <button
            onClick={() => setModalidadeSelecionada('6anos')}
            className={`px-4 py-2 rounded ${modalidadeSelecionada === '6anos' ? 'bg-blue-600 text-white' : 'bg-gray-400'}`}
          >
            6 anos
          </button>
          <button
            onClick={() => setModalidadeSelecionada('1ano')}
            className={`px-4 py-2 rounded ${modalidadeSelecionada === '1ano' ? 'bg-blue-600 text-white' : 'bg-gray-400'}`}
          >
            1 ano
          </button>
        </div>

        {/* Filtro por status */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <p className="font-semibold text-black">Filtrar por Status:</p>
          {['Todos', 'Aprovado', 'Aprovado e Classificado', 'Reprovado'].map(status => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status as any)}
              className={`px-4 py-2 rounded ${filtroStatus === status ? 'bg-green-600 text-white' : 'bg-gray-400'}`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Tabela */}
        <div className="overflow-auto">
          <table className="w-full table-auto border text-sm text-center">
            <thead className="bg-blue-700 font-semibold text-write">
              <tr>
                <th className="border px-4 py-2">Inscrição</th>
                <th className="border px-4 py-2">Nome</th>
                <th className="border px-4 py-2">CPF</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Contato</th>
                <th className="border px-4 py-2">Pontuação</th>
              </tr>
            </thead>
            <tbody>
              {resultadosFiltrados.length > 0 ? (
                resultadosFiltrados.map((r) => (
                  <tr key={r.inscricao} className="hover:bg-gray-50 text-black">
                    <td className="border px-4 py-2">{r.inscricao}</td>
                    <td className="border px-4 py-2">{r.nome}</td>
                    <td className="border px-4 py-2">{r.cpf}</td>
                    <td>
                      <span
                        className={`
                              px-2 py-1 rounded-md font-semibold text-xs
                              ${r.pontuacao >= 80
                            ? 'bg-green-200 text-green-800'
                            : r.pontuacao < 60
                              ? 'bg-red-200 text-red-800'
                              : 'bg-yellow-200 text-yellow-800'
                          }
                           `}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="border px-4 py-2">{r.contatoResponsavel}</td>
                    <td className="border px-4 py-2">{r.pontuacao.toFixed(1)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Nenhum resultado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Resultados;