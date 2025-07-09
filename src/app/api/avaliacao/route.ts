import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextResponse } from "next/server";
import moment from "moment-timezone";
import { Buffer } from 'buffer'

export async function POST(request: Request) {
  let db;

  try {
    const {   
        codigoOrgao,
        codigoServico,
        numeroProtocolo,
        cpfCidadao,
        nomeCidadao,
        emailCidadao,
        telefoneCidadao,
        dataSolicitacao 
    } = await request.json();

    db = getDBConnection(dbConfig());

    if (
        !codigoOrgao ||
        !codigoServico ||
        !numeroProtocolo ||
        !cpfCidadao
    ) {
        return NextResponse.json({ error: 'Faltam campos obrigatórios' })
    }

    const payload = {
        identificadorOrgao: String(codigoOrgao),
        identificadorServico: String(codigoServico),
        identificadorProtocolo: String(numeroProtocolo),
        cpfCidadao: cpfCidadao,
        nomeCidadao,
        emailCidadao,
        telefoneCidadao,
        dataSolicitacao: dataSolicitacao || new Date().toISOString()
    }

    const govUser = process.env.GOVBR_AVALIACAO_USER
    const govPass = process.env.GOVBR_AVALIACAO_PASS
    const govAvaliacaoUrl = process.env.GOVBR_AVALIACAO_URL
    const authHeader = 'Basic ' + Buffer
        .from(`${govUser}:${govPass}`)
        .toString('base64')

    const apiRes = await fetch(`${govAvaliacaoUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(payload)
    })

    const data = await apiRes.json()

    if (!apiRes.ok) {
        // Propaga erro vindo da API gov.br
        return NextResponse.json({
        error: data.error || 'Erro na API de Avaliação'
        }, {
        status: apiRes.status
        })
    }

     return NextResponse.json({
      urlFormulario: data.urlFormulario,
      validade: data.validade,
      protocoloAvaliacao: data.protocoloAvaliacao
    });
  } catch (err: any) {   
    if (
      err.code === "ETIMEOUT" ||
      err.code === "ESOCKET" ||
      err.code === "ECONNREFUSED" ||
      err.name === "ConnectionError"
    ) {
      return NextResponse.json(
        { message: "Database server unavailable." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}