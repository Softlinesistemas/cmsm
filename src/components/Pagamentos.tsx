'use client'

import { useState } from 'react';

// Componente para controle de pagamentos
const Pagamentos = () => {
  const [pagamentos] = useState([
    { id: 1, nome: 'João Silva', valor: 100, status: 'Pendente' },
    { id: 2, nome: 'Maria Souza', valor: 150, status: 'Pago' },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Controle de Pagamentos</h2>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nome</th>
            <th className="border px-4 py-2">Valor</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {pagamentos.map(p => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{p.id}</td>
              <td className="border px-4 py-2">{p.nome}</td>
              <td className="border px-4 py-2">R${p.valor}</td>
              <td className="border px-4 py-2">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pagamentos;
