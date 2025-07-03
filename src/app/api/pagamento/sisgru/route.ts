import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// https://webservice.sisgru.tesouro.gov.br/sisgru/services/v1/grus
// https://webservice.homsisgru.tesouro.gov.br/sisgru/services/v1/grus
// https://valpagtesouro.tesouro.gov.br/api/gru/solicitacao-pagamento

export async function POST(req: NextRequest) {
  try {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                        xmlns:web="http://webservice.tesouro.fazenda.gov.br/">
        <soapenv:Header/>
        <soapenv:Body>
          <web:consultarGuia>
            <codigoGuia>123456</codigoGuia>
          </web:consultarGuia>
        </soapenv:Body>
      </soapenv:Envelope>`

    const { data } = await axios.post(
      'https://webservice.sisgru.tesouro.gov.br/sisgru/services/v1/grus',
      xml,
      {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          'SOAPAction': 'consultarGuia',
        },
      }
    )

    return NextResponse.json({ xml: data })
  } catch (error: any) {
    console.error('Erro SOAP:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
