import type { NextApiRequest, NextApiResponse } from 'next'
import sql from 'mssql'
import nodemailer from 'nodemailer'
import fetch from 'node-fetch'
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

// Configurações do SQL Server
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  options: {
    encrypt: true, // dependendo do seu servidor
    trustServerCertificate: true // para dev, ajustar em prod
  }
}

// Configuração do Nodemailer para envio de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true para 465, false para outras portas
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
    // 1) Chamar API PagTesouro para gerar pagamento/GRU
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

    // Extraia a URL do PDF da GRU (exemplo: proximaUrl)
    const urlGru = pagTesouroData.proximaUrl || pagTesouroData.urlGru || pagTesouroData.linkPag
    if (!urlGru) {
      return res.status(500).json({ error: 'URL da GRU não encontrada na resposta da PagTesouro' })
    }

    // 2) Baixar o PDF da GRU para enviar por email (como Buffer)
    const pdfResponse = await fetch(urlGru)
    if (!pdfResponse.ok) {
      return res.status(500).json({ error: 'Não foi possível baixar o PDF da GRU' })
    }
    const pdfBuffer = await pdfResponse.arrayBuffer()

    // 3) Salvar dados no banco SQL Server
    // Exemplo simples de insert em tabela Pagamentos (ajuste os campos conforme seu banco)
    const pool = await sql.connect(sqlConfig)
    await pool.request()
      .input('nome', sql.VarChar(255), body.nome)
      .input('cpf', sql.VarChar(20), body.cpf)
      .input('email', sql.VarChar(255), body.email)
      .input('referencia', sql.VarChar(100), body.referencia)
      .input('descricao', sql.VarChar(500), body.descricao)
      .input('valor', sql.Decimal(10, 2), body.valor)
      .input('urlGru', sql.VarChar(500), urlGru)
      .input('jsonResposta', sql.NVarChar(sql.MAX), JSON.stringify(pagTesouroData))
      .query(`
        INSERT INTO Pagamentos
        (Nome, CPF, Email, Referencia, Descricao, Valor, UrlGru, JsonResposta, DataCriacao)
        VALUES
        (@nome, @cpf, @email, @referencia, @descricao, @valor, @urlGru, @jsonResposta, GETDATE())
      `)

    // 4) Enviar email para o candidato com o PDF da GRU anexado
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

    // 5) Retornar resposta completa para frontend
    return res.status(200).json({
      mensagem: 'Pagamento gerado e email enviado com sucesso',
      urlGru,
      pagTesouroData
    })
  } catch (error) {
    console.error('Erro na API gerar-pagamento:', error)
    return res.status(500).json({ error: 'Erro interno no servidor' })
  } finally {
    await sql.close()
  }
}
