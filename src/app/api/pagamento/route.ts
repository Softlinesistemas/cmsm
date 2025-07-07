// app/api/pagtesouro/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConfig from "@/db/dbConfig";
import getDBConnection from "@/db/conn";

const PAGTESOURO_TOKEN = process.env.PAGTESOURO_TOKEN as string
const PAGTESOURO_BASE_URL = process.env.PAGTESOURO_BASE_URL as string
const USE_MOCK = process.env.USE_PAGTESOURO_MOCK === 'true'

export async function POST(request: NextRequest) {
  let db;
  try {
    db = getDBConnection(dbConfig());
    const payload = await request.json()

    const requiredFields = [
      'codigoServico',
      'referencia',
      'competencia',
      'vencimento',
      'cnpjCpf',
      'nomeContribuinte',
      'valorPrincipal'
    ]
    for (const field of requiredFields) {
      if (!payload[field]) {
        return NextResponse.json(
          { error: `Campo obrigatório faltando: ${field}` },
          { status: 400 }
        )
      }
    }

    if (USE_MOCK) {
      // MOCK de sucesso
      return NextResponse.json({
          "idPagamento": "1BvAmpIRYZF55yg9D6WOTZ",
          "dataCriacao": "2022-01-12T16:00:00Z",
          "proximaUrl": "https://valpagtesouro.tesouro.gov.br/#/pagamento?idSessao=66706694-fce3-4a56-8172-8b4ed12508a4&tema=tema-light",
          "situacao": {
            "codigo": "CRIADO"
          }  
      })
    }

    const response = await fetch(`${PAGTESOURO_BASE_URL}/api/gru/solicitacao-pagamento`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAGTESOURO_TOKEN}`
      },
      body: JSON.stringify(payload)
    })

    const contentType = response.headers.get('content-type')
    const rawBody = await response.text()
    const parsedBody = JSON.parse(rawBody);

    // Ajuda a diagnosticar
    console.log('Resposta bruta PagTesouro:', rawBody)

    if (!response.ok) {
      return NextResponse.json({ error: rawBody }, { status: response.status })
    }

    await db("Candidato")
      .where({ CPF: payload?.cnpjCpf })
      .update({
        RegistroGRU: parsedBody?.idPagamento,
        GRUUrl: parsedBody?.proximaUrl,
        GRUData: parsedBody?.dataCriacao,
        GRUHora: parsedBody?.dataCriacao,
        GRUValor: payload?.valorPrincipal
      });

    if (contentType && contentType.includes('application/json')) {
      const data = JSON.parse(rawBody)
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: 'Resposta inválida da API do PagTesouro' }, { status: 502 })
    }

  } catch (error: any) {
    console.error('Erro na rota PagTesouro:', error)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}

// Rota GET para consulta de status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const referencia = searchParams.get('referencia')

    if (!referencia) {
      return NextResponse.json(
        { error: 'Parâmetro referencia é obrigatório' },
        { status: 400 }
      )
    }

    if (USE_MOCK) {
      // MOCK de status
      return NextResponse.json({
        referencia,
        status: 'PAGO',
        dataPagamento: '2025-07-04',
        valorPago: '50.00'
      })
    }

    const response = await fetch(
      `${PAGTESOURO_BASE_URL}/pagamentos/status?referencia=${encodeURIComponent(referencia)}`,
      {
        headers: {
          'Authorization': `Bearer ${PAGTESOURO_TOKEN}`
        }
      }
    )

    const data = await response.json()
    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status })
    }

    return NextResponse.json(data)

  } catch (error: any) {
    console.error('Erro na rota PagTesouro (status):', error)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}
/**
 * Configuração necessária no .env.local:
 *
 * PAGTESOURO_TOKEN=seu_token_jwt_aqui
 * PAGTESOURO_BASE_URL=https://valpagtesouro.tesouro.gov.br/simulador/api
 *
 * Ajuste PAGTESOURO_BASE_URL em produção conforme manual da STN.
 */