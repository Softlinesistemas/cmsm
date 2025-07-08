import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const id = Number(segments[segments.length - 2]);
  console.log(id)
  const db = getDBConnection(dbConfig());
  await db("Candidato")
    .where("CodIns", id)
    .update({
      GRUStatus: "INDEFERIDO",
      isencao: "Indeferido",
      RegistroGRU: null,
      GRUValor: null,
      GRUData: null,
      GRUHora: null,
    });

  return new Response(JSON.stringify({ message: "Candidato indeferido com sucesso." }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
