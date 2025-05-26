import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ message: "Access denied." }, { status: 401 });
  }

  let db = null;
  try {
    db = getDBConnection(dbConfig());

    const methods = await db("Forma")
      .select("CodForma", "Forma", "Indice")
      .orderBy("CodForma", "asc");

    return NextResponse.json({ methods }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar formas de pagamento:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}
