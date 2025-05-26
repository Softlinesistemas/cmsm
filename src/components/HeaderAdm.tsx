'use client'

import Link from 'next/link';

export default function Header() {
  return (
    <div className="w-full">
      {/* Faixa camuflada */}
      <div className="w-full h-20 bg-[url('/camuflado.png')] bg-cover rounded-b-2xl shadow-md" />
{/* Conteúdo abaixo da faixa */}
<header className="w-full z-10 relative px-4 py-4 rounded-2xl   max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo CMSM" className="h-16" />
            <h1 className="text-center sm:text-left text-lg sm:text-2xl font-bold text-green-900 tracking-wide">
              COLÉGIO MILITAR SANTA MARIA
            </h1>
          </div>
          </div>
          </header>

    </div>
  );
}

      {/* Conteúdo abaixo da faixa
      <header className="w-full bg-white mt-[-1rem] z-10 relative px-4 py-4 rounded-2xl shadow-lg border border-green-900 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo CMSM" className="h-16" />
            <h1 className="text-center sm:text-left text-lg sm:text-2xl font-bold text-green-900 tracking-wide">
              COLÉGIO MILITAR SANTA MARIA
            </h1>
          </div>
        </div>
      </header> */}