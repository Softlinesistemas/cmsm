import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function GET(request: NextRequest) {
  let db;
  try {
    db = getDBConnection(dbConfig());

    const salas = await db("Sala")
      .leftJoin("Candidato", "Sala.CodSala", "Candidato.CodSala")
      .select(
        "Sala.CodSala",
        "Sala.Sala",
        "Sala.QtdCadeiras",
        "Sala.Predio",
        "Sala.Andar",
        "Sala.Turma",
        "Sala.Status",
        "Sala.PortadorNec",
        "Sala.QtdPortNec"
      )
      .count("Candidato.CodIns as cadeirasOcupadas")
      .groupBy(
        "Sala.CodSala",
        "Sala.Sala",
        "Sala.QtdCadeiras",
        "Sala.Predio",
        "Sala.Andar",
        "Sala.Turma",
        "Sala.Status",
        "Sala.PortadorNec",
        "Sala.QtdPortNec"
      );

    return NextResponse.json({ success: true, salas });
  } catch (error) {
    console.error("Erro ao buscar salas:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar salas" },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}

export async function POST(request: NextRequest) {
  let db;
  try {
    const body = await request.json();
    const { Sala, QtdCadeiras, Predio, Andar, PortadorNec, Turma, QtdPortNec } = body;
    let { CodSala } = body
    db = getDBConnection(dbConfig());

    if (!CodSala) {
      const maxCodSalaRow = await db("Sala").max("CodSala as maxCodSala").first();
      const maxCodSala = maxCodSalaRow?.maxCodSala ?? 0;

      CodSala = maxCodSala >= 1 ? maxCodSala + 1 : 1;
    }
    
    if (!CodSala || !Sala || QtdCadeiras == null) {
      return NextResponse.json(
        { success: false, message: "Campos obrigatórios ausentes." },
        { status: 400 }
      );
    }

    await db("Sala").insert({
      CodSala,
      Sala,
      QtdCadeiras,
      Predio: Predio || null,
      Andar: Andar || null,
      Turma: Turma || null,
      Status: "Ativo",
      PortadorNec: PortadorNec || null,
      QtdPortNec: QtdPortNec || null,
    });

    return NextResponse.json({ success: true, message: "Sala cadastrada com sucesso." }, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar sala:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao cadastrar sala" },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}
