'use client'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import StepsNavbar from '../../../components/StepsNavbar'
import { useState } from 'react'

export default function PagamentoPage() {
  const [gruUrl, setGruUrl] = useState('')
  const [gerado, setGerado] = useState(false)

  const gerarPagamento = async () => {
    const res = await fetch('/api/gerar-pagamento', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        nome: 'Raimundo Nonato ... Costa',
        cpf: '00000000000',
        email: 'email@exemplo.com',
        valor: 85.0,
        referencia: 'INSCRICAO-10001',
        descricao: 'Inscrição CMSM 2025/2026 6° ano'
      })
    })
    const data = await res.json()
    if (data.urlGru) {
      setGruUrl(data.urlGru)
      setGerado(true)
    } else {
      alert('Erro ao gerar GRU')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <StepsNavbar activeStep={2} />
      <main className="flex-grow px-4 py-12">
        <h1 className="text-center text-2xl font-bold text-green-900 mb-2">Pagamento</h1>
        <h2 className="text-center text-lg text-gray-800 mb-8">Inscrição realizada com sucesso</h2>

        <div className="max-w-3xl mx-auto space-y-6 mb-8">
          <LabelField label="Nome do Candidato" value="____________________________" full/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelField label="Número de Inscrição" value="________"/>
            <LabelField label="Data de Nascimento" value="____/__/____"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelField label="Sexo" value="__________"/>
            <LabelField label="Doc. ID" value="__________"/>
          </div>
          <LabelField label="Candidato ao" value="____________________________" full/>
        </div>

        <AlternateText text="Texto alternativo 1"/>
        <AlternateText text="Texto alternativo 2"/>

        <div className="text-center">
          {!gerado ? (
            <button onClick={gerarPagamento}
              className="bg-green-900 text-white font-semibold py-3 px-8 rounded-lg shadow hover:bg-green-800 transition">
              Gerar GRU
            </button>
          ) : (
            <a href={gruUrl} target="_blank" rel="noopener noreferrer"
              className="inline-block bg-green-900 text-white font-semibold py-3 px-8 rounded-lg shadow hover:bg-green-800 transition">
              Baixar GRU
            </a>
          )}
        </div>
      </main>
      <Footer />
    </div>
)

// --- Helpers usados acima ---
function LabelField({ label, value, full=false }:{label:string;value:string;full?:boolean}) {
  return (
    <div className={`${full?'w-full':''} flex flex-col md:flex-row md:items-center`}>
      <label className="font-medium text-gray-700 w-48">{label}:</label>
      <span className="font-mono text-gray-500">{value}</span>
    </div>
  )
}
function AlternateText({ text }:{text:string}) {
  return (
    <div className="max-w-3xl mx-auto mb-6">
      <div className="border-t border-gray-300 pt-4 text-sm text-gray-600">{text}</div>
    </div>
  )
}
