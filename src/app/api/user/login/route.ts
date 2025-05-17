import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let db;

  try {
    const { email, password } = await request.json();

    db = getDBConnection(dbConfig());

    const user = await db("Senha as S")
      .leftJoin("Clientes as C", "S.CodUsu", "C.CodCli")
      .select(
        "S.CodUsu as id",
        db.raw("COALESCE(S.Email, C.Email) as email"),
        "S.Usuario as name",
        "S.Senha as password",
        "S.Op91 as admin",
      )
      .where("S.Senha", password)
      .andWhere((builder) => {
        builder.where("S.Email", email).orWhere("C.Email", email);
      })
      .first();
  
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });

  } catch (error: any) {
    console.log(error)
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

export async function GET() {
  return NextResponse.json(
    { message: "Method not allowed." },
    { status: 405 }
  );
}
