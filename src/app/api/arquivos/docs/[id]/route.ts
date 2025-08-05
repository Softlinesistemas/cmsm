import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

// PUT: Atualiza um documento
export async function PUT(request: NextRequest) {
  const db = getDBConnection(dbConfig());

  const url = new URL(request.url);
  const id = parseInt(url.pathname.split("/").pop() || "", 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { DocNome, DocCategoria } = body;

    if (!DocNome || !DocCategoria) {
      return NextResponse.json(
        { error: "Nome e categoria são obrigatórios." },
        { status: 400 }
      );
    }

    const docExistente = await db("Docs").where("CodDoc", id).first();
    if (!docExistente) {
      return NextResponse.json(
        { error: "Documento não encontrado." },
        { status: 404 }
      );
    }

    const categoriaExiste = await db("DocCategoria")
      .where("CodCategoria", DocCategoria)
      .first();
    if (!categoriaExiste) {
      return NextResponse.json(
        { error: "Categoria não encontrada." },
        { status: 404 }
      );
    }

    await db("Docs").where("CodDoc", id).update({
      DocNome,
      DocCategoria,
    });

    return NextResponse.json(
      { message: "Documento atualizado com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao atualizar documento:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar documento." },
      { status: 500 }
    );
  }
}

// DELETE: Exclui um documento
export async function DELETE(request: NextRequest) {
  const db = getDBConnection(dbConfig());

  const url = new URL(request.url);
  const id = parseInt(url.pathname.split("/").pop() || "", 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    const docExistente = await db("Docs").where("CodDoc", id).first();
    if (!docExistente) {
      return NextResponse.json(
        { error: "Documento não encontrado." },
        { status: 404 }
      );
    }

    await db("Docs").where("CodDoc", id).delete();

    return NextResponse.json(
      { message: "Documento excluído com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir documento:", error);
    return NextResponse.json(
      { error: "Erro interno ao excluir documento." },
      { status: 500 }
    );
  }
}
