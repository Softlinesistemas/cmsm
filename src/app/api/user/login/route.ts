import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const einCpfMask = (value: string) => {
  let cleaned = value.replace(/\D/g, "");

  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
};

export async function POST(request: Request) {
  let db;

  try {
    const { user: userName, password } = await request.json();

    db = getDBConnection(dbConfig());

    const user = await db("Senha as S")
      .select(
        "S.CodUsu as id",
        "S.Usuario as user",
        "S.Senha as password",
        "S.ADM as admin",
      )
      .where((builder) => {
        builder.where("S.Usuario", userName).orWhere("S.CPF", einCpfMask(userName));
      })
      .first();
      
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password) || password ===  user.password;

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Senha incorreta." },
        { status: 401 }
      );
    }

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
