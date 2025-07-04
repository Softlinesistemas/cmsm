'use client'

import Header from '../../components/HeaderAdm'
import Footer from '../../components/FooterAdm'
import StepsNavbar from '../../components/StepsNavbar'
import api from '@/utils/api'
import { useQuery } from 'react-query'
import { useSession } from 'next-auth/react'
import moment from 'moment-timezone'
import { QRCodeCanvas } from 'qrcode.react'

export default function LocalHorarioPage() {
  const { data: session, status } = useSession();

  const localInfo = {
    local: 'Escola Municipal João Paulo II',
    data: '15/06/2025',
    sala: 'Sala 05',
    aberturaPortoes: '07:30'
  }
  
  const { data: candidato, isLoading, refetch } = useQuery(
    ['candidatoData'],
    async () => {
      const response = await api.get(`api/candidato/${session?.user.cpf}`);
      return response.data;
    },
    {
      retry: 5,
      refetchOnWindowFocus: false,
      enabled: !!session?.user.cpf
    }
  );

    const {
    data: dataConfiguracao,
    isLoading: configLoading
  } = useQuery(
    ['configuracao'],
      async () => {
        try {
          const response = await api.get('api/configuracao');
          const configuracao = response?.data;
          return configuracao;
        } catch (error) {
          // Não retorna nada pois é um fetch
        }
      },
    {
      retry: 5,    
    }
  );  

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
            <div><strong>Nome do Candidato:</strong> {candidato?.Nome}</div>
            <div><strong>Número de Inscrição:</strong> {candidato?.CodIns}</div>
            <div><strong>Data de Nascimento:</strong> {candidato?.Nasc}</div>
            <div><strong>Sexo:</strong> {candidato?.Sexo}</div>
            <div><strong>Doc. ID:</strong> {candidato?.CodIns}</div>
            <div className="md:col-span-2"><strong>Candidato ao:</strong> {candidato?.ProcessoSel} {candidato?.Seletivo}</div>
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
            {candidato ? (
              <QRCodeCanvas
                value={JSON.stringify({
                  nome: candidato.Nome,
                  inscricao: candidato.CodIns,
                  nasc: candidato.Nasc,
                  sexo: candidato.Sexo,
                  seletivo: candidato.ProcessoSel + ' ' + candidato.Seletivo
                })}
                size={150}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            ) : "(dados do candidato)"}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
