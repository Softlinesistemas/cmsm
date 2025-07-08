// app/api/candidato/[id]/isento/route.ts
import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let db;
  db = getDBConnection(dbConfig());
  const id = Number(params.id);

  await db("Candidato")
    .where("CodIns", id)
    .update({
      GRUStatus: "Isento",
      RegistroGRU: null,
      GRUValor: null,
      GRUData: null,
      GRUHora: null,
    });

  return NextResponse.json({ message: "Candidato marcado como isento." });
}
