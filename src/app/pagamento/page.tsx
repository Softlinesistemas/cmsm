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
  const [gerado, setGerado] = useState(false)
  const [referencia, setReferencia] = useState<string | null>(null)
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

  // Consulta status do pagamento
  const { data: statusInfo, refetch: checkStatus, isFetching: checkingStatus } = useQuery(
    ['status', referencia],
    () => api
      .get(`api/pagamento?referencia=${referencia}`)
      .then(res => res.data),
    {
      enabled: !!referencia,
      refetchOnWindowFocus: false,
      refetchInterval: 5000 // atualiza a cada 5s
    }
  )

  // Inicializa estado se GRU já existe
  useEffect(() => {
    if (candidato?.GRUUrl && !gerado) {
      setGruUrl(candidato.GRUUrl + '&btnConcluir=true')
      setReferencia(candidato.GRURef)
      setGerado(true)
    }
  }, [candidato, gerado])

  // Carrega script do iframe-resizer
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

  function gerarReferencia(codIns: number) {
    const now = new Date()

    const pad = (num: number, size = 2) => String(num).padStart(size, '0')

    const timestamp = [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate()),
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds())
    ].join('')

    return Number(`${timestamp}${codIns}`)
  }


  // Gera pagamento GRU
  const gerarPagamento = async () => {
    if (!candidato || !config) return
    const ref = gerarReferencia(candidato.CodIns)
    try {
      const payload = {
        codigoServico: '11908',
        nomeContribuinte: candidato.Nome,
        cnpjCpf: candidato.CPF,
        referencia: ref,
        competencia: moment(config.GRUDataFim).tz('America/Sao_Paulo').format('MMYYYY'),
        vencimento: moment(config.GRUDataFim).tz('America/Sao_Paulo').format('DDMMYYYY'),
        valorPrincipal: config.ValInscricao,
        email: candidato.Email,
        urlRetorno: `${process.env.NEXT_PUBLIC_BACKEND_URL}/local`,
        descricao: `${config.ProcessoSel} ${candidato.Seletivo}`
      }

      const res = await api.post('api/pagamento', payload)
      const data = res.data
      if (!data.proximaUrl) throw new Error('URL não retornada')

      setGruUrl(data.proximaUrl + '&btnConcluir=true')
      setReferencia(data.referencia || ref || candidato?.GRURef)
      setGerado(true)
    } catch (err) {
      console.error('Erro ao gerar GRU:', err)
      alert('Não foi possível gerar a GRU. Tente novamente.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      <Header />
      <StepsNavbar activeStep={2} />

      <main className="flex-grow px-4 py-12">
        <h1 className="text-center text-2xl font-bold text-green-900 mb-2">Pagamento</h1>
        <h2 className="text-center text-lg text-gray-800 mb-8">
          Efetue o pagamento de R$ {config?.ValInscricao}
        </h2>

        <section className="max-w-3xl mx-auto space-y-6 mb-8">
            <LabelField label="Nome do Candidato" value={candidato?.Nome || ''} full />
            <div><strong>Número de Inscrição:</strong> {candidato?.CodIns}</div>
            <div><strong>Data de Nascimento:</strong> {moment(candidato?.Nasc).tz("America/Sao_Paulo").format("DD/MM/YYYY")}</div>
            <div><strong>Sexo:</strong> {candidato?.Sexo}</div>
            <div><strong>Doc. ID:</strong> {candidato?.CodIns}</div>
            <div className="md:col-span-2"><strong>Candidato ao:</strong> {config?.ProcessoSel} {candidato?.Seletivo}</div>
        </section>

        <div className="text-center mb-8">
          {!gerado ? (
            <button
              onClick={gerarPagamento}
              className="bg-green-900 text-white py-3 px-8 rounded-lg shadow hover:bg-green-800"
            >
              {candidato?.RegistroGRU ? 'Recarregar GRU' : 'Gerar GRU'}
            </button>
          ) : (
            <div className="iframe-container mb-8">
              <iframe
                className="iframe-epag"
                src={`${gruUrl}&tema=tema-light`}
                scrolling="no"
                ref={iframeRef}
              />
            </div>
          )}
        </div>

        {/* Cantinho de informações do pagamento */}
        {statusInfo && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-200 p-4 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Detalhes do Pagamento</h3>
            <p><strong>ID Pagamento:</strong>{statusInfo.idPagamento}</p>
            <p><strong>Tipo:</strong>{statusInfo.tipoPagamentoEscolhido}</p>
            <p><strong>Valor:</strong>R$ {statusInfo.valor.toFixed(2)}</p>
            <p><strong>PSP:</strong>{statusInfo.nomePSP}</p>
            <p><strong>Transação:</strong>{statusInfo.transacaoPSP}</p>
            <p><strong>Status:</strong>{statusInfo.situacao.codigo}</p>
            <p><strong>Data:</strong>{moment(statusInfo.situacao.data).tz('America/Sao_Paulo').format('DD/MM/YYYY')}</p>
            <button
              onClick={() => checkStatus()}
              disabled={checkingStatus}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 disabled:opacity-50"
            >
              {checkingStatus ? 'Verificando...' : 'Atualizar'}
            </button>
          </div>
        )}
      </main>

      <Footer />

      <style jsx>{`
        .iframe-epag { width: 1px; min-width: 100%; border: 0; }
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
