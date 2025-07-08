import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function GET(req: NextRequest) {
  let db;
  db = getDBConnection(dbConfig());

  const candidatos = await db<any>("Candidato")
    .select("CodIns as id", "Nome as nome", "CPF as cpf", "GRUStatus as status")
    .where("GRUStatus", "Em Análise");

  return NextResponse.json({ candidatos });
}