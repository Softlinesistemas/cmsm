import { NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function POST(request: Request) {
  const db = getDBConnection(dbConfig());

  try {
    const body = await request.json();
    const { CategoriaNome, CategoriaCor, CategoriaDescricao } = body;

    if (!CategoriaNome || !CategoriaCor) {
      return new NextResponse(
        JSON.stringify({ error: "Nome e cor da categoria são obrigatórios." }),
        { status: 400 }
      );
    }

    const [novaCategoria] = await db("DocCategoria")
      .insert({
        CategoriaNome,
        CategoriaCor,
        CategoriaDescricao: CategoriaDescricao || null,
      })
      .returning([
        "CodCategoria",
        "CategoriaNome",
        "CategoriaCor",
        "CategoriaDescricao",
      ]);

    return NextResponse.json(novaCategoria, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erro interno ao criar categoria." }),
      { status: 500 }
    );
  }
}
