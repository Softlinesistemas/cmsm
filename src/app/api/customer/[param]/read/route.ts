import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest, { params }: { params: { param: string } }) {
  let db = null;

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: "Access denied." }, { status: 401 });
  }

  try {
    const searchParam = decodeURIComponent(params.param);
    const isNumeric = /^\d+$/.test(searchParam);

    db = getDBConnection(dbConfig(String(token.email)));

    const query = db("Clientes").select("Cliente", "CodCli", "Sobrenome", "Cpf", "Cep", "Mes_Nasc", "Dia_Nasc", "Ano_Nasc", "Endereco", "Estado", "Cidade", "ComplementoEndereco", "Telefone", "Tel", "Tel2", "EMail", "EMail2", "CodSeg", "RedeSocial", "Cargo", "Departamento", "Complemento");

    if (isNumeric) {
      query.where("CodCli", searchParam);
    } else {
      query.whereILike("Cliente", `%${searchParam}%`);
    }

    const customer = await query.first();

    if (!customer) {
      return NextResponse.json({ message: "Not found." }, { status: 404 });
    }

    return NextResponse.json({ customer }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}
