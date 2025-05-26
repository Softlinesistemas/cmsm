import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import uploadImagesEdge from "@/helpers/uploadImagesEdge";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function PUT(request: NextRequest, { params }: { params: { param: string } }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ message: "Access denied." }, { status: 401 });

  const formData = await request.formData();
  
  const data: Record<string, any> = {};
  for (const [key, val] of formData.entries()) {
    if (val instanceof File) {
      data[key] = val;
      continue;
    }

    if (val === "null") {
      data[key] = null;
      continue;
    }

    if (["CodPro","Preco1","Estoque1"].includes(key) && !isNaN(Number(val))) {
      data[key] = Number(val);
      continue;
    }

    if (key === "Data" && !isNaN(Date.parse(val))) {
      data[key] = new Date(val);
      continue;
    }

    data[key] = val;
  }

  let uploadedPath: string | undefined;
  const file = data["image"] as File | undefined;
  if (file && file.size > 0) {
    const result: any = await uploadImagesEdge([file]);
    console.log(result)
    uploadedPath = result.fileContents[0]; 
  }

  const updatePayload: Partial<{
    Produto: string;
    Categoria: string;
    Unidade: string;
    Referencia: string;
    Preco1: number;
    Estoque1: number;
    Data: Date;
    Caminho2: string | null;
  }> = {
    Produto:   data.Produto,
    Categoria: data.Categoria,
    Unidade:   data.Unidade,
    Referencia: data.Referencia,
    Preco1:    Number(data.Preco1),
    Estoque1:  Number(data.Estoque1),
    Data:      data.Data,
    Caminho2: uploadedPath ?? data.Caminho2,
  };

  const CodPro = Number(decodeURIComponent(params.param));
  const db = getDBConnection(dbConfig());
  const updated = await db("Produto")
    .where({ CodPro })
    .update(updatePayload);
  await db.destroy();

  if (updated === 0) {
    return NextResponse.json({ message: "Product not found or no changes." }, { status: 404 });
  }
  return NextResponse.json({ message: "Product updated successfully." }, { status: 200 });
}
