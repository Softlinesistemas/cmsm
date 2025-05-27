'use client'

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '../../components/Footer';
import Header from '../../components/HeaderAdm';

const RedefinirSenha: React.FC = () => {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem('Senha redefinida com sucesso!');
        setTimeout(() => router.push('/adm/LoginAdm'), 2000);
      } else {
        setMensagem(data.message || 'Erro ao redefinir senha.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <div className="min-h-screen bg-white flex flex-col items-center justify-between">
        <Header />

        <form
          onSubmit={handleSubmit}
          className="bg-blue-900 rounded-3xl p-8 w-96 flex flex-col space-y-4 mt-12 shadow-xl"
        >
          <h2 className="text-white text-xl font-bold text-center">Redefinir Senha</h2>

          <input
            type="password"
            placeholder="Nova Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="bg-white rounded px-4 py-2 text-sm"
            required
          />

          <input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="bg-white rounded px-4 py-2 text-sm"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
          </button>

          {mensagem && <p className="text-sm text-center text-white">{mensagem}</p>}
        </form>

        <Footer />
      </div>
    </Suspense>
  );
};

export default RedefinirSenha;
