import { NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function GET(request: Request) {
  let db;

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status")?.trim();
    const ano = url.searchParams.get("ano")?.trim();

    db = getDBConnection(dbConfig());

    const baseQuery = db("Candidato")
      .select(
        "CodIns",
        "CPF",
        "Nome",
        "Seletivo",
        "Status",
        "RevisaoGabarito",
        "NotaMatematica",
        "NotaPortugues",
        "NotaRedacao"
      );

    if (status) {
      baseQuery.where("Status", status);
    }

    if (ano) {
      baseQuery.andWhere("Seletivo", ano);
    }

    const candidatos = await baseQuery;

    return NextResponse.json(candidatos);
  } catch (error) {
    console.error("Erro ao buscar candidatos:", error);
    return NextResponse.json(
      { message: "Erro ao buscar candidatos.", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}
