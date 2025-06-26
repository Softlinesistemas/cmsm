import { NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function GET() {
  let db;

  try {
    db = getDBConnection(dbConfig());

    const [configuracao] = await db("Funcao")
      .orderBy([
        { column: "GRUDataFim", order: "desc" },
        { column: "GRUHoraFim", order: "desc" },
      ])
      .limit(1);

    if (!configuracao) {
      return NextResponse.json({ message: "Nenhuma configuração encontrada." }, { status: 404 });
    }
    console.log(configuracao)
    return NextResponse.json(configuracao);
  } catch (error) {
    console.error("Erro ao buscar configuração:", error);
    return NextResponse.json({ message: "Erro ao buscar configuração." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}

export async function POST(request: Request) {
  let db;

  try {
    const body = await request.json();

    const {
      ProcessoSel,
      ValInscricao,
      GRUDataFim,
      GRUHoraFim,
      NascIniEF,
      NascFimEF,
      DataIniEF,
      HoraIniEF,
      HoraFimEF,
      NascIniEM,
      NascFimEM,
      HoraIniEM,
      HoraFimEM,
      NotaMinMat,
      NotaMinPor,
    } = body;

    db = getDBConnection(dbConfig());

    const existing = await db("Funcao")
      .where({ ProcessoSel })
      .first();

    if (existing) {
      await db("Funcao")
        .where({ ProcessoSel })
        .update({
          ValInscricao,
          GRUDataFim,
          GRUHoraFim,
          NascIniEF,
          NascFimEF,
          DataIniEF,
          HoraIniEF,
          HoraFimEF,
          NascIniEM,
          NascFimEM,
          HoraIniEM,
          HoraFimEM,
          NotaMinMat: NotaMinMat || null,
          NotaMinPor: NotaMinPor || null,
        });
      return NextResponse.json({ message: "Configuração atualizada com sucesso." });
    } else {
      await db("Funcao").insert({
        ProcessoSel,
        ValInscricao,
        GRUDataFim,
        GRUHoraFim,
        NascIniEF,
        NascFimEF,
        DataIniEF,
        HoraIniEF,
        HoraFimEF,
        NascIniEM,
        NascFimEM,
        HoraIniEM,
        HoraFimEM,
        NotaMinMat: NotaMinMat || null,
        NotaMinPor: NotaMinPor || null,
      });
      return NextResponse.json({ message: "Configuração salva com sucesso." });
    }
  } catch (error) {
    console.error("Erro ao salvar configuração:", error);
    return NextResponse.json(
      { message: "Erro ao salvar configuração." },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}
