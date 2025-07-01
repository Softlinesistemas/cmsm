import { NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function GET(request: Request) {
  const db = getDBConnection(dbConfig());

  try {
    const url = new URL(request.url);
    const tipo = url.searchParams.get("tipo");
    const status = url.searchParams.get("status");

    const funcao = await db("Funcao").first("ProcessoSel");
    const processoSel = funcao?.ProcessoSel;

    const query = db("Candidato")
      .select(
        "CodIns",
        "Nome",
        "CPF",
        "Status",
        "isencao",
        "HoraCad",
        "DataCad",
        "observacao",
      )
      .whereNotNull("isencao")
      .modify((builder) => {
        if (status && status !== "Todos") {
          builder.where("isencao", status);
        }
      })
      .orderByRaw(`
        CASE 
          WHEN [isencao] = 'Pendente' THEN 0
          WHEN [isencao] = 'Aprovado' THEN 1
          WHEN [isencao] = 'Reprovado' THEN 2
          ELSE 3
        END ASC
      `)
      .orderBy("CodIns", "asc");

    const resultados = await query;

    return NextResponse.json({
      processoSel,
      resultados,
    });
  } catch (error) {
    console.error("Erro ao buscar isenções:", error);
    return NextResponse.json({ error: "Erro ao buscar isenções" }, { status: 500 });
  }
}
