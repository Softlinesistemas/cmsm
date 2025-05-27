'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/HeaderAdm';
import { CalendarDays, Clock, Save } from 'lucide-react';
import Footer from '@/components/FooterAdm';

export default function Configuracoes() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* Header no topo */}
      <Header />

      {/* Conteúdo principal com Sidebar e página */}
      <div className="flex flex-1">
        {/* Sidebar à esquerda */}
        <Sidebar />
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-10">CONFIGURAÇÕES</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Processo Seletivo */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                INSIRA O NOME DO PROCESSO SELETIVO
              </label>
              <input
                type="text"
                className="w-full border px-4 py-2 rounded focus:ring focus:ring-blue-200"
                defaultValue="Processo Seletivo de Admissão ao CMSM 2025/2026"
              />
            </div>

            {/* Valor da Inscrição */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                INSIRA O VALOR DA INSCRIÇÃO
              </label>
              <div className="flex items-center border rounded overflow-hidden focus-within:ring focus-within:ring-blue-200">
                <span className="bg-green-700 text-white px-4 py-2 font-semibold">R$</span>
                <input
                  type="text"
                  className="w-full px-4 py-2"
                  defaultValue="0,00"
                  placeholder="Ex: 50,00"
                />
              </div>
            </div>

            {/* Tempo de Inscrições (com hora) */}
            <div className="bg-white p-6 rounded-xl shadow-md col-span-1 md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-3">
                CONFIGURAR TEMPO DE INSCRIÇÕES
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">Data e Hora Inicial</label>
                  <div className="flex gap-2">
                    <input type="date" className="border rounded px-3 py-2 w-1/2" />
                    <input type="time" className="border rounded px-3 py-2 w-1/2" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">Data e Hora Final</label>
                  <div className="flex gap-2">
                    <input type="date" className="border rounded px-3 py-2 w-1/2" />
                    <input type="time" className="border rounded px-3 py-2 w-1/2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Data de nascimento */}
            <div className="bg-white p-6 rounded-xl shadow-md col-span-1 md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-4">
                CONFIGURAR DATA DE NASCIMENTO
              </label>

              {/* 6º Ano */}
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-600 mb-1">6° ANO</div>
                <div className="flex gap-4">
                  <input type="date" className="border px-3 py-2 rounded w-full" />
                  <input type="date" className="border px-3 py-2 rounded w-full" />
                </div>
              </div>

              {/* 1º Ano */}
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">1° ANO</div>
                <div className="flex gap-4">
                  <input type="date" className="border px-3 py-2 rounded w-full" />
                  <input type="date" className="border px-3 py-2 rounded w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Botão Gravar */}
          <div className="flex justify-center mt-10">
            <button className="bg-green-900 text-white font-semibold px-10 py-3 rounded-lg flex items-center gap-2 hover:bg-green-800 hover:scale-105 transition shadow-md">
              <Save size={18} />
              GRAVAR
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
