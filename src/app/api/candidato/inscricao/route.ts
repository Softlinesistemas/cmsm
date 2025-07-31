import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function GET(req: NextRequest) {
  let db;
  const { searchParams } = new URL(req.url);
  const pesquisa = searchParams.get("pesquisa")?.trim() || "";

  try {
    db = getDBConnection(dbConfig());

    const query = db("Candidato as c")
      .select(
        "c.Nome as nome",
        "c.CodIns as numeroInscricao",
        "c.GRUStatus as status",
        "c.CPF as cpf",
        "c.Sexo as sexo",
        "s.Sala",
        "c.ramoForca as forca",
        "c.TelResp as telefone",
        "c.isencao",
        "c.Seletivo as seletivo"
      )
      .leftJoin("Sala as s", "c.CodSala", "s.CodSala");

    if (pesquisa) {
      query.where((builder) =>
        builder
          .where("c.Nome", "like", `%${pesquisa}%`)
          .orWhere("c.CodIns", "like", `%${pesquisa}%`)
      );
    }

    const resultado = await query;

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro ao buscar inscrições:", error);
    return NextResponse.json(
      { message: "Erro ao buscar inscrições." },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}
