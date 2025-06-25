import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  let db;

  try {
    const { id } = params;
    const body = await request.json();
    const { Status, Descricao } = body;

    db = getDBConnection(dbConfig());

    const updated = await db("Cota")
      .where({ id })
      .update({ Status, Descricao });

    if (!updated) {
      return NextResponse.json({ message: "Cota não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ message: "Cota atualizada com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar cota:", error);
    return NextResponse.json({ message: "Erro ao atualizar cota." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  let db;

  try {
    const { id } = params;

    db = getDBConnection(dbConfig());

    const deleted = await db("Cota").where({ id }).del();

    if (!deleted) {
      return NextResponse.json({ message: "Cota não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ message: "Cota excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir cota:", error);
    return NextResponse.json({ message: "Erro ao excluir cota." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}
