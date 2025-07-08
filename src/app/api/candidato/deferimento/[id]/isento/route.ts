// app/api/candidato/[id]/isento/route.ts
import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const id = Number(segments[segments.length - 2]);

  const db = getDBConnection(dbConfig());
  await db("Candidato")
    .where("CodIns", id)
    .update({
      GRUStatus: "Isento",
      RegistroGRU: null,
      GRUValor: null,
      GRUData: null,
      GRUHora: null,
    });

  return new Response(JSON.stringify({ message: "Candidato marcado como isento." }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
