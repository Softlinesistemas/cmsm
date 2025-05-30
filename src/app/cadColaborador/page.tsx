'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Footer from '../../components/FooterAdm';
import Header from '../../components/HeaderAdm';

const CadColaborador = () => {
  const searchParams = useSearchParams();
  const cpfQuery = searchParams.get('cpf') || '';
  const [form, setForm] = useState({
    nome: '',
    cpf: cpfQuery,
    email: '',
    telefone: '',
    cargo: '',
    matricula: '',
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, cpf: cpfQuery }));
  }, [cpfQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    // Container flex vertical com altura mínima da tela (min-h-screen)
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-200">
      
      <Header />

      {/* Main recebe flex-grow para preencher espaço */}
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        
        {/* Formulário com largura máxima e espaçamento */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-400 bg-opacity-90 backdrop-blur-md rounded-3xl p-10 w-full max-w-3xl mt-14 shadow-lg"
        >
          <h2 className="text-blue-900 text-3xl font-extrabold mb-8 text-center select-none">
            Cadastro de Colaborador
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="nome"
              placeholder="Nome completo"
              value={form.nome}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-yellow-400 transition shadow-sm"
              required
            />
            <input
              name="cpf"
              placeholder="CPF"
              value={form.cpf}
              readOnly
              className="w-full rounded-xl border border-gray-200 bg-gray-100 px-5 py-3 text-gray-500 cursor-not-allowed select-text"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-yellow-400 transition shadow-sm"
              required
            />
            <input
              name="telefone"
              placeholder="Telefone"
              value={form.telefone}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-yellow-400 transition shadow-sm"
            />
            <input
              name="cargo"
              placeholder="Cargo"
              value={form.cargo}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-yellow-400 transition shadow-sm"
            />
            <input
              name="matricula"
              placeholder="Matrícula"
              value={form.matricula}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-yellow-400 transition shadow-sm"
            />
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="bg-yellow-400 text-black font-bold py-3 px-10 rounded-full shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300"
            >
              Salvar
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CadColaborador;
