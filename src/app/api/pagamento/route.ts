// app/api/pagtesouro/route.ts

import { NextRequest, NextResponse } from 'next/server'

const PAGTESOURO_TOKEN = process.env.PAGTESOURO_TOKEN as string
const PAGTESOURO_BASE_URL = process.env.PAGTESOURO_BASE_URL as string

export async function POST(request: NextRequest) {
  try {
    // Espera JSON no body com os campos necessários
    const payload = await request.json()

    // Validar payload básico
    const requiredFields = [
      'codigoServico', // 11908
      'referencia', // CodIns
      'competencia', // 072025
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

    // Monta chamada ao PagTesouro
    const response = await fetch(
      `${PAGTESOURO_BASE_URL}/pagamentos`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PAGTESOURO_TOKEN}`
        },
        body: JSON.stringify(payload)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      // Retorna erro detalhado
      return NextResponse.json(
        { error: data },
        { status: response.status }
      )
    }

    // Sucesso: retorna a próxima URL e demais dados
    return NextResponse.json(data)

  } catch (error: any) {
    console.error('Erro na rota PagTesouro:', error)
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    )
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
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    )
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