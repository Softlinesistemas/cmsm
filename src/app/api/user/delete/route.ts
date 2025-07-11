import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  let db;

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "ID do usuário é obrigatório." },
        { status: 400 }
      );
    }

    db = getDBConnection(dbConfig());

    const usuario = await db("Senha").where("CodUsu", id).first();

    if (!usuario) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    // Remove o usuário
    await db("Senha").where("CodUsu", id).delete();

    return NextResponse.json({ message: "Usuário deletado com sucesso." });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao deletar usuário." },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}
