import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function GET(request: Request) {
  const db = getDBConnection(dbConfig());
  const candidatos = await db<any>("Candidato").select("CodIns as id", "Nome as nome", "CPF as cpf", "isencao as status", "CodUsu")

  return new Response(JSON.stringify({ candidatos }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
