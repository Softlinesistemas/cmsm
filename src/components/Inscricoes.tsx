'use client';

import { useState } from "react";

interface Inscricao {
  id: number;
  nome: string;
  cpf: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
}

export default function Inscricoes() {
  const [inscricoes] = useState<Inscricao[]>([
    { id: 1, nome: 'João Silva', cpf: '123.456.789-00', status: 'Pendente' },
    { id: 2, nome: 'Maria Souza', cpf: '987.654.321-00', status: 'Aprovado' },
    { id: 3, nome: 'Carlos Santos', cpf: '111.222.333-44', status: 'Rejeitado' },
  ]);
  const [filtro, setFiltro] = useState<'Todos' | 'Pendente' | 'Aprovado' | 'Rejeitado'>('Todos');

  const filtradas = filtro === 'Todos' ? inscricoes : inscricoes.filter(i => i.status === filtro);

  const exportarCSV = () => {
    const rows = [['ID', 'Nome', 'CPF', 'Status'], ...filtradas.map(i => [i.id, i.nome, i.cpf, i.status])];
    const csv = rows.map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inscricoes.csv';
    link.click();
    URL.revokeObjectURL(url); // Revoga o objeto para evitar vazamento de memória
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Controle de Inscrições</h2>
      <div className="flex items-center mb-4 space-x-2">
        <select className="border rounded p-1" value={filtro} onChange={e => setFiltro(e.target.value as any)}>
          <option>Todos</option>
          <option>Pendente</option>
          <option>Aprovado</option>
          <option>Rejeitado</option>
        </select>
        <button onClick={exportarCSV} className="bg-green-500 text-white px-4 py-1 rounded">Exportar CSV</button>
      </div>
      <table className="w-full table-auto border  text-black ">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nome</th>
            <th className="border px-4 py-2">CPF</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map(i => (
            <tr key={i.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{i.id}</td>
              <td className="border px-4 py-2">{i.nome}</td>
              <td className="border px-4 py-2">{i.cpf}</td>
              <td className="border px-4 py-2">{i.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
