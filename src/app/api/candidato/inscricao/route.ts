import { NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function GET() {
  let db;

  try {
    db = getDBConnection(dbConfig());

    const candidato = await db("Candidato as c")
        .select("c.Nome as nome", "c.CodIns as numeroInscricao", "c.Status as status", "c.CPF as cpf", "c.Sexo as sexo", "s.Sala", "c.ramoForca as forca", "c.TelResp as telefone")
        .leftJoin("Sala as s", "c.CodSala", "s.CodSala")

    return NextResponse.json(candidato);
  } catch (error) {
    return NextResponse.json({ message: "Erro ao buscar cotas." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}
