import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let db;

  try {
    const { user: userName, password } = await request.json();

    db = getDBConnection(dbConfig());

    const user = await db("Senha as S")
      .leftJoin("Candidato as C", "S.CodUsu", "C.CodUsu")
      .select(
        "S.CodUsu as id",
        "S.Usuario as user",
        "S.Senha as password",
        "S.ADM as admin",
      )
      .where("S.Senha", password)
      .andWhere((builder) => {
        builder.where("S.Usuario", userName).orWhere("C.CPF", userName);
      })
      .first();
  
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }
    console.log(user)
    return NextResponse.json({ user: user.user, id: user.id, admin: user.admin });

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
