import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import fetch from 'node-fetch'
import getDBConnection from '@/db/conn';
import dbConfig from '@/db/dbConfig';
import path from 'path'
import fs from 'fs/promises'
import os from 'os'

interface PagamentoRequestBody {
  nome: string
  cpf: string
  email: string
  referencia: string
  descricao: string
  valor: number
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

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

    const pagTesouroData = await response.json()
    const urlGru = pagTesouroData.proximaUrl || pagTesouroData.urlGru || pagTesouroData.linkPag
    if (!urlGru) {
      return res.status(500).json({ error: 'URL da GRU não encontrada' })
    }

    // 2) Baixar PDF da GRU
    const pdfResponse = await fetch(urlGru)
    if (!pdfResponse.ok) {
      return res.status(500).json({ error: 'Erro ao baixar o PDF da GRU' })
    }
    const pdfBuffer = await pdfResponse.arrayBuffer()
    const db = getDBConnection(dbConfig());
    // 3) Inserir no banco via Knex
    await db('Pagamentos').insert({
      Nome: body.nome,
      CPF: body.cpf,
      Email: body.email,
      Referencia: body.referencia,
      Descricao: body.descricao,
      Valor: body.valor,
      UrlGru: urlGru,
      JsonResposta: JSON.stringify(pagTesouroData),
      DataCriacao: db.fn.now()
    })

    // 4) Enviar email
    await transporter.sendMail({
      from: `"Secretaria CMSM" <${process.env.EMAIL_USER}>`,
      to: body.email,
      subject: 'Sua GRU - Inscrição CMSM',
      text: `Olá ${body.nome},\n\nSegue em anexo a GRU para pagamento da inscrição.\n\nObrigado.`,
      attachments: [
        {
          filename: 'GRU.pdf',
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf'
        }
      ]
    })

    return res.status(200).json({
      mensagem: 'Pagamento gerado e email enviado com sucesso',
      urlGru,
      pagTesouroData
    })
  } catch (error) {
    console.error('Erro na API gerar-pagamento:', error)
    return res.status(500).json({ error: 'Erro interno no servidor' })
  }
}
