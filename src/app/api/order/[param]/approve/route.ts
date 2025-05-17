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
      return NextResponse.json({ message: "No order selected." }, { status: 400 });
    }

    const orderId = Number(decodeURIComponent(params.param));
    if (isNaN(orderId)) {
      return NextResponse.json({ message: "Invalid order ID." }, { status: 400 });
    }

    db = getDBConnection(dbConfig(String(token.email)));
    console.log(orderId)
    await db("Requisi")
        .where({ Pedido: orderId })
        .update({ Tipo: "INVOICE" });

    return NextResponse.json(true, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
}
