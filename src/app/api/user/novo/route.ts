import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextResponse } from "next/server";
import moment from "moment-timezone";
import bcrypt from "bcryptjs";

export async function GET() {
  let db;

  try {
    db = getDBConnection(dbConfig());

    const users = await db("Senha as S")
      .select(
        "S.CodUsu as id",
        "S.Usuario as nome",
        "S.CPF as cpf",
        "S.ADM",
        "S.CodSeg",
      )
      .whereNot("S.CodSeg", 1)
      .whereNotNull("S.CodSeg");

    // Agrupa os módulos por usuário
    const usuariosMap: Record<number, {
      id: number;
      nome: string;
      cpf: string;
      modulos: string[];
      ativo: boolean;
    }> = {};

    for (const user of users) {
      if (!usuariosMap[user.id]) {
        let modulo = null
        switch (user.CodSeg) {
            case 2:
                modulo = "Admin"
                break;
            case 3:
                modulo = "Financeiro"               
                break;
            case 4:
                modulo = "Dashboard"          
                break;
            default: 
                modulo = "Admin"
        }

        usuariosMap[user.id] = {
          id: user.id,
          nome: user.nome,
          cpf: user.cpf,
          modulos: [modulo],
          ativo: true,
        };
      }

      if (user.modulo) {
        usuariosMap[user.id].modulos.push(user.modulo);
      }
    }

    const usuarios = Object.values(usuariosMap);

    return NextResponse.json(usuarios);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao buscar usuários." },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}


export async function POST(request: Request) {
  let db;

  try {
    const { user, password, cpf, CodSeg } = await request.json();

    if (!user || !password || !cpf || !CodSeg) {
      return NextResponse.json(
        { message: "Usuário, CPF, Segmento e senha são obrigatórios." },
        { status: 400 }
      );
    }

    db = getDBConnection(dbConfig());

    const userByUsername = await db("Senha").where("Usuario", user).first();
    if (userByUsername) {
    return NextResponse.json(
        { message: "Nome de usuário já está em uso." },
        { status: 409 }
    );
    }

    const userByCPF = await db("Senha").where("CPF", cpf).first();
    if (userByCPF) {
    return NextResponse.json(
        { message: "CPF já está cadastrado." },
        { status: 409 }
    );
    }

    const lastUser = await db("Senha")
      .max("CodUsu as maxCodUsu")
      .first();

    const nextCodUsu = lastUser?.maxCodUsu ? Number(lastUser.maxCodUsu) + 1 : 1;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere novo admin
    await db("Senha").insert({
      CodUsu: nextCodUsu,
      Usuario: user,
      Senha: hashedPassword,
      CPF: cpf,
      ADM: "X", // Marca como administrador
      CodSeg: CodSeg,
      DataCad: moment().tz("America/Sao_Paulo").format("YYYY-MM-DD"),
      HoraCad: moment().tz("America/Sao_Paulo").format("HH:mm"),
    });

    return NextResponse.json({
      message: "Administrador criado com sucesso.",
      user,
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao criar administrador." },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}


