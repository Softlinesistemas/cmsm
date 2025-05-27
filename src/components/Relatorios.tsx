'use client'

import { useState } from "react";

// Componente para geração e exportação de relatórios
const Relatorios = () => {
  const [relatorio] = useState([
    { id: 1, descricao: 'Relatório A', quantidade: 10 },
    { id: 2, descricao: 'Relatório B', quantidade: 20 },
  ]);

  // Exporta relatório em CSV
  const exportarCSV = () => {
    const rows = [
      ['ID', 'Descrição', 'Quantidade'],
      ...relatorio.map(r => [r.id, r.descricao, r.quantidade])
    ];
    const csv = rows.map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'relatorio.csv';
    link.click();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Relatórios</h2>
      <button onClick={exportarCSV} className="bg-blue-500 text-white px-4 py-1 rounded mb-4">
        Exportar CSV
      </button>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Descrição</th>
            <th className="border px-4 py-2">Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {relatorio.map(r => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{r.id}</td>
              <td className="border px-4 py-2">{r.descricao}</td>
              <td className="border px-4 py-2">{r.quantidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Relatorios;
