'use client'

import { useState } from "react";


const LogsAcesso = () => {
  const [logs] = useState([
    { id: 1, usuario: 'Matheus Pereira Ferreira', cpf: '01936928051', modulos: ['Adm', 'Financeiro', 'Dashboards'], data: '2025-05-27 10:00' },
    { id: 2, usuario: 'Luis Antonio de Oliveira Silva', cpf: '53374266053', modulos: ['Adm', 'Financeiro', 'Dashboards'], data: '2025-05-27 11:00' },
    { id: 3, usuario: 'Viviane Machado Paim', cpf: '00687703085', modulos: ['Financeiro'], data: '2025-05-27 14:00' },
    { id: 4, usuario: 'Carlos Augusto de Souza Pires', cpf: '07363861730', modulos: ['Dashboard'], data: '2025-05-27 15:00' },
  ]);

  const [selectedLog, setSelectedLog] = useState<null | typeof logs[0]>(null);

  const closeModal = () => setSelectedLog(null);

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-4">Logs de Acesso</h2>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Usuário</th>
            <th className="border px-4 py-2">Data/Hora</th>
            <th className="border px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{log.id}</td>
              <td className="border px-4 py-2">{log.usuario}</td>
              <td className="border px-4 py-2">{log.data}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => setSelectedLog(log)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Visualizar detalhes"
                >
                  🔍
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de detalhes */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-96 relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✖️
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-900">Detalhes do Acesso</h3>
            <p><strong>Usuário:</strong> {selectedLog.usuario}</p>
            <p><strong>CPF:</strong> {selectedLog.cpf}</p>
            <p><strong>Módulos:</strong> {selectedLog.modulos.join(', ')}</p>
            <p><strong>Data/Hora:</strong> {selectedLog.data}</p>
            {/* Você pode adicionar mais informações aqui futuramente */}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogsAcesso;