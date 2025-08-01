import { NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextRequest } from "next/server";

export async function GET() {
  const db = getDBConnection(dbConfig());
  try {
    const results = await db("DocCategoria as c")
      .join("Docs as d", "c.CodCategoria", "d.DocCategoria")
      .select(
        "c.CodCategoria",
        "c.CategoriaNome",
        "c.CategoriaCor",
        "c.CategoriaDescricao",
        "d.CodDoc",
        "d.DocNome",
        "d.DocCaminho"
      );

    const categoriasMap = new Map();

    for (const row of results) {
      const {
        CodCategoria,
        CategoriaNome,
        CategoriaCor,
        CategoriaDescricao,
        CodDoc,
        DocNome,
        DocCaminho,
      } = row;

      if (!categoriasMap.has(CodCategoria)) {
        categoriasMap.set(CodCategoria, {
          CodCategoria,
          CategoriaNome,
          CategoriaCor,
          CategoriaDescricao,
          docs: [],
        });
      }

      categoriasMap.get(CodCategoria).docs.push({
        CodDoc,
        DocNome,
        DocCaminho,
      });
    }

    const categoriasComDocs = Array.from(categoriasMap.values());

    return NextResponse.json(categoriasComDocs);
  } catch (error) {
    console.error("Erro ao buscar categorias com docs (INNER JOIN):", error);
    return new NextResponse(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const db = getDBConnection(dbConfig());

  try {
    const body = await request.json();
    const { DocNome, DocCaminho, DocCategoria } = body;

    if (!DocNome || !DocCaminho || !DocCategoria) {
      return new NextResponse(
        JSON.stringify({ error: "Campos obrigatórios ausentes" }),
        { status: 400 }
      );
    }

    const categoriaExiste = await db("DocCategoria")
      .where("CodCategoria", DocCategoria)
      .first();

    if (!categoriaExiste) {
      return new NextResponse(
        JSON.stringify({ error: "Categoria não encontrada" }),
        { status: 404 }
      );
    }

    const [novoDoc] = await db("Docs")
      .insert({ DocNome, DocCaminho, DocCategoria })
      .returning(["CodDoc", "DocNome", "DocCaminho", "DocCategoria"]);

    return NextResponse.json(novoDoc, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar documento:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erro interno ao criar documento" }),
      { status: 500 }
    );
  }
}
