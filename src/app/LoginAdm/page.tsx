'use client'

import React from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/HeaderAdm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between">
      {/* Header Component */}
      <Header />

      {/* Logo and title */}
      <div className="text-center mt-4">
        {/*<img src="/logo.png" alt="Logo" className="mx-auto w-20" />
        <h1 className="text-xl md:text-2xl font-bold text-green-900 tracking-wide">COLEGIO MITILAR SANTA MARIA</h1>
        <hr className="my-4 border-t border-green-900 w-11/12 mx-auto" />*/}
      </div>

      <div className="bg-[#002b0f] rounded-[60px] pt-10 pb-6 px-6 w-80 flex flex-col items-center shadow-xl relative border-2 border-green-800">
      {/* Avatar círculo superior */}
      <div className="w-24 h-24 bg-[#002b0f] border-4 border-green-700 rounded-full absolute -top-12 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-green-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 14c4.418 0 8 1.79 8 4v2H4v-2c0-2.21 3.582-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z"
          />
        </svg>
      </div>

      {/* Campos de entrada */}
      <div className="mt-12 w-full space-y-4">
        <div className="flex items-center bg-green-900 rounded-full px-4 py-2">
          <span className="text-gray-300 mr-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m0 0l4-4m0 4l4 4" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="USUARIO"
            className="bg-transparent placeholder-gray-300 text-white text-sm w-full focus:outline-none"
          />
        </div>

        <div className="flex items-center bg-green-900 rounded-full px-4 py-2">
          <span className="text-gray-300 mr-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2 .896 2 2v2H10v-2c0-1.104.896-2 2-2zM6 12v2a6 6 0 0012 0v-2" />
            </svg>
          </span>
          <input
            type="password"
            placeholder="SENHA"
            className="bg-transparent placeholder-gray-300 text-white text-sm w-full focus:outline-none"
          />
        </div>
      </div>

      {/* Botão entrar */}
      <button className="mt-6 bg-yellow-400 text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-500 transition">
        ENTRAR
      </button>

      {/* Recuperar senha */}
      <a href="#" className="text-xs text-gray-300 mt-3 hover:underline">
        RECUPERAR SENHA
      </a>
    </div>

      {/* Footer Component */}
      <Footer />

      <div className="text-center text-xs py-2 bg-green-950 text-white w-full">
        Desenvolvido por Soft line Sistemas
      </div>
    </div>
  );
};

export default LoginPage;
