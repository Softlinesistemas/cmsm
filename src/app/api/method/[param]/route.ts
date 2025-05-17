import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function PUT(request: NextRequest, { params }: { params: { param: string } }) {
  let db = null;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: "Access denied." }, { status: 401 });
  }

  try {
    if (!params?.param) {
      return NextResponse.json({ message: "No method selected." }, { status: 400 });
    }

    const methodId = Number(decodeURIComponent(params.param));
    if (isNaN(methodId)) {
      return NextResponse.json({ message: "Invalid method ID." }, { status: 400 });
    }

    db = getDBConnection(dbConfig(String(token.email)));

    const method = await db("Forma")
      .select("CodForma", "Forma", "Indice")
      .where("CodForma", methodId)
      .first();

    if (!method) {
      return NextResponse.json({ message: "Payment method not found." }, { status: 404 });
    }

    return NextResponse.json({ method }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar forma de pagamento:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
}
