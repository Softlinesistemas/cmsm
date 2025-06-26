import { NextRequest, NextResponse } from 'next/server';

const TOKEN_URL = 'https://api-pagtesouro.tesouro.gov.br/oauth2/token';
const PAGAMENTO_URL = 'https://api-pagtesouro.tesouro.gov.br/api/v2/solicitacao-pagamento';

const CLIENT_ID = process.env.PAGTESOURO_CLIENT_ID!;
const CLIENT_SECRET = process.env.PAGTESOURO_CLIENT_SECRET!;
const CODIGO_SERVICO = process.env.PAGTESOURO_CODIGO_SERVICO!;

async function getAccessToken() {
  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  if (!res.ok) {
    throw new Error(`Erro ao obter token: ${res.statusText}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const accessToken = await getAccessToken();

    const payload = {
      codigoServico: CODIGO_SERVICO,
      requisicaoPagamento: {
        referencia: body.referencia,             // string única para essa cobrança
        valorOriginal: body.valorOriginal,       // número decimal string "100.50"
        cnpjCpf: body.cnpjCpf,                    // string, sem pontuação
        nomeContribuinte: body.nomeContribuinte, // string
        vencimento: body.vencimento,              // string ISO 8601 "yyyy-MM-dd"
      },
    };

    // 3. Chamar endpoint de solicitação de pagamento
    const res = await fetch(PAGAMENTO_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
