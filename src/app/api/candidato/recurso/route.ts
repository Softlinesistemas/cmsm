import { NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function GET(request: Request) {
  let db;

  try {
    db = getDBConnection(dbConfig());

  const candidatosRecursos = await db("Candidato")
    .select("CodIns", "Nome", "CPF", "Status", "isencao", "observacao")
    .whereNotNull("isencao")
    .orderByRaw(`
      CASE isencao
        WHEN 'Pendente' THEN 0
        WHEN 'Aprovado' THEN 1
        WHEN 'Reprovado' THEN 2
        ELSE 3
      END
    `)
    .orderBy("CodIns", "asc");

    return NextResponse.json(candidatosRecursos);
  } catch (error) {
    console.error("Erro ao buscar recursos:", error);
    return NextResponse.json({ message: "Erro ao buscar recursos." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}
