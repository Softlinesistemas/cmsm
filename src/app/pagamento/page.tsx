"use client"

import Header from '@/components/HeaderAdm'
import Footer from '@/components/FooterAdm'
import StepsNavbar from '@/components/StepsNavbar'
import { useState, useRef, useEffect } from 'react'
import api from '@/utils/api'
import { useQuery } from 'react-query'
import { useSession } from 'next-auth/react'
import moment from 'moment-timezone'

export default function PagamentoPage() {
  const [gruUrl, setGruUrl] = useState('')
  const [pagamentoData, setPagamentoData] = useState<any>(null)
  const [gerado, setGerado] = useState(false)
  const [statusPagamento, setStatusPagamento] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const { data: session } = useSession()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Busca dados do candidato
  const { data: candidato } = useQuery(
    ['candidato'],
    () => api.get(`/api/candidato/${session?.user.cpf}`).then(res => res.data),
    { enabled: !!session?.user.cpf }
  )

  // Busca configuração (valor e datas)
  const { data: config } = useQuery(
    ['configuracao'],
    () => api.get('/api/configuracao').then(res => res.data)
  )

  // Carrega script do iframe-resizer e inicializa quando a GRU é gerada
  useEffect(() => {
    if (!gerado) return
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.6.6/iframeResizer.min.js'
    script.async = true
    script.onload = () => {
      if (typeof window.iFrameResize === 'function') {
        window.iFrameResize(
          { heightCalculationMethod: 'documentElementOffset' },
          '.iframe-epag'
        )
      }
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [gerado])

  // Gera pagamento GRU
  const gerarPagamento = async () => {
    if (!candidato || !config) return
    try {
     const payload = {
        codigoServico: '11908',
        nomeContribuinte: candidato?.Nome,
        cnpjCpf: candidato?.CPF,
        referencia: candidato?.CodIns,
        competencia: moment(config.GRUDataFim).tz('America/Sao_Paulo').format('MMYYYY'),
        vencimento: moment(config.GRUDataFim).tz('America/Sao_Paulo').format('DDMMYYYY'),
        valorPrincipal: config.ValInscricao,
        email: candidato?.Email,
        urlRetorno: `${process.env.NEXT_PUBLIC_BACKEND_URL}/local`,
        descricao: `${candidato?.ProcessoSel} ${candidato?.Seletivo}`
      }

      const res = await api.post('api/pagamento', payload)
      const data = res.data

      // Extrai URL para iframe
      const url = data.proximaUrl
      if (!url) {
        alert('Não foi possível gerar a GRU. Tente novamente.')
        return
      }
      setGruUrl(url + '&btnConcluir=true')
      setGerado(true)
      setPagamentoData(data)

      if (data.situacao?.codigo) setStatusPagamento(data.situacao.codigo)
      const qr = data.qrCodeUrl || data.qrCode
      if (qr) setQrCodeUrl(qr)

    } catch (err) {
      console.error('Erro ao gerar GRU:', err)
      alert('Erro ao gerar GRU. Veja o console para detalhes.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <StepsNavbar activeStep={2} />

      {candidato || true ? (
        <main className="flex-grow px-4 py-12">
          <h1 className="text-center text-2xl font-bold text-green-900 mb-2">Pagamento</h1>
          <h2 className="text-center text-lg text-gray-800 mb-8">
            Efetue o pagamento de R$ {config?.ValInscricao}
          </h2>

          <section className="max-w-3xl mx-auto space-y-6 mb-8">
            <LabelField label="Nome do Candidato" value={candidato?.Nome} full />
          </section>

          <AlternateText text="Confira seus dados antes de prosseguir." />

          <div className="text-center mb-8">
            {!gerado ? (
              <button
                onClick={gerarPagamento}
                className="bg-green-900 text-white py-3 px-8 rounded-lg shadow hover:bg-green-800"
              >
                Gerar GRU
              </button>
            ) : (
              <>
                <div className="iframe-container mb-8">
                  <iframe
                    className="iframe-epag"
                    src={gruUrl}
                    scrolling="no"
                    ref={iframeRef}
                  />
                </div>
                {statusPagamento && (
                  <p className="mt-4 text-green-700 font-semibold">
                    Status: {statusPagamento}
                  </p>
                )}
              </>
            )}
          </div>

          {qrCodeUrl && (
            <div className="max-w-xs mx-auto mb-8 text-center">
              <p className="mb-2 font-semibold text-gray-700">QR Code:</p>
              <img src={qrCodeUrl} alt="QR Code de pagamento" className="mx-auto" />
            </div>
          )}

          {pagamentoData && (
            <pre className="mt-8 p-4 bg-gray-50 text-xs rounded max-w-4xl mx-auto">
              {JSON.stringify(pagamentoData, null, 2)}
            </pre>
          )}

        </main>
      ) : (
        <main className="flex-grow px-4 py-12 text-center">
          <p>CPF sem inscrição! Verifique e tente novamente.</p>
        </main>
      )}

      <Footer />

      <style jsx>{`
        .iframe-epag {
          margin: 0;
          padding: 0;
          border: 0;
          width: 1px;
          min-width: 100%;
        }
      `}</style>
    </div>
  )
}

// Componentes auxiliares
function LabelField({ label, value, full = false }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`${full ? 'w-full' : ''} flex flex-col md:flex-row md:items-center`}>      
      <span className="font-medium text-gray-700 w-48">{label}:</span>
      <span className="font-mono text-gray-500 ml-2">{value}</span>
    </div>
  )
}

function AlternateText({ text }: { text: string }) {
  return (
    <div className="max-w-3xl mx-auto mb-6">
      <div className="border-t border-gray-300 pt-4 text-sm text-gray-600">{text}</div>
    </div>
  )
}
