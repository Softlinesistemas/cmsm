import { NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import uploadImagensEdge from "@/helpers/uploadImagesEdge";

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
  const formData = await request.formData();

  const DocNome = formData.get("DocNome")?.toString();
  const DocCategoria = formData.get("DocCategoria")?.toString();
  const file = formData.get("file") as File | null;

  if (!DocNome || !DocCategoria || !file || file.size === 0) {
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes ou arquivo inválido." },
      { status: 400 }
    );
  }

  const db = getDBConnection(dbConfig());

  const categoriaExiste = await db("DocCategoria")
    .where("CodCategoria", DocCategoria)
    .first();

  if (!categoriaExiste) {
    return NextResponse.json(
      { error: "Categoria não encontrada." },
      { status: 404 }
    );
  }

  // Envia o arquivo
  const result = await uploadImagensEdge(file);
  const caminho = result.fileContents?.[0];

  if (!caminho) {
    return NextResponse.json(
      { error: "Erro ao fazer upload do arquivo." },
      { status: 500 }
    );
  }
  const maxResult = await db("Docs").max("CodDoc as max");
  const maxCodDoc = maxResult[0]?.max || 0;
  const novoCodDoc = maxCodDoc + 1;

  const [novoDoc] = await db("Docs")
    .insert({
      CodDoc: novoCodDoc,
      DocNome,
      DocCategoria,
      DocCaminho: caminho,
    })
    .returning(["CodDoc", "DocNome", "DocCaminho", "DocCategoria"]);

  return NextResponse.json(novoDoc, { status: 201 });
}
