// pages/inscricao/local.tsx
'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import StepsNavbar from '../../components/StepsNavbar'
import { useEffect, useState } from 'react'

interface CandidatoInfo {
  nome: string
  numeroInscricao: string
  dataNascimento: string
  sexo: string
  docId: string
  vaga: string
}

interface LocalInfo {
  local: string
  data: string
  sala: string
  aberturaPortoes: string
}

export default function LocalHorarioPage() {
  const [candidato, setCandidato] = useState<CandidatoInfo | null>(null)
  const [localInfo, setLocalInfo]     = useState<LocalInfo | null>(null)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Exemplo de endpoints, ajuste conforme seu back-end
        const inscricaoId = '10001'  // ou obtenha via rota, contexto ou parâmetro
        const [cRes, lRes] = await Promise.all([
          fetch(`/api/inscricoes/${inscricaoId}`),
          fetch(`/api/inscricoes/${inscricaoId}/local`)
        ])
        const cData: CandidatoInfo = await cRes.json()
        const lData: LocalInfo     = await lRes.json()

        setCandidato(cData)
        setLocalInfo(lData)
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500">Carregando...</span>
      </div>
    )
  }

  if (!candidato || !localInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-red-500">Erro ao carregar informações.</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <StepsNavbar activeStep={1} />

      <main className="flex-grow px-4 py-8">
        {/* Cartão de Confirmação */}
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow p-6 mb-8">
          <h1 className="text-center text-lg font-semibold text-red-700 mb-4">
            Cartão de Confirmação de Inscrição – CCI
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Nome do Candidato:</strong> {candidato.nome}
            </div>
            <div>
              <strong>Número de Inscrição:</strong> {candidato.numeroInscricao}
            </div>
            <div>
              <strong>Data de Nascimento:</strong> {candidato.dataNascimento}
            </div>
            <div>
              <strong>Sexo:</strong> {candidato.sexo}
            </div>
            <div>
              <strong>Doc. ID:</strong> {candidato.docId}
            </div>
            <div className="md:col-span-2">
              <strong>Candidato ao:</strong> {candidato.vaga}
            </div>
          </div>
        </div>

        {/* Cards de Local, Data e Sala */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 text-center gap-6 mb-8">
          {/** Local **/}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-500 mb-1 uppercase">Local</div>
            <div className="font-bold text-base">{localInfo.local}</div>
          </div>
          {/** Data **/}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-500 mb-1 uppercase">Data</div>
            <div className="font-bold text-base">{localInfo.data}</div>
          </div>
          {/** Sala **/}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-500 mb-1 uppercase">Sala</div>
            <div className="font-bold text-base">{localInfo.sala}</div>
          </div>
        </div>

        {/* Abertura dos Portões */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700 uppercase mb-2">
            Abertura dos Portões
          </h2>
          <div className="text-green-900 font-bold">{localInfo.aberturaPortoes}</div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
