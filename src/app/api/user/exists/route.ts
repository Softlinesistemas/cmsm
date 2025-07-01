import getDBConnection from "@/db/conn"; 
import dbConfig from "@/db/dbConfig";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const cpf = searchParams.get("cpf");

    if (!cpf) {
      return NextResponse.json(
        { message: "CPF is required." },
        { status: 400 }
      );
    }

    db = getDBConnection(dbConfig());

    const user = await db("Candidato")
      .select("CodUsu as id", "CPF")
      .where("CPF", cpf)
      .first();

    if (!user) {
      return NextResponse.json(
        { exists: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ exists: true, id: user.id, cpf: user.CPF });
  } catch (error: any) {
    console.error(error);
    if (
      error.code === "ETIMEOUT" ||
      error.code === "ESOCKET" ||
      error.code === "ECONNREFUSED" ||
      error.name === "ConnectionError"
    ) {
      return NextResponse.json(
        { message: "Database server unavailable." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}
