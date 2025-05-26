import type { NextApiRequest, NextApiResponse } from 'next'

interface PagamentoRequestBody {
  nome: string
  cpf: string
  email: string
  referencia: string
  descricao: string
  valor: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const token = process.env.PAGTESOURO_TOKEN

  const body = req.body as PagamentoRequestBody

  try {
    const response = await fetch('https://api.pagtesouro.tesouro.gov.br/pagamentos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const error = await response.text()
      return res.status(500).json({ error: 'Erro na API PagTesouro', detail: error })
    }

    const result = await response.json()
    return res.status(200).json({ proximaUrl: result.proximaUrl })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro interno ao gerar pagamento' })
  }
}
