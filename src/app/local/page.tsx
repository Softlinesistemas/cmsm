'use client'

import Header from '../../components/HeaderAdm'
import Footer from '../../components/FooterAdm'
import StepsNavbar from '../../components/StepsNavbar'

// import { QRCode } from 'react-qrcode-logo'

export default function LocalHorarioPage() {
  const candidato = {
    nome: 'Ramon Silva dos Santos',
    numeroInscricao: '10001',
    dataNascimento: '10/01/1995',
    sexo: 'Masculino',
    docId: '123456789',
    vaga: '6º ano'
  }

  const localInfo = {
    local: 'Escola Municipal João Paulo II',
    data: '15/06/2025',
    sala: 'Sala 05',
    aberturaPortoes: '07:30'
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm  text-black">
            <div><strong>Nome do Candidato:</strong> {candidato.nome}</div>
            <div><strong>Número de Inscrição:</strong> {candidato.numeroInscricao}</div>
            <div><strong>Data de Nascimento:</strong> {candidato.dataNascimento}</div>
            <div><strong>Sexo:</strong> {candidato.sexo}</div>
            <div><strong>Doc. ID:</strong> {candidato.docId}</div>
            <div className="md:col-span-2"><strong>Candidato ao:</strong> {candidato.vaga}</div>
          </div>
        </div>

        {/* Informações de Local, Data, Sala */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 text-center gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-500 mb-1 uppercase">Local</div>
            <div className="font-bold text-base  text-blue-800">{localInfo.local}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-500 mb-1 uppercase">Data</div>
            <div className="font-bold text-base  text-blue-800">{localInfo.data}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-black mb-1 uppercase">Sala</div>
            <div className="font-bold text-base text-blue-800">{localInfo.sala}</div>
          </div>
        </div>

        {/* Abertura dos Portões */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700 uppercase mb-2">
            Abertura dos Portões
          </h2>
          <div className="text-green-900 font-bold text-[36px]">{localInfo.aberturaPortoes}</div>
        </div>

        {/* Espaço para QR Code */}
        <div className="mt-6 flex justify-center">
          <div className="border border-dashed border-gray-400 rounded-lg p-4 w-40 h-40 flex items-center justify-center text-xs text-gray-500">
            QR CODE<br />
            {/* <QRCode value={JSON.stringify(candidato)} /> */}
            (dados do candidato)
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
