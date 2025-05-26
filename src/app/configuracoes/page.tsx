'use client'

import Sidebar from '../../components/Sidebar'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Header from '../../components/HeaderAdm'

export default function Configuracoes() {
  return (
    <div className="flex min-h-screen">
      <Header />
      <Sidebar />

      <div className="ml-64 w-full">
        <main className="p-8">
          <h2 className="text-2xl font-bold text-center text-blue-900 mb-8">CONFIGURAÇÕES</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div>
              <label className="block text-sm font-bold mb-1">INSIRA O NOME DO PROCESSO SELETIVO</label>
              <input type="text" className="w-full border rounded px-3 py-2" defaultValue="Processo Seletivo de Admissão ao CMSM 2025/2026" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">INSIRA O VALOR DA INSCRIÇÃO</label>
              <div className="flex items-center">
                <span className="bg-green-700 text-white px-3 py-2 rounded-l">R$</span>
                <input type="text" className="w-full border rounded-r px-3 py-2" defaultValue="0,00" />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block font-semibold mb-2">CONFIGURAR TEMPO DE INSCRIÇÕES</label>
              <div className="flex gap-4">
                <input type="date" className="border px-3 py-2 rounded w-full" />
                <input type="date" className="border px-3 py-2 rounded w-full" />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block font-semibold mb-2">CONFIGURAR DATA DE NASCIMENTO</label>
              <div className="text-sm mb-1 font-medium">6° ANO</div>
              <div className="flex gap-4 mb-4">
                <input type="date" className="border px-3 py-2 rounded w-full" />
                <input type="date" className="border px-3 py-2 rounded w-full" />
              </div>
              <div className="text-sm mb-1 font-medium">1° ANO</div>
              <div className="flex gap-4">
                <input type="date" className="border px-3 py-2 rounded w-full" />
                <input type="date" className="border px-3 py-2 rounded w-full" />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button className="bg-green-900 text-white font-semibold px-10 py-3 rounded hover:bg-green-800 transition">GRAVAR</button>
          </div>
        </main>
      </div>
    </div>
  )
}
