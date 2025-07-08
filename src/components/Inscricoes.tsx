'use client';

import { useState } from "react";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import api from "@/utils/api";

interface Inscricao {
  id?: number;
  nome: string;
  cpf: string;
  numeroInscricao: string;
  status: 'PENDENTE' | 'APROVADO' | 'REPROVADO';
  sexo: 'Masculino' | 'Feminino';
  forca: 'exercito' | 'marinha' | 'aeronautica';
  sala: string;
  telefone: string;
  turno?: string;
  responsavel?: string;
  fotoUrl?: string;
}

export default function Inscricoes() {
  const { data: inscricoes = [], isLoading, isError } = useQuery<Inscricao[]>(
    'inscricoes',
    () => api.get('api/candidato/inscricao').then(res => res.data)
  );

  const [pesquisa, setPesquisa] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'Todos' | Inscricao['status']>('Todos');
  const [filtroSexo, setFiltroSexo] = useState<Inscricao['sexo'][]>([]);
  const [filtroForca, setFiltroForca] = useState<Inscricao['forca'][]>([]);
  const [cardAberto, setCardAberto] = useState<number | null>(null);

  const toggleFiltro = (filtro: 'sexo' | 'forca', valor: string) => {
    if (filtro === 'sexo') {
      setFiltroSexo(prev =>
        prev.includes(valor as Inscricao['sexo'])
          ? prev.filter(v => v !== valor)
          : [...prev, valor as Inscricao['sexo']]
      );
    } else {
      setFiltroForca(prev =>
        prev.includes(valor as Inscricao['forca'])
          ? prev.filter(v => v !== valor)
          : [...prev, valor as Inscricao['forca']]
      );
    }
  };

  // loading / error
  if (isLoading) return <p>Carregando inscrições...</p>;
  if (isError) {
    toast.error('Não foi possível carregar as inscrições.');
    return <p>Erro ao carregar dados.</p>;
  }

  // aplica filtros
  const filtradas = inscricoes.filter(i => {
    const lower = pesquisa.toLowerCase();
    const condPesquisa =
      i.nome.toLowerCase().includes(lower) ||
      i.numeroInscricao.includes(pesquisa);
    const condStatus =
      filtroStatus === 'Todos' || i.status === filtroStatus;
    const condSexo =
      filtroSexo.length === 0 || filtroSexo.includes(i.sexo);
    const condForca =
      filtroForca.length === 0 || filtroForca.includes(i.forca);
    return condPesquisa && condStatus && condSexo && condForca;
  });

  const getCorTextoStatus = (status: Inscricao['status']) => {
    switch (status) {
      case 'APROVADO':
        return 'text-green-600 font-semibold';
      case 'REPROVADO':
        return 'text-red-600 font-semibold';
      case 'PENDENTE':
        return 'text-yellow-600 font-semibold';
      default:
        return 'text-yellow-600 font-semibold';
    }
  };

  // exportação CSV
  const exportarCSV = () => {
    const rows = [
      ['Nome', 'CPF', 'Nº Inscrição', 'Status', 'Sexo', 'Força', 'Sala', 'Telefone'],
      ...filtradas.map(i => [
        i.nome,
        i.cpf,
        i.numeroInscricao,
        i.status,
        i.sexo,
        i.forca,
        i.sala,
        i.telefone
      ])
    ];
    const csv = rows.map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inscricoes.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Controle de Inscrições</h2>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Pesquisar por nome ou nº de inscrição"
          value={pesquisa}
          onChange={e => setPesquisa(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <select
          className="border rounded p-2"
          value={filtroStatus}
          onChange={e =>
            setFiltroStatus(e.target.value as typeof filtroStatus)
          }
        >
          <option>Todos</option>
          <option value="PENDENTE">Pendente</option>
          <option value="APROVADO">Aprovado</option>
          <option value="REPROVADO">Reprovado</option>
        </select>
        <button
          onClick={exportarCSV}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Exportar CSV
        </button>
      </div>

      {/* filtros adicionais */}
      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        <div>
          <h4 className="font-semibold mb-1">Sexo:</h4>
          <div className="flex gap-2">
            {['M', 'F'].map(sexo => (
              <button
                key={sexo}
                onClick={() => toggleFiltro('sexo', sexo)}
                className={`px-3 py-1 rounded-full border ${
                  filtroSexo.includes(sexo as Inscricao['sexo'])
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300'
                } transition`}
              >
                {sexo === "F" ? "Feminino" : "Masculino"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-1">Força Armada:</h4>
          <div className="flex gap-2">
            {['exercito', 'marinha', 'aeronautica'].map(f => (
              <button
                key={f}
                onClick={() => toggleFiltro('forca', f)}
                className={`px-3 py-1 rounded-full border ${
                  filtroForca.includes(f as Inscricao['forca'])
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300'
                } transition`}
              >
                {f === "marinha" ? "Marinha" : f === "aeronautica" ? "Aeronautica" : f === "exercito" ? "Exercito" : "Civil"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtradas.map((i, idx) => (
          <div
            key={idx}
            onClick={() =>
              setCardAberto(cardAberto === idx ? null : idx)
            }
            className="relative p-4 rounded-xl cursor-pointer shadow-md border hover:shadow-lg transition-all bg-white"
          >
            <div className="text-blue-800">
              <p><strong>Nome:</strong> {i.nome}</p>
              <p><strong>CPF:</strong> {i.cpf}</p>
              <p><strong>Inscrição:</strong> {i.numeroInscricao}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={getCorTextoStatus(i.status)}>
                  {i.status || "PENDENTE"}
                </span>
              </p>
              <p><strong>Sexo:</strong> {i.sexo}</p>
              <p><strong>Força:</strong> {i.forca}</p>
              <p><strong>Sala:</strong> {i.sala}</p>
            </div>

            {cardAberto === idx && (
              <div className="mt-4 pt-2 border-t text-sm text-gray-700">
                {i.responsavel && (
                  <p><strong>Responsável:</strong> {i.responsavel}</p>
                )}
                {i.telefone && (
                  <p><strong>Telefone:</strong> {i.telefone}</p>
                )}
                {i.turno && (
                  <p><strong>Turno:</strong> {i.turno}</p>
                )}
              </div>
            )}

            {i.fotoUrl && (
              <img
                src={i.fotoUrl}
                alt={i.nome}
                className="absolute bottom-2 right-2 w-12 h-12 rounded-full border border-white shadow-md object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
