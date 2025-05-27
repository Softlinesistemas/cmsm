'use client'

import { useState } from "react";
import { FaEye } from 'react-icons/fa';

// Componente para exibir logs de acesso ao sistema
const LogsAcesso = () => {
  // Usuários cadastrados (dados fixos)
  const usuarios = [
    { id: 1, nome: 'Matheus Pereira Ferreira' },
    { id: 2, nome: 'Luis Antonio de Oliveira Silva' },
    { id: 3, nome: 'Viviane Machado Paim' },
    { id: 4, nome: 'Carlos Augusto de Souza Pires' },
  ];

  // Logs simulados
  const [logs] = useState([
    { id: 1, usuarioId: 1, data: '2025-05-27 10:00' },
    { id: 2, usuarioId: 2, data: '2025-05-27 11:15' },
    { id: 3, usuarioId: 3, data: '2025-05-27 13:30' },
    { id: 4, usuarioId: 4, data: '2025-05-27 15:45' },
    { id: 5, usuarioId: 1, data: '2025-05-27 17:00' },
  ]);

  // Função para obter o nome do usuário pelo id
  const getNomeUsuario = (id: number) => {
    const usuario = usuarios.find(u => u.id === id);
    return usuario ? usuario.nome : 'Desconhecido';
  };

  return (
    <div className="p-6 bg-red-300 max-h-screen rounded-xl shadow-gray-400 shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Logs de Acesso</h2>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Usuário</th>
              <th className="px-4 py-2 text-left">Data/Hora</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t hover:bg-gray-100 transition-colors"
              >
                <td className="px-4 py-2 text-black">{log.id}</td>
                <td className="px-4 py-2 text-left text-black">{getNomeUsuario(log.usuarioId)}</td>
                <td className="px-4 py-2 text-left text-black">{log.data}</td>
                <td className="px-4 py-2 flex items-center justify-center">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    title="Visualizar detalhes"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsAcesso;
