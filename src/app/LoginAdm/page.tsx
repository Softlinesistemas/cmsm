'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Footer from '../../components/FooterAdm';
import Header from '../../components/HeaderAdm';

const LoginAdm = () => {
  const [primeiroAcesso, setPrimeiroAcesso] = useState(false);
  const [cpf, setCpf] = useState(''); 
  const router = useRouter(); 
  const handlePrimeiroAcesso = () => {
    // 
    router.push(`/cadColaborador/?cpf=${cpf}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between">
      <Header />

      <div className="bg-blue-900 rounded-[60px] p-3 pt-10 pb-6 px-6 w-80 flex flex-col items-center shadow-x5 relative border-2 border-blue-300">
        <div className="w-24 h-24 bg-blue-900 border-4 border-blue-700 rounded-full absolute -top-12 flex items-center justify-center">
          <svg className="w-12 h-12 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c4.418 0 8 1.79 8 4v2H4v-2c0-2.21 3.582-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        </div>

        {!primeiroAcesso ? (
          <div className="mt-12 w-full space-y-4">
            {/* Campos normais */}
            <div className="flex items-center bg-blue-600 rounded-full px-4 py-2">
              <span className="text-black mr-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m0 0l4-4m0 4l4 4" />
                </svg>
              </span>
              <input type="text" placeholder="USUARIO" className="bg-transparent placeholder-gray-300 text-white text-sm w-full focus:outline-none" />
            </div>
            <div className="flex items-center bg-blue-600 rounded-full px-4 py-2">
              <span className="text-gray-300 mr-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2 .896 2 2v2H10v-2c0-1.104.896-2 2-2zM6 12v2a6 6 0 0012 0v-2" />
                </svg>
              </span>
              <input type="password" placeholder="SENHA" className="bg-transparent placeholder-gray-300 text-white text-sm w-full focus:outline-none" />
            </div>
          </div>
        ) : (
          // Primeiro acesso: só CPF
          <div className="mt-12 w-full space-y-4">
            <div className="flex items-center bg-blue-600 rounded-full px-4 py-2">
              <span className="text-gray-300 mr-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2 .896 2 2v2H10v-2c0-1.104.896-2 2-2z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Digite seu CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="bg-transparent placeholder-gray-300 text-white text-sm w-full focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Botão entrar */}
        {!primeiroAcesso ? (
          <button className="mt-6 bg-yellow-400 text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-500 transition">
            ENTRAR
          </button>
        ) : (
          <button
            onClick={handlePrimeiroAcesso}
            className="mt-6 bg-yellow-400 text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-500 transition"
          >
            CONTINUAR
          </button>
        )}

        <a href="/recuperarSenha" className="text-xs text-gray-300 mt-3 hover:underline">RECUPERAR SENHA</a>

        {!primeiroAcesso && (
          <button onClick={() => setPrimeiroAcesso(true)} className="text-xs text-gray-300 mt-3 hover:underline">
            Primeiro acesso
          </button>
        )}
        {primeiroAcesso && (
          <button onClick={() => setPrimeiroAcesso(false)} className="text-xs text-gray-300 mt-3 hover:underline">
            Voltar ao login
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default LoginAdm;