'use client'

import { useState } from "react";
import { FaCheck, FaTimes, FaFilter } from "react-icons/fa";

// Tipagem dos candidatos
interface Candidato {
  id: number;
  nome: string;
  cpf: string;
  numeroInscricao?: string; // Só para deferidos
  status: "Em Análise" | "Deferido" | "Indeferido" | "Isento";
}

const BaixaPagamentos = () => {
  // Lista inicial de candidatos (todos em análise)
  const [candidatos, setCandidatos] = useState<Candidato[]>([
    { id: 1, nome: "Carlos Santos", cpf: "123.456.789-00", status: "Em Análise" },
    { id: 2, nome: "Ana Lima", cpf: "987.654.321-00", status: "Em Análise" },
    { id: 3, nome: "Mariana Souza", cpf: "456.789.123-00", status: "Em Análise" },
  ]);

  // Estado para filtro
  const [filtro, setFiltro] = useState<"Todos" | "Deferido" | "Indeferido" | "Em Análise" | "Isento">("Todos");

  // Função para deferir um candidato individualmente
  const deferir = (id: number) => {
    setCandidatos(candidatos.map(c => {
      if (c.id === id) {
        return { ...c, status: "Deferido", numeroInscricao: gerarNumeroInscricao(c.id) };
      }
      return c;
    }));
  };

  // Função para indeferir um candidato individualmente
  const indeferir = (id: number) => {
    setCandidatos(candidatos.map(c => {
      if (c.id === id) {
        return { ...c, status: "Indeferido", numeroInscricao: undefined };
      }
      return c;
    }));
  };

    // Função para indeferir um candidato individualmente
  const isento = (id: number) => {
    setCandidatos(candidatos.map(c => {
      if (c.id === id) {
        return { ...c, status: "Isento", numeroInscricao: undefined };
      }
      return c;
    }));
  };

  // Gera um número de inscrição simples baseado no ID
  const gerarNumeroInscricao = (id: number) => `INS-${id.toString().padStart(4, '0')}`;

  // Função para deferir todos
  const deferirTodos = () => {
    setCandidatos(candidatos.map(c => ({
      ...c,
      status: "Deferido",
      numeroInscricao: gerarNumeroInscricao(c.id)
    })));
  };

  // Função para indeferir todos
  const indeferirTodos = () => {
    setCandidatos(candidatos.map(c => ({
      ...c,
      status: "Indeferido",
      numeroInscricao: undefined
    })));
  };

  // Filtra a lista com base no filtro selecionado
  const listaFiltrada = filtro === "Todos"
    ? candidatos
    : candidatos.filter(c => c.status === filtro);

  // Contadores por status
  const totalDeferido = candidatos.filter(c => c.status === "Deferido").length;
  const totalIndeferido = candidatos.filter(c => c.status === "Indeferido").length;
  const totalEmAnalise = candidatos.filter(c => c.status === "Em Análise").length;
  const totalIsentos = candidatos.filter(c => c.status === "Isento").length;

  return (
    <div className="p-4 bg-blue-50 rounded-xl text-black">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Avaliação de Pagamentos</h2>

      {/* Botões de ação em massa */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={deferirTodos}
          className="flex items-center gap-1 bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          <FaCheck /> Deferir 100
        </button>
        <button
          onClick={indeferirTodos}
          className="flex items-center gap-1 bg-red-800 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          <FaTimes /> Indeferir 100
        </button>
      </div>

      {/* Filtro por status */}
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
        </select>
      </div>

      {/* Quantitativo de status */}
      <div className="mb-4 text-sm">
        <p><strong className="text-blue-800">Total Deferidos:</strong> {totalDeferido}</p>
        <p><strong className="text-red-800">Total Indeferidos:</strong> {totalIndeferido}</p>
        <p><strong className="text-gray-800">Total Em Análise:</strong> {totalEmAnalise}</p>
      </div>

      {/* Tabela de candidatos */}
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
                <span
                  className={
                    c.status === "Deferido"
                      ? "text-green-600 font-semibold"
                      : c.status === "Indeferido"
                      ? "text-red-600 font-semibold"
                      : "text-gray-600 font-semibold"
                  }
                >
                  {c.status}
                </span>
              </td>
              <td className="p-2">{c.numeroInscricao || "-"}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => deferir(c.id)}
                  className="flex items-center gap-1 bg-blue-800 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  <FaCheck /> Deferir
                </button>
                <button
                  onClick={() => indeferir(c.id)}
                  className="flex items-center gap-1 bg-red-800 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  <FaTimes /> Indeferir
                </button>
                                <button
                  onClick={() => indeferir(c.id)}
                  className="flex items-center gap-1 bg-yellow-800 text-white px-2 py-1 rounded hover:bg-yellow-700"
                >
                  <FaTimes /> Isento
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BaixaPagamentos;