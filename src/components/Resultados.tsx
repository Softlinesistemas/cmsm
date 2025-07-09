'use client';

import { useState } from "react";
import { useQuery } from "react-query";
import api from "@/utils/api";
import LoadingIcon from "./common/LoadingIcon";
import toast from "react-hot-toast";

const Resultados = () => {
  const [modalidade, setModalidade] = useState<'6° ano'|'1° ano'>('6° ano');
  const [filtroStatus, setFiltroStatus] = useState<'Todos'|'APROVADO'|'APROVADO E CLASSIFICADO'|'REPROVADO'>('Todos');

  const statusParam = filtroStatus === 'Todos' ? '' : filtroStatus.replace(/ /g, '_').toUpperCase();

  const { data: candidatos, isLoading, error, refetch } = useQuery(
    ['resultados', modalidade, filtroStatus],
    async () => {
      const res = await api.get(
        `api/candidato/gabarito?ano=${modalidade}&status=${statusParam}`
      );
      return res.data;
    },
    { keepPreviousData: true }
  );

  const filtrarLocal = (lista: any[]) => {
    return lista
      .filter(c => c.Seletivo === modalidade)
      .filter(c => filtroStatus === 'Todos' || c.Status === filtroStatus);
  };

  const mostrar = candidatos ? filtrarLocal(candidatos) : [];

  return (
    <div className="flex justify-center bg-gray-50 py-10 min-h-screen">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-xl p-6">
        <h2 className="text-center text-3xl font-bold mb-6">Resultados por Modalidade</h2>

        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <button
            className={`px-4 py-2 rounded ${modalidade === '6° ano' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
            onClick={() => setModalidade('6° ano')}
          >
            6 anos
          </button>
          <button
            className={`px-4 py-2 rounded ${modalidade === '1° ano' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
            onClick={() => setModalidade('1° ano')}
          >
            1 ano
          </button>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {['Todos', 'APROVADO', 'APROVADO E CLASSIFICADO', 'REPROVADO'].map(st => (
            <button
              key={st}
              className={`px-4 py-2 rounded ${filtroStatus === st ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
              onClick={() => setFiltroStatus(st as any)}
            >{st}</button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center"><LoadingIcon /></div>
        ) : error ? (
          <div className="text-red-500 text-center">Erro ao carregar resultados.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full table-auto border text-sm text-center text-black">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="border px-4 py-2">Inscrição</th>
                  <th className="border px-4 py-2">Nome</th>
                  <th className="border px-4 py-2">CPF</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Pontuação</th>
                </tr>
              </thead>
              <tbody>
                {mostrar.length ? (
                  mostrar.map(c => (
                    <tr key={c.CodIns} className="hover:bg-gray-100">
                      <td className="border px-4 py-2 text-black">{c.CodIns}</td>
                      <td className="border px-4 py-2 text-black">{c.Nome}</td>
                      <td className="border px-4 py-2 text-black">{c.CPF}</td>
                      <td className="border px-4 py-2 text-black">
                        <span className={`text-black px-2 py-1 rounded-md font-semibold text-xs
                          ${c.NotaMatematica + c.NotaPortugues + 0 >= 80 ? 'bg-green-200 text-green-800'
                            : c.NotaMatematica + c.NotaPortugues + 0 < 60 ? 'bg-red-200 text-red-800'
                            : 'bg-yellow-200 text-yellow-800'}
                        `}>
                          {c.Status}
                        </span>
                      </td>
                      <td className="border px-4 py-2 text-black">{((c.NotaMatematica ?? 0) + (c.NotaPortugues ?? 0)).toFixed(1)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-gray-500">Nenhum resultado encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resultados;
