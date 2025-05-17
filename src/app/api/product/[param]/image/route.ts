import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import uploadImagesEdge from "@/helpers/uploadImagesEdge";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function PUT(request: NextRequest, { params }: { params: { param: string } }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ message: "Access denied." }, { status: 401 });
  }

  const formData = await request.formData();

  const file = formData.get("image") as File | null;
  console.log(file)
  if (!file || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "No valid image file provided." }, { status: 400 });
  }

  const db = getDBConnection(dbConfig(String(token.email)));

  try {
    const result = await uploadImagesEdge([file]);
    const uploadedPath = result.fileContents?.[0];

    if (!uploadedPath) {
      return NextResponse.json({ message: "Image upload failed: no path returned." }, { status: 500 });
    }

    const Lanc = Number(decodeURIComponent(params.param));
    const updated = await db("Requisi1").where({ Lanc }).update({ CaminhoVenda: uploadedPath });

    if (updated === 0) {
      return NextResponse.json({ message: "Product not found or no update made." }, { status: 404 });
    }

    return NextResponse.json({ message: "Image uploaded and product updated.", path: uploadedPath }, { status: 200 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Image upload failed.", error: error.message ?? error }, { status: 500 });
  } finally {
    await db.destroy();
  }
}
