'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'
import { useEditais } from "@/context/EditalContext"; 
import { signIn } from 'next-auth/react';

export default function Home() {
  const router = useRouter();
  const { editais } = useEditais(); 

  const handleGovLogin = () => {
    signIn();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow px-4 py-12">
        <h2 className="text-center text-blue-900 font-semibold uppercase text-md sm:text-md mb-12">
          PROCESSO SELETIVO DE ADMISSÃO AO CMSM 2025/2026
        </h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-300">
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

          <div className="px-6 py-4 flex flex-col items-center">
            <h3 className="font-bold text-lg text-red-900 mb-4">Período de inscrição</h3>
            <p className="text-green-900 font-semibold text-lg">
              01/06/2025 <span className="mx-2">à</span> 31/06/2025
            </p>
          </div>

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

        <section className="max-w-4xl mx-auto px-4 p-10">
          <h2 className="text-center text-blue-900 font-semibold uppercase text-md sm:text-md mb-6">
            Editais e Documentos
          </h2>

          <div className="space-y-4">
            {editais.map(edital => (
              <div
                key={edital.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-100 p-4 rounded shadow mb-2"
              >
                <a
                  href={`/arquivos/${edital.titulo.toLowerCase().replace(/ /g, "-")}.pdf`}
                  download
                  className="bg-blue-900 text-white font-semibold px-4 py-2 rounded hover:bg-blue-800 transition-colors"
                >
                  {edital.titulo}
                </a>
                <p className="mt-2 md:mt-0 md:ml-4 text-sm text-gray-800">
                  {edital.descricao}
                </p>
              </div>
            ))}

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
  );
}
