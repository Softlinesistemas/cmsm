'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleGovLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOV_BR_CLIENT_ID
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_GOV_BR_REDIRECT_URI!)
    const state = encodeURIComponent(window.location.pathname)
    const scope = encodeURIComponent('openid profile email')
    const authUrl = `https://sso.gov.br/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`
    window.location.href = authUrl
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow px-4 py-12">
        {/* Título principal */}
        <h2 className="text-center text-blue-900 font-semibold uppercase text-md sm:text-md mb-12">
          PROCESSO SELETIVO DE ADMISSÃO AO CMSM 2025/2026
        </h2>

        {/* Três colunas com separadores */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-300">
          {/* COLUNA 1 — VAGAS */}
          <div className="px-6 py-4 flex flex-col items-center">
            <h3 className="font-bold text-lg text-red-900 mb-4">Vagas</h3>
            <div className="space-y-3 w-full">
              <div className="mx-auto flex items-center justify-between bg-gray-200 rounded-full px-4 py-2 w-40">
                <span className="text-sm text-blue-700 text-bold">6° ano</span>
                <span className="text-sm font-bold text-green-800">700 vagas</span>
              </div>
              <div className="mx-auto flex items-center justify-between bg-gray-200 rounded-full px-4 py-2 w-40">
                <span className="text-sm text-blue-700 text-bold">1° ano</span>
                <span className="text-sm font-bold text-green-800">1000 vagas</span>
              </div>
            </div>
          </div>

          {/* COLUNA 2 — PERÍODO DE INSCRIÇÃO */}
          <div className="px-6 py-4 flex flex-col items-center">
            <h3 className="font-bold text-lg text-red-900 mb-4">Período de inscrição</h3>
            <p className="text-green-900 font-semibold text-lg">
              01/06/2025 <span className="mx-2">à</span> 31/06/2025
            </p>
          </div>

          {/* COLUNA 3 — INSCRIÇÕES */}
          <div className="px-6 py-4 flex flex-col items-center">
            <h3 className="font-bold text-lg text-red-900 mb-4">Inscrições</h3>
            <p className="mb-3 text-sm">Fazer inscrição</p>
            <button
              onClick={handleGovLogin}
              className="flex items-center space-x-2 bg-white border border-gray-300 rounded px-4 py-2 hover:scale-105 transition-transform"
            >
              <img
                src="https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png"
                alt="gov.br"
                className="h-6"
              />
              <span className="text-gray-700 font-medium">Entrar com gov.br</span>
            </button>
          </div>
        </div>
          {/* Editais e Documentos */}
        <section className="max-w-4xl mx-auto px-4 p-10">
          <h2 className="text-center text-blue-900 font-semibold uppercase text-md sm:text-md mb-6">
            Editais e Documentos
          </h2>
          <div className="space-y-4">
            {/* Item 1 - Edital */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-100 p-4 rounded shadow">
              <a
                href="/arquivos/edital-01.pdf"
                download
                className="bg-blue-900 text-white font-semibold px-4 py-2 rounded hover:bg-blue-800 transition-colors"
              >
                Edital 01
              </a>
              <p className="mt-2 md:mt-0 md:ml-4 text-sm text-gray-800">
                Contém todas as regras, critérios e informações oficiais do processo seletivo.
              </p>
            </div>

            {/* Item 2 - Cronograma */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-100 p-4 rounded shadow">
              <a
                href="/arquivos/cronograma.pdf"
                download
                className="bg-yellow-700 text-white font-semibold px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Cronograma
              </a>
              <p className="mt-2 md:mt-0 md:ml-4 text-sm text-gray-800">
                Lista todas as datas importantes: inscrição, provas, resultados e matrícula.
              </p>
            </div>

            {/* Item 3 - Documentos Requeridos */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-100 p-4 rounded shadow">
              <a
                href="/arquivos/documentos-necessarios.pdf"
                download
                className="bg-green-800 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Documentos
              </a>
              <p className="mt-2 md:mt-0 md:ml-4 text-sm text-gray-800">
                Documentação obrigatória para inscrição e matrícula dos candidatos.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
