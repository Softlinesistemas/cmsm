'use client';

import { useState } from "react";

// Definição da interface dos dados de inscrição
interface Inscricao {
  id: number;
  nome: string;
  cpf: string;
  numeroInscricao: string; // Novo campo: número de inscrição
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  sexo: 'Masculino' | 'Feminino';
  forca: 'Exército' | 'Marinha' | 'Aeronáutica';
  sala: string;
  turno: string;
}

export default function Inscricoes() {
  // Dados iniciais de exemplo
  const [inscricoes] = useState<Inscricao[]>([
    {
      id: 1,
      nome: 'João Silva',
      cpf: '123.456.789-00',
      numeroInscricao: '001',
      status: 'Pendente',
      sexo: 'Masculino',
      forca: 'Exército',
      sala: '101',
      turno: 'Manhã',
    },
    {
      id: 2,
      nome: 'Maria Souza',
      cpf: '987.654.321-00',
      numeroInscricao: '002',
      status: 'Aprovado',
      sexo: 'Feminino',
      forca: 'Marinha',
      sala: '102',
      turno: 'Tarde',
    },
    {
      id: 3,
      nome: 'Carlos Santos',
      cpf: '111.222.333-44',
      numeroInscricao: '003',
      status: 'Rejeitado',
      sexo: 'Masculino',
      forca: 'Aeronáutica',
      sala: '103',
      turno: 'Noite',
    },
  ]);

  // Estado para pesquisa por nome/número de inscrição
  const [pesquisa, setPesquisa] = useState<string>('');

  // Estado para filtros múltiplos
  const [filtroStatus, setFiltroStatus] = useState<string>('Todos');
  const [filtroSexo, setFiltroSexo] = useState<string[]>([]);
  const [filtroForca, setFiltroForca] = useState<string[]>([]);

  // Função para atualizar filtros múltiplos
  const toggleFiltro = (filtro: string, valor: string) => {
    if (filtro === 'sexo') {
      setFiltroSexo(prev =>
        prev.includes(valor) ? prev.filter(v => v !== valor) : [...prev, valor]
      );
    } else if (filtro === 'forca') {
      setFiltroForca(prev =>
        prev.includes(valor) ? prev.filter(v => v !== valor) : [...prev, valor]
      );
    }
  };

  // Filtragem dos dados
  const filtradas = inscricoes.filter(i => {
    const pesquisaLower = pesquisa.toLowerCase();
    const correspondePesquisa =
      i.nome.toLowerCase().includes(pesquisaLower) ||
      i.numeroInscricao.includes(pesquisa);

    const correspondeStatus = filtroStatus === 'Todos' || i.status === filtroStatus;
    const correspondeSexo = filtroSexo.length === 0 || filtroSexo.includes(i.sexo);
    const correspondeForca = filtroForca.length === 0 || filtroForca.includes(i.forca);

    return correspondePesquisa && correspondeStatus && correspondeSexo && correspondeForca;
  });

  // Função para exportar CSV
  const exportarCSV = () => {
    const rows = [
      ['ID', 'Nome', 'CPF', 'Nº Inscrição', 'Status', 'Sexo', 'Força', 'Sala', 'Turno'],
      ...filtradas.map(i => [
        i.id,
        i.nome,
        i.cpf,
        i.numeroInscricao,
        i.status,
        i.sexo,
        i.forca,
        i.sala,
        i.turno,
      ]),
    ];
    const csv = rows.map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inscricoes.csv';
    link.click();
    URL.revokeObjectURL(url); // Libera a memória
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Controle de Inscrições</h2>

      {/* Barra de pesquisa */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Pesquisar por nome ou nº de inscrição"
          value={pesquisa}
          onChange={e => setPesquisa(e.target.value)}
          className="border rounded p-2 flex-1"
        />

        {/* Filtro de status */}
        <select
          className="border rounded p-2"
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
        >
          <option>Todos</option>
          <option>Pendente</option>
          <option>Aprovado</option>
          <option>Rejeitado</option>
        </select>

        {/* Botão para exportar */}
        <button
          onClick={exportarCSV}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Exportar CSV
        </button>
      </div>

      {/* Filtros múltiplos: Sexo e Força */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Filtro por sexo */}
        <div>
          <h4 className="font-semibold">Sexo:</h4>
          <div className="flex gap-2 text-black">
            <label>
              <input
                type="checkbox"
                value="Masculino"
                checked={filtroSexo.includes('Masculino')}
                onChange={() => toggleFiltro('sexo', 'Masculino')}
              />
              Masculino
            </label>
            <label>
              <input
                type="checkbox"
                value="Feminino"
                checked={filtroSexo.includes('Feminino')}
                onChange={() => toggleFiltro('sexo', 'Feminino')}
              />
              Feminino
            </label>
          </div>
        </div>

        {/* Filtro por força */}
        <div>
          <h4 className="font-semibold">Força Armada:</h4>
          <div className="flex gap-2 text-black">
            <label>
              <input
                type="checkbox"
                value="Exército"
                checked={filtroForca.includes('Exército')}
                onChange={() => toggleFiltro('forca', 'Exército')}
              />
               Exército
            </label>
            <label>
              <input
                type="checkbox"
                value="Marinha"
                checked={filtroForca.includes('Marinha')}
                onChange={() => toggleFiltro('forca', 'Marinha')}
              />
              Marinha
            </label>
            <label>
              <input
                type="checkbox"
                value="Aeronáutica"
                checked={filtroForca.includes('Aeronáutica')}
                onChange={() => toggleFiltro('forca', 'Aeronáutica')}
              />
              Aeronáutica
            </label>
          </div>
        </div>
      </div>

      {/* Tabela responsiva */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-blue-800 text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Nome</th>
              <th className="border px-2 py-1">CPF</th>
              <th className="border px-2 py-1">Nº Inscrição</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Sexo</th>
              <th className="border px-2 py-1">Força</th>
              <th className="border px-2 py-1">Sala</th>
              <th className="border px-2 py-1">Turno</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map(i => (
              <tr key={i.id} className="hover:bg-gray-50 text-black">
                <td className="border px-2 py-1">{i.id}</td>
                <td className="border px-2 py-1">{i.nome}</td>
                <td className="border px-2 py-1">{i.cpf}</td>
                <td className="border px-2 py-1">{i.numeroInscricao}</td>
                <td className="border px-2 py-1">{i.status}</td>
                <td className="border px-2 py-1">{i.sexo}</td>
                <td className="border px-2 py-1">{i.forca}</td>
                <td className="border px-2 py-1">{i.sala}</td>
                <td className="border px-2 py-1">{i.turno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
