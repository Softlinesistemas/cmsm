import { NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function GET() {
  let db;

  try {
    db = getDBConnection(dbConfig());

    const cotas = await db("Cota").select("*").orderBy("id");

    return NextResponse.json(cotas);
  } catch (error) {
    console.error("Erro ao buscar cotas:", error);
    return NextResponse.json({ message: "Erro ao buscar cotas." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}

export async function POST(request: Request) {
  let db;

  try {
    const body = await request.json();
    const { Status, Descricao } = body;

    if (!Status || !Descricao) {
      return NextResponse.json(
        { message: "Campos 'Status' e 'Descricao' são obrigatórios." },
        { status: 400 }
      );
    }

    db = getDBConnection(dbConfig());

    const [id] = await db("Cota").insert({ Status, Descricao });

    return NextResponse.json({ message: "Cota inserida com sucesso.", id });
  } catch (error) {
    console.error("Erro ao inserir cota:", error);
    return NextResponse.json({ message: "Erro ao inserir cota." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}
