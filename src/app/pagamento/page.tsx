'use client'

import Header from '@/components/HeaderAdm'
import Footer from '@/components/FooterAdm'
import StepsNavbar from '@/components/StepsNavbar'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react';
import api from '@/utils/api'
import { useQuery } from 'react-query'
import { useSession } from 'next-auth/react'
import moment from 'moment-timezone'

export default function PagamentoPage() {
  const [gruUrl, setGruUrl] = useState('')               // URL para baixar a GRU (PDF)
  const [pagamentoData, setPagamentoData] = useState<any>(null) // Dados completos do pagamento
  const [gerado, setGerado] = useState(false)            // Controle do estado: GRU gerada ou não
  const [statusPagamento, setStatusPagamento] = useState('')   // Status do pagamento, se disponível
  const [qrCodeUrl, setQrCodeUrl] = useState('')         // URL da imagem do QR Code, se tiver
  const { data: session, status } = useSession();

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

  // Função que chama a API para gerar a GRU
  const gerarPagamento = async () => {
    try {
      const res = await api.post('api/pagamento', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigoServico: "11908", // valor fixo
          nomeContribuinte: candidato?.Nome,
          cnpjCpf: candidato?.CPF,
          email: candidato?.Email,
          vencimento: moment(dataConfiguracao?.GRUDataFim).tz("America/Sao_Paulo").format("DDMMYYYY"),
          urlRetorno: process.env.NEXT_PUBLIC_BACKEND_URL + "/local",
          expiracaoPix: 1,
          valorPrincipal: dataConfiguracao?.ValInscricao,
          referencia: candidato?.CodIns,
          descricao: `${candidato?.ProcessoSel} ${candidato?.Seletivo}`
        })
      }) 

      const data = res.data;

      console.log('Resposta completa PagTesouro:', data)

      // Extrai a URL da GRU do objeto retornado (varia conforme API)
      const urlGerada = data.proximaUrl || data.urlGru || data.linkPag || ''
      if (urlGerada) {
        setGruUrl(urlGerada)
        setGerado(true)
      } else {
        alert('URL da GRU não encontrada na resposta!')
      }

      // Salva toda a resposta para uso futuro
      setPagamentoData(data)

      // Se a API retornar um status do pagamento, salva aqui
      if (data.statusPagamento) {
        setStatusPagamento(data.statusPagamento)
      }

      // Se vier a URL do QR Code na resposta, salva para mostrar
      // Exemplo: data.qrCodeUrl ou data.qrCode
      const qrUrl = data.qrCodeUrl || data.qrCode || ''
      if (qrUrl) setQrCodeUrl(qrUrl)

    } catch (error) {
      console.error('Erro na chamada:', error)
      alert('Erro inesperado ao gerar pagamento.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <StepsNavbar activeStep={2} />
      {candidato?.CodIns || true ? 
      <main className="flex-grow px-4 py-12">
        <h1 className="text-center text-2xl font-bold text-green-900 mb-2">Pagamento</h1>
        <h2 className="text-center text-lg text-gray-800 mb-8">Requerimento realizado com sucesso, efetue o pagamento no valor de: R$ {dataConfiguracao?.ValInscricao}</h2>

        <div className="max-w-3xl mx-auto space-y-6 mb-8">
          <LabelField label="Nome do Candidato" value={candidato?.Nome} full />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelField label="Número de Inscrição" value={candidato?.CodIns} />
            <LabelField label="Data de Nascimento" value={moment(candidato?.Nac).tz("America/Sao_Paulo").format("DD/MM/YYYY")} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelField label="Sexo" value={candidato?.Sexo === "F" ? "Feminino" : "Masculino"} />
            <LabelField label="Doc. ID" value={candidato?.CodIns} />
          </div>
          {candidato?.Seletivo && <LabelField label="Candidato ao" value={candidato?.Seletivo + " do CMSM"} full />}
        </div>

        <AlternateText text="Em caso de dúvidas, entre em contato com a secretaria da escola." />
        <AlternateText text="Verifique seus dados antes de prosseguir com o pagamento." />

        {/* Se o pagamento já foi gerado, mostra botão para baixar e dados adicionais */}
        <div className="text-center mb-8">
          {!gerado ? (
            <button
              onClick={gerarPagamento}
              className="bg-green-900 text-white font-semibold py-3 px-8 rounded-lg shadow hover:bg-green-800 transition"
            >
              Gerar GRU
            </button>
          ) : (
            <>
              <a
                href={gruUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-900 text-white font-semibold py-3 px-8 rounded-lg shadow hover:bg-green-800 transition"
              >
                Baixar GRU
              </a>
              {statusPagamento && (
                <p className="mt-4 text-green-700 font-semibold">Status do pagamento: {statusPagamento}</p>
              )}
            </>
          )}
        </div>

        {/* Se vier QR Code, mostra ele para facilitar o pagamento */}
        {qrCodeUrl && (
          <div className="max-w-xs mx-auto mb-8 text-center">
            <p className="mb-2 font-semibold text-gray-700">Escaneie o QR Code para pagar:</p>
            <img src={qrCodeUrl} alt="QR Code para pagamento" className="mx-auto" />
          </div>
        )}

        {/* Mostra todos os dados retornados para debug ou informação detalhada */}
        {pagamentoData && (
          <div className="mt-8 p-4 border rounded bg-gray-50 text-xs text-gray-600 max-w-4xl mx-auto whitespace-pre-wrap">
            <h3 className="font-semibold mb-2">Dados completos da GRU:</h3>
            <pre>{JSON.stringify(pagamentoData, null, 2)}</pre>
          </div>
        )}
      </main> : (
        <main className='flex-grow px-4 py-12 min-h-screen'>
          <h2 className="text-center text-lg text-gray-800 mb-8">Perdão, mas não foi encontrado inscrições para esse CPF.</h2>
        </main>
      )}
      <Footer />
    </div>
  )
}

// --- Helpers usados acima ---

function LabelField({ label, value, full = false }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`${full ? 'w-full' : ''} flex flex-col md:flex-row md:items-center`}>
      <label className="font-medium text-gray-700 w-48">{label}:</label>
      <span className="font-mono text-gray-500">{value}</span>
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

/**
 * QRCODE
 * {gerado && gruUrl && (
  <div className="text-center mt-6">
    <h3 className="text-green-900 font-semibold mb-2">QR Code para Pagamento</h3>
    <QRCodeSVG value={gruUrl} size={180} />
  </div>
)}
 * ============================================================
 * 📌 Como funciona este componente `PagamentoPage`
 * 
 * ✅ 1) Mostra um resumo do candidato (nome, inscrição, etc.).
 * ✅ 2) Ao clicar no botão "Gerar GRU", faz POST para `/api/gerar-pagamento`.
 * ✅ 3) A resposta é completa e:
 *       - Salva a URL da GRU para baixar.
 *       - Salva os dados completos para uso futuro.
 *       - Mostra status e QR Code (se vier na resposta).
 * ✅ 4) Se a URL existir, mostra botão "Baixar GRU" que abre em nova aba.
 * ✅ 5) Exibe o JSON completo para debug.
 * 
 */
