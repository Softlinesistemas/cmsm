import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = getDBConnection(dbConfig());
  const id = parseInt(params.id, 10);

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

    // Verifica se o documento existe
    const docExistente = await db("Docs").where("CodDoc", id).first();
    if (!docExistente) {
      return NextResponse.json(
        { error: "Documento não encontrado." },
        { status: 404 }
      );
    }

    // Verifica se a categoria existe
    const categoriaExiste = await db("DocCategoria")
      .where("CodCategoria", DocCategoria)
      .first();
    if (!categoriaExiste) {
      return NextResponse.json(
        { error: "Categoria não encontrada." },
        { status: 404 }
      );
    }

    // Atualiza
    const atualizado = await db("Docs").where("CodDoc", id).update({
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = getDBConnection(dbConfig());
  const id = parseInt(params.id, 10);

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
