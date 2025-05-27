'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../components/Footer';
import Header from '../../components/HeaderAdm';

const RecuperarSenha: React.FC = () => {
  const [cpfEmail, setCpfEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/recuperar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpfEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem('Instruções enviadas para seu email!');
      } else {
        setMensagem(data.message || 'Erro ao enviar instruções.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between">
      <Header />

      <form
        onSubmit={handleSubmit}
        className="bg-blue-900 rounded-3xl p-8 w-96 flex flex-col space-y-4 mt-12 shadow-xl"
      >
        <h2 className="text-white text-xl font-bold text-center">Recuperar Senha</h2>

        <input
          type="text"
          placeholder="CPF ou Email"
          value={cpfEmail}
          onChange={(e) => setCpfEmail(e.target.value)}
          className="bg-white rounded px-4 py-2 text-sm"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-500 transition disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar Instruções'}
        </button>

        {mensagem && <p className="text-sm text-center text-white">{mensagem}</p>}

        <button
          type="button"
          onClick={() => router.push('/adm/LoginAdm')}
          className="text-xs text-gray-300 mt-3 hover:underline text-center"
        >
          Voltar ao Login
        </button>
      </form>

      <Footer />
    </div>
  );
};

export default RecuperarSenha;
