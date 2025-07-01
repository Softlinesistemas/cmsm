import { NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function GET(request: Request) {
  let db;

  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query")?.trim();

    db = getDBConnection(dbConfig());

    let candidatos;

    if (query) {
      const queryNumber = Number(query);
      const isNumeric = !isNaN(queryNumber);

      candidatos = await db("Candidato")
        .where("Nome", "like", `%${query}%`)
        .orWhere("CPF", "like", `%${query}%`)
        .modify((qb) => {
          if (isNumeric) {
            qb.orWhere("CodIns", queryNumber);
          }
        });
    } else {
      candidatos = await db("Candidato").select("CodIns", "CPF", "Nome", "Seletivo", "Status", "RevisaoGabarito");
    }

    return NextResponse.json(candidatos);
  } catch (error) {
    console.error("Erro ao buscar candidatos:", error);
    return NextResponse.json(
      { message: "Erro ao buscar candidatos." },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}
