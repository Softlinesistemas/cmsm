'use client'; // Força renderização no cliente

import { useState } from "react";

interface Processo {
  id: number;
  nome: string;
  andamento: string;
}

export default function Processo() {
  const [processos] = useState<Processo[]>([
    { id: 1, nome: 'Processo A', andamento: '50%' },
    { id: 2, nome: 'Processo B', andamento: '75%' },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Acompanhamento de Processo</h2>
      <table className="w-full table-auto border mb-4">
        <thead className="bg-gray-100  text-black ">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nome</th>
            <th className="border px-4 py-2">Andamento</th>
          </tr>
        </thead>
        <tbody>
          {processos.map(p => (
            <tr key={p.id} className="hover:bg-gray-50  text-black ">
              <td className="border px-4 py-2">{p.id}</td>
              <td className="border px-4 py-2">{p.nome}</td>
              <td className="border px-4 py-2">{p.andamento}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
