import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import uploadImagensEdge from "@/helpers/uploadImagesEdge";

export async function PUT(
  request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ message: "Access denied." }, { status: 401 });
  }

  const formData = await request.formData();

  let uploadedPath: string | null = null;
  const file = formData.get("image") as File;
  if (file && file.size > 0) {
    const result = await uploadImagensEdge([file]);
    uploadedPath = result.fileContents?.[0] || null;
  }

  const db = getDBConnection(dbConfig());

  try {
   

    return NextResponse.json({ message: "Arquivos atualizados." }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}