'use client';

import { useState } from "react";

interface Inscricao {
  id: number;
  nome: string;
  cpf: string;
  numeroInscricao: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  sexo: 'Masculino' | 'Feminino';
  forca: 'Exército' | 'Marinha' | 'Aeronáutica';
  sala: string;
  turno: string;
  responsavel: string;
  telefone: string;
  fotoUrl: string; // Novo campo
}

export default function Inscricoes() {
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
      responsavel: 'Cap. Oliveira',
      telefone: '(11) 91234-5678',
      fotoUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
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
      responsavel: 'Ten. Barbosa',
      telefone: '(21) 99876-5432',
      fotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
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
      responsavel: 'Sgt. Pereira',
      telefone: '(31) 98765-4321',
      fotoUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
    }
  ]);

  const [pesquisa, setPesquisa] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroSexo, setFiltroSexo] = useState<string[]>([]);
  const [filtroForca, setFiltroForca] = useState<string[]>([]);
  const [cardAberto, setCardAberto] = useState<number | null>(null);

  const toggleFiltro = (filtro: string, valor: string) => {
    if (filtro === 'sexo') {
      setFiltroSexo(prev => prev.includes(valor) ? prev.filter(v => v !== valor) : [...prev, valor]);
    } else if (filtro === 'forca') {
      setFiltroForca(prev => prev.includes(valor) ? prev.filter(v => v !== valor) : [...prev, valor]);
    }
  };

  const filtradas = inscricoes.filter(i => {
    const pesquisaLower = pesquisa.toLowerCase();
    const correspondePesquisa = i.nome.toLowerCase().includes(pesquisaLower) || i.numeroInscricao.includes(pesquisa);
    const correspondeStatus = filtroStatus === 'Todos' || i.status === filtroStatus;
    const correspondeSexo = filtroSexo.length === 0 || filtroSexo.includes(i.sexo);
    const correspondeForca = filtroForca.length === 0 || filtroForca.includes(i.forca);
    return correspondePesquisa && correspondeStatus && correspondeSexo && correspondeForca;
  });

  const getCorTextoStatus = (status: string) => {
    switch (status) {
      case 'Aprovado': return 'text-green-600 font-semibold';
      case 'Rejeitado': return 'text-red-600 font-semibold';
      case 'Pendente': return 'text-yellow-600 font-semibold';
      default: return '';
    }
  };


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
        i.turno
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
          onChange={e => setFiltroStatus(e.target.value)}
        >
          <option>Todos</option>
          <option>Pendente</option>
          <option>Aprovado</option>
          <option>Rejeitado</option>
        </select>
        <button
          onClick={exportarCSV}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Exportar CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        {/* Filtro Sexo */}
        <div>
          <h4 className="font-semibold mb-1">Sexo:</h4>
          <div className="flex gap-2">
            {['Masculino', 'Feminino'].map(sexo => (
              <button
                key={sexo}
                onClick={() => toggleFiltro('sexo', sexo)}
                className={`px-3 py-1 rounded-full border ${filtroSexo.includes(sexo)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300'
                  } transition`}
              >
                {sexo}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro Força Armada */}
        <div>
          <h4 className="font-semibold mb-1">Força Armada:</h4>
          <div className="flex gap-2">
            {['Exército', 'Marinha', 'Aeronáutica'].map(forca => (
              <button
                key={forca}
                onClick={() => toggleFiltro('forca', forca)}
                className={`px-3 py-1 rounded-full border ${filtroForca.includes(forca)
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-700 border-gray-300'
                  } transition`}
              >
                {forca}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards com foto e cor de status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtradas.map(i => (
          <div
            key={i.id}
            onClick={() => setCardAberto(cardAberto === i.id ? null : i.id)}
            className="relative p-4 rounded-xl cursor-pointer shadow-md border hover:shadow-lg transition-all bg-white"
          >
            {/* Tooltip ao passar o mouse */}
            <div className="text-sm opacity-70 absolute top-2 right-2 hidden sm:block">
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Clique para mais informações
              </span>
            </div>
            <div className="text-blue-800">
              {/* Dados principais */}
              <p><strong>Nome:</strong> {i.nome}</p>
              <p><strong>CPF:</strong> {i.cpf}</p>
              <p><strong>Inscrição:</strong> {i.numeroInscricao}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={getCorTextoStatus(i.status)}>{i.status}</span>
              </p>
              <p><strong>Sexo:</strong> {i.sexo}</p>
              <p><strong>Força:</strong> {i.forca}</p>
              <p><strong>Sala:</strong> {i.sala}</p>
              <p><strong>Turno:</strong> {i.turno}</p>
            </div>
            {/* Dados do responsável (expandido) */}
            {cardAberto === i.id && (
              <div className="mt-4 pt-2 border-t text-sm text-gray-700">
                <p><strong>Responsável:</strong> {i.responsavel}</p>
                <p><strong>Telefone:</strong> {i.telefone}</p>
              </div>
            )}

            {/* Foto no canto inferior direito */}
            <img
              src={i.fotoUrl}
              alt={i.nome}
              className="absolute bottom-2 right-2 w-12 h-12 rounded-full border border-white shadow-md object-cover"
            />
          </div>
        ))}
      </div>

    </div>
  );
}