import { NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function GET(request: Request) {
  let db
  try {
    const url   = new URL(request.url)
    const query = url.searchParams.get("query")?.trim()

    db = getDBConnection(dbConfig())

    let candidatos
    if (query) {
      candidatos = await db("Candidato")
        .where("Nome",  "like", `%${query}%`)
        .orWhere("CPF", "like", `%${query}%`)
        .orWhere("CodIns", typeof query === "number" ? query : null)
    } else {
      candidatos = await db("Candidato").select("*");
    }

    return NextResponse.json(candidatos)
  } catch (error) {
    console.error("Erro ao buscar candidatos:", error)
    return NextResponse.json(
      { message: "Erro ao buscar candidatos." },
      { status: 500 }
    )
  } finally {
    if (db) await db.destroy()
  }
}