// app/api/candidato/[id]/deferir/route.ts
import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let db;
  const id = Number(params.id);
  const { valor, registro } = await req.json();
  db = getDBConnection(dbConfig());

  // Data e hora atuais no formato ISO
  const now = new Date();
  const data = now.toISOString().slice(0, 10);        // YYYY-MM-DD
  const hora = now.toTimeString().slice(0, 5);        // HH:MM

  await db("Candidato")
    .where("CodIns", id)
    .update({
      GRUStatus: "Deferido",
      GRUData: data,
      GRUHora: hora,
      GRUValor: valor,
      RegistroGRU: registro,
    });

  return NextResponse.json({ message: "Candidato deferido com sucesso." });
}
