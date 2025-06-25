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
    setMensagem('');

    try {
      const response = await fetch('/api/recuperar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpfEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem('✅ Instruções enviadas para seu email!');
      } else {
        setMensagem(data.message || '❌ Erro ao enviar instruções.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('❌ Erro inesperado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between">
      <Header />

      <h1 className="text-blue-900 text-3xl font-extrabold mt-10 text-center select-none">
        Recuperar Senha
      </h1>

      {/* Ajustei largura e margens para diminuir o tamanho e afastar do footer */}
      <form
        onSubmit={handleSubmit}
        className="bg-blue-900 rounded-[60px] p-8 w-full max-w-sm flex flex-col space-y-5 mt-8 mb-16 shadow-lg"
      >
        <p className="text-yellow-300 text-center font-semibold text-[10px]">
          Insira o CPF ou Email cadastrado para receber as instruções.
        </p>

        <input
          type="text"
          placeholder="CPF ou Email"
          value={cpfEmail}
          onChange={(e) => setCpfEmail(e.target.value)}
          className="bg-white rounded-full px-4 py-2 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          required
          autoFocus
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 text-black font-bold py-2 rounded-full hover:bg-yellow-500 transition disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar Instruções'}
        </button>

        {mensagem && (
          <p
            className={`text-center text-sm ${
              mensagem.startsWith('✅')
                ? 'text-green-400'
                : 'text-red-400'
            } select-text`}
          >
            {mensagem}
          </p>
        )}

        <button
          type="button"
          onClick={() => router.push('/login')}
          className="text-xs text-gray-300 mt-4 hover:underline self-center"
        >
          Voltar ao Login
        </button>
      </form>

      <Footer />
    </div>
  );
};

export default RecuperarSenha;
