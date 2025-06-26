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

  const edital = formData.get("EditalCaminho") as File | null;
  const cronograma = formData.get("CronogramaCaminho") as File | null;
  const documentos = formData.get("DocumentosCaminho") as File | null;

  const arquivos: File[] = [];
  if (edital && edital.size > 0) arquivos.push(edital);
  if (cronograma && cronograma.size > 0) arquivos.push(cronograma);
  if (documentos && documentos.size > 0) arquivos.push(documentos);
  
  const result = await uploadImagensEdge(arquivos);

  const caminhosSalvos = {
    edital: edital ? result.fileContents?.[arquivos.indexOf(edital)] || null : null,
    cronograma: cronograma ? result.fileContents?.[arquivos.indexOf(cronograma)] || null : null,
    documentos: documentos ? result.fileContents?.[arquivos.indexOf(documentos)] || null : null,
  };

  const db = getDBConnection(dbConfig());

  try {
    const funcao = await db("Funcao").first("ProcessoSel");
    
    await db("Funcao")
    .where("ProcessoSel", funcao.ProcessoSel)
    .update({
      EditalCaminho: caminhosSalvos.edital,
      CronogramaCaminho: caminhosSalvos.cronograma, 
      DocumentosCaminho: caminhosSalvos.documentos
    });

    return NextResponse.json({ message: "Arquivos atualizados." }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}