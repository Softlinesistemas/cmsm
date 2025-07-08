// app/api/candidato/[id]/indeferir/route.ts
import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  let db;
  db = getDBConnection(dbConfig());

  await db("Candidato")
    .where("CodIns", id)
    .update({
      GRUStatus: "Indeferido",
      RegistroGRU: null,
      GRUValor: null,
      GRUData: null,
      GRUHora: null,
    });

  return NextResponse.json({ message: "Candidato indeferido com sucesso." });
}
