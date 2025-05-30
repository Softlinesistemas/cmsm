'use client'

import LoginAdm from '@/app/LoginAdm/page';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter()
  return (
    <div className="w-full">
      {/* Faixa camuflada */}
      <div className="w-full h-10 bg-blue-900 bg-cover  shadow-md" />

      {/* Conteúdo abaixo da faixa */}
      <header className="w-full z-10 relative px-4 py-4 rounded-2xl   max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo CMSM" className="h-16" />
            <h1 className="text-center sm:text-left text-lg sm:text-2xl font-bold text-blue-900 tracking-wide">
              COLÉGIO MILITAR SANTA MARIA
            </h1>
          </div>

          
            <button className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition" onClick={() => router.push("/LoginAdm")}>
              ACOMPANHAMENTO
            </button>
          
        </div>
      </header>
    </div>
  );
}
