'use client'

import { useState } from "react";

// Componente para visualização de resultados do processo seletivo
const Resultados = () => {
  const [resultados] = useState([
    { id: 1, nome: 'João Silva', status: 'Aprovado' },
    { id: 2, nome: 'Maria Souza', status: 'Reprovado' },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Resultados</h2>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nome</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map(r => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{r.id}</td>
              <td className="border px-4 py-2">{r.nome}</td>
              <td className="border px-4 py-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Resultados;
