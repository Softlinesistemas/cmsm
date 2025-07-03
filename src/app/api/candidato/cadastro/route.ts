import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextResponse } from "next/server";
import moment from "moment-timezone";

export async function POST(request: Request) {
  let db;

  try {
    const { user: userName, password, admin = null } = await request.json();

    db = getDBConnection(dbConfig());

    // Verifica se o usuário já existe
    const existingUser = await db("Senha")
      .where("Usuario", userName)
      .first();

    // if (existingUser) {
    //   return NextResponse.json(
    //     { message: "Usuário já existe." },
    //     { status: 400 }
    //   );
    // }

    // Busca o maior CodUsu atual
    const lastUser = await db("Senha")
      .max("CodUsu as maxCodUsu")
      .first();

    const nextCodUsu = lastUser?.maxCodUsu ? Number(lastUser.maxCodUsu) + 1 : 1;

    // Insere o novo usuário com CodUsu definido manualmente
    await db("Senha").insert({
      CodUsu: nextCodUsu,
      Usuario: userName,
      Senha: password,
      ADM: admin,
      DataCad: moment().tz("America/Sao_Paulo").format("YYYY-MM-DD"),
      HoraCad: moment().tz("America/Sao_Paulo").format("HH:mm"),
    });

    return NextResponse.json({
      message: "Usuário cadastrado com sucesso.",
      id: nextCodUsu,
      user: userName,
      admin,
    });
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
      { message: "Erro interno do servidor." },
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
