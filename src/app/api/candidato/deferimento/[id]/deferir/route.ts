import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const id = Number(segments[segments.length - 2]);

  const { valor } = await request.json();

  const now = new Date();
  const data = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const hora = now.toTimeString().slice(0, 5); // HH:MM

  const db = getDBConnection(dbConfig());
  await db("Candidato")
    .where("CodIns", id)
    .update({
      GRUStatus: "DEFERIDO",
      isencao: "Deferido",
      GRUData: data,
      GRUHora: hora,
      GRUValor: valor,
    });

  return new Response(JSON.stringify({ message: "Candidato deferido com sucesso." }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
