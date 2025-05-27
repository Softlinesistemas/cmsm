'use client'

import { useState } from "react";

// Componente para gerenciamento e envio de certificados
const Certificados = () => {
  const [certificados] = useState([
    { id: 1, nome: 'João Silva', enviado: false },
    { id: 2, nome: 'Maria Souza', enviado: true },
  ]);

  // Simula envio de certificado
  const enviarCertificado = (id: number) => {
    alert(`Certificado enviado para ID: ${id}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Certificados</h2>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nome</th>
            <th className="border px-4 py-2">Enviado</th>
            <th className="border px-4 py-2">Ação</th>
          </tr>
        </thead>
        <tbody>
          {certificados.map(c => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{c.id}</td>
              <td className="border px-4 py-2">{c.nome}</td>
              <td className="border px-4 py-2">{c.enviado ? 'Sim' : 'Não'}</td>
              <td className="border px-4 py-2">
                <button
                  disabled={c.enviado}
                  onClick={() => enviarCertificado(c.id)}
                  className={`px-3 py-1 rounded text-white ${c.enviado ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  Enviar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Certificados;
