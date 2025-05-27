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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(form);
  };

 return (
  <div className="flex flex-col min-h-screen items-center bg-gray-50 justify-between">
    <Header />

    {/* Formulário ajustado */}
    <form
      onSubmit={handleSubmit}
      className="bg-blue-900 rounded-3xl p-8 w-full max-w-3xl mt-12 shadow-xl"
    >
      <h2 className="!text-white text-xl font-bold mb-6 text-center">
        Cadastro de Colaborador
      </h2>

      {/* Grid responsivo para organizar os campos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full bg-white rounded px-4 py-2 text-sm"
          />
        </div>

        <div>
          <input
            name="cpf"
            placeholder="CPF"
            value={form.cpf}
            readOnly
            className="w-full bg-gray-200 rounded px-4 py-2 text-sm cursor-not-allowed"
          />
        </div>

        <div>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-white rounded px-4 py-2 text-sm"
          />
        </div>

        <div>
          <input
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
            className="w-full bg-white rounded px-4 py-2 text-sm"
          />
        </div>

        <div>
          <input
            name="cargo"
            placeholder="Cargo"
            value={form.cargo}
            onChange={handleChange}
            className="w-full bg-white rounded px-4 py-2 text-sm"
          />
        </div>

        <div>
          <input
            name="matricula"
            placeholder="Matrícula"
            value={form.matricula}
            onChange={handleChange}
            className="w-full bg-white rounded px-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Botão centralizado */}
      <div className="flex justify-center mt-6">
        <button
          type="submit"
          className="bg-yellow-400 text-black font-bold py-2 px-6 rounded hover:bg-yellow-500 transition"
        >
          Salvar
        </button>
      </div>
    </form>

    <Footer />
  </div>
);
}
export default CadColaborador;
