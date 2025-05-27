'use client'

import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaUserSlash } from 'react-icons/fa';

const modulosDisponiveis = ['Admin', 'Financeiro', 'Dashboard'];

const usuariosIniciais = [
  {
    id: 1,
    nome: 'Matheus Pereira Ferreira',
    cpf: '01936928051',
    modulos: ['Adm', 'Financeiro', 'Dashboard'],
    ativo: true,
  },
  {
    id: 2,
    nome: 'Luis Antonio de Oliveira Silva',
    cpf: '53374266053',
    modulos: ['Adm', 'Financeiro', 'Dashboard'],
    ativo: true,
  },
  {
    id: 3,
    nome: 'Viviane Machado Paim',
    cpf: '00687703085',
    modulos: ['Financeiro'],
    ativo: true,
  },
  {
    id: 4,
    nome: 'Carlos Augusto de Souza Pires',
    cpf: '07363861730',
    modulos: ['Dashboard'],
    ativo: true,
  },
];

export default function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [showModal, setShowModal] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    cpf: '',
    modulos: [],
  });

  const toggleModulo = (modulo: string) => {
    setNovoUsuario((prev: any) => ({
      ...prev,
      modulos: prev.modulos.includes(modulo)
        ? prev.modulos.filter((m) => m !== modulo)
        : [...prev.modulos, modulo],
    }));
  };

  const adicionarUsuario = () => {
    if (!novoUsuario.nome || !novoUsuario.cpf) {
      alert('Preencha nome e CPF!');
      return;
    }

    setUsuarios((prev) => [
      ...prev,
      {
        id: Date.now(),
        nome: novoUsuario.nome,
        cpf: novoUsuario.cpf,
        modulos: novoUsuario.modulos,
        ativo: true,
      },
    ]);

    setNovoUsuario({ nome: '', cpf: '', modulos: [] });
    setShowModal(false);
  };

  const desativarUsuario = (id: number) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ativo: !u.ativo } : u))
    );
  };

  const excluirUsuario = (id: number) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="p-6 bg-blue-200 max-h-screen rounded-xl shadow-gray-400 shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Gestão de Usuários</h2>

      <div className="mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          <FaPlus className="mr-2" /> Adicionar Usuário
        </button>
      </div>

      {/* Tabela de usuários */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 !text-gray-700">
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2">CPF</th>
              <th className="px-4 py-2">Módulos</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr
                key={u.id}
                className="border-t hover:bg-gray-100 transition-colors"
              >
                <td className="px-4 py-2 text-black">{u.nome}</td>
                <td className="px-4 py-2 text-center text-black">{u.cpf}</td>
                <td className="px-4 py-2 text-center  text-red-800">
                  {u.modulos.join(', ')}
                </td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`font-semibold ${
                      u.ativo ? 'text-green-700' : 'text-red-600'
                    }`}
                  >
                    {u.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => desativarUsuario(u.id)}
                    className="text-yellow-600 hover:text-yellow-800"
                    title="Ativar/Desativar"
                  >
                    <FaUserSlash />
                  </button>
                  <button
                    onClick={() => excluirUsuario(u.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Excluir"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para adicionar usuário */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-md space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold text-blue-900">
              Novo Usuário
            </h3>
            <input
              type="text"
              placeholder="Nome"
              value={novoUsuario.nome}
              onChange={(e) =>
                setNovoUsuario((prev) => ({
                  ...prev,
                  nome: e.target.value,
                }))
              }
              className="border rounded w-full p-2"
            />
            <input
              type="text"
              placeholder="CPF"
              value={novoUsuario.cpf}
              onChange={(e) =>
                setNovoUsuario((prev) => ({
                  ...prev,
                  cpf: e.target.value,
                }))
              }
              className="border rounded w-full p-2"
            />
            <div>
              <h4 className="font-semibold text-gray-700">Módulos</h4>
              <div className="flex flex-wrap gap-2">
                {modulosDisponiveis.map((m) => (
                  <button
                    key={m}
                    onClick={() => toggleModulo(m)}
                    className={`px-3 py-1 rounded border ${
                      novoUsuario.modulos.includes(m)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarUsuario}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}