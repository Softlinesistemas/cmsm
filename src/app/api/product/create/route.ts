import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import uploadImagesEdge from "@/helpers/uploadImagesEdge";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ message: "Access denied." }, { status: 401 });
  }

  const formData = await request.formData();
  const data: Record<string, any> = {};
  for (const [key, val] of formData.entries()) {
    if (val instanceof File) {
      data[key] = val;
    } else if (val === "null") {
      data[key] = null;
    } else if (["Preco1", "Estoque1"].includes(key)) {
      data[key] = Number(val);
    } else {
      data[key] = val;
    }
  }

  let uploadedPath: string | undefined;
  const file = data["image"] as File | undefined;
  if (file && file.size > 0) {
    const result: any = await uploadImagesEdge([file]);
    uploadedPath = result.fileContents[0];
  }

  const db = getDBConnection(dbConfig(String(token.email)));

  const result = await db("Produto").max("CodPro as maxCodPro").first();
  const nextCodPro = result?.maxCodPro + 1;

  const insertPayload = {
    CodPro: nextCodPro,
    Produto:    data.Produto,
    Categoria:  data.Categoria,
    Unidade:    data.Unidade,
    Referencia: data.Referencia,
    Preco1:     data.Preco1,
    Estoque1:   data.Estoque1,
    Caminho2:   uploadedPath ?? data.Caminho2 ?? null,
    Data:       new Date(),
  };

  const [newId] = await db("Produto").insert(insertPayload).returning("*");
  await db.destroy();

  return NextResponse.json(
    { message: "Product created successfully.", CodPro: newId },
    { status: 201 }
  );
}
