import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

// PUT: Atualiza uma categoria
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = getDBConnection(dbConfig());
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { CategoriaNome, CategoriaDescricao, CategoriaCor } = body;

    if (!CategoriaNome || !CategoriaCor) {
      return NextResponse.json(
        { error: "Nome e cor da categoria são obrigatórios." },
        { status: 400 }
      );
    }

    const categoria = await db("DocCategoria")
      .where("CodCategoria", id)
      .first();

    if (!categoria) {
      return NextResponse.json(
        { error: "Categoria não encontrada." },
        { status: 404 }
      );
    }

    await db("DocCategoria").where("CodCategoria", id).update({
      CategoriaNome,
      CategoriaDescricao,
      CategoriaCor,
    });

    return NextResponse.json(
      { message: "Categoria atualizada com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar categoria." },
      { status: 500 }
    );
  }
}

// DELETE: Exclui uma categoria
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = getDBConnection(dbConfig());
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const categoria = await db("DocCategoria")
      .where("CodCategoria", id)
      .first();

    if (!categoria) {
      return NextResponse.json(
        { error: "Categoria não encontrada." },
        { status: 404 }
      );
    }

    // Verifica se existem documentos vinculados
    const docsVinculados = await db("Docs")
      .where("DocCategoria", id)
      .count<{ count: string }>("CodDoc as count")
      .first();

    if (Number(docsVinculados?.count) > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir. Existem documentos vinculados." },
        { status: 400 }
      );
    }

    await db("DocCategoria").where("CodCategoria", id).delete();

    return NextResponse.json(
      { message: "Categoria excluída com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    return NextResponse.json(
      { error: "Erro interno ao excluir categoria." },
      { status: 500 }
    );
  }
}
