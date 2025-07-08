"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FaCheck, FaTimes, FaFilter } from "react-icons/fa";
import api from "@/utils/api";

// Tipagem dos candidatos
interface Candidato {
  id: number;
  nome: string;
  cpf: string;
  status: "Em Análise" | "Deferido" | "Indeferido" | "Isento";
  numeroInscricao?: string;
}

export default function BaixaPagamentos() {
  const queryClient = useQueryClient();
  const [filtro, setFiltro] = useState<"Todos" | "Deferido" | "Indeferido" | "Em Análise" | "Isento">("Todos");

  // Função para gerar número de inscrição
  const gerarNumeroInscricao = (id: number) => `INS-${id.toString().padStart(4, '0')}`;

  // Busca candidatos
  const { data: candidatos = [], isLoading } = useQuery<Candidato[]>(
    ['candidatos'],
    async () => {
      const res = await api.get("/api/candidato/deferimento");
      return res.data.candidatos.map((c: any) => ({
        id: c.id,
        nome: c.nome,
        cpf: c.cpf,
        status: c.status,
        numeroInscricao: c.status === 'Deferido' ? gerarNumeroInscricao(c.id) : undefined,
      }));
    }
  );

  // Mutations
  const deferirMutation = useMutation(
    ({ id }: { id: number }) => {
      const registro = gerarNumeroInscricao(id);
      const payload = { valor: 0, registro };
      return api.post(`/api/candidato/deferimento/${id}/deferir`, payload);
    },
    { onSuccess: () => queryClient.invalidateQueries(['candidatos']) }
  );

  const indeferirMutation = useMutation(
    ({ id }: { id: number }) => api.post(`/api/candidato/deferimento/${id}/indeferir`),
    { onSuccess: () => queryClient.invalidateQueries(['candidatos']) }
  );

  const isentoMutation = useMutation(
    ({ id }: { id: number }) => api.post(`/api/candidato/deferimento/${id}/isento`),
    { onSuccess: () => queryClient.invalidateQueries(['candidatos']) }
  );

  // Ações em massa
  const deferirTodos = () => {
    candidatos.forEach(c => deferirMutation.mutate({ id: c.id }));
  };

  const indeferirTodos = () => {
    candidatos.forEach(c => indeferirMutation.mutate({ id: c.id }));
  };

  // Lista filtrada
  const listaFiltrada = filtro === 'Todos'
    ? candidatos
    : candidatos.filter(c => c.status === filtro);

  // Contadores
  const totalDeferido = candidatos.filter(c => c.status === 'Deferido').length;
  const totalIndeferido = candidatos.filter(c => c.status === 'Indeferido').length;
  const totalEmAnalise = candidatos.filter(c => c.status === 'Em Análise').length;
  const totalIsentos = candidatos.filter(c => c.status === 'Isento').length;

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="p-4 bg-blue-50 rounded-xl text-black">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Avaliação de Pagamentos</h2>

      {/* Ações em massa */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={deferirTodos}
          className="flex items-center gap-1 bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          <FaCheck /> Deferir Todos
        </button>
        <button
          onClick={indeferirTodos}
          className="flex items-center gap-1 bg-red-800 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          <FaTimes /> Indeferir Todos
        </button>
      </div>

      {/* Filtro */}
      <div className="flex items-center gap-2 mb-4">
        <FaFilter className="text-blue-800" />
        <select
          value={filtro}
          onChange={e => setFiltro(e.target.value as any)}
          className="border rounded p-2 text-black"
        >
          <option value="Todos">Todos</option>
          <option value="Deferido">Deferido</option>
          <option value="Indeferido">Indeferido</option>
          <option value="Em Análise">Em Análise</option>
          <option value="Isento">Isento</option>
        </select>
      </div>

      {/* Status counts */}
      <div className="mb-4 text-sm">
        <p><strong className="text-blue-800">Total Deferidos:</strong> {totalDeferido}</p>
        <p><strong className="text-red-800">Total Indeferidos:</strong> {totalIndeferido}</p>
        <p><strong className="text-gray-800">Total Em Análise:</strong> {totalEmAnalise}</p>
        <p><strong className="text-yellow-800">Total Isentos:</strong> {totalIsentos}</p>
      </div>

      {/* Tabela */}
      <table className="w-full text-sm border rounded overflow-hidden">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Nome</th>
            <th className="p-2">CPF</th>
            <th className="p-2">Status</th>
            <th className="p-2">Nº Inscrição</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {listaFiltrada.map(c => (
            <tr key={c.id} className="border-b hover:bg-blue-100">
              <td className="p-2">{c.id}</td>
              <td className="p-2">{c.nome}</td>
              <td className="p-2">{c.cpf}</td>
              <td className="p-2">
                <span className={
                  c.status === "Deferido" ? "text-green-600 font-semibold" :
                  c.status === "Indeferido" ? "text-red-600 font-semibold" :
                  c.status === "Isento" ? "text-yellow-600 font-semibold" :
                  "text-gray-600 font-semibold"
                }>
                  {c.status}
                </span>
              </td>
              <td className="p-2">{c.numeroInscricao || "-"}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => deferirMutation.mutate({ id: c.id })}
                  disabled={deferirMutation.isLoading}
                  className="flex items-center gap-1 bg-blue-800 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => indeferirMutation.mutate({ id: c.id })}
                  disabled={indeferirMutation.isLoading}
                  className="flex items-center gap-1 bg-red-800 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  <FaTimes />
                </button>
                <button
                  onClick={() => isentoMutation.mutate({ id: c.id })}
                  disabled={isentoMutation.isLoading}
                  className="flex items-center gap-1 bg-yellow-800 text-white px-2 py-1 rounded hover:bg-yellow-700"
                >
                  Isento
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
