import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ message: "Access denied." }, { status: 401 });
  }

  let db = null;
  try {
    const url = new URL(request.url);
    const currentPage = parseInt(url.searchParams.get("currentPage") || "1");
    const limitItemsPerPage = parseInt(url.searchParams.get("limitItemsPerPage") || "10");
    const sortBy = url.searchParams.get("sortBy") || "CodCli";
    const order = url.searchParams.get("order") === "asc" ? "asc" : "desc";
    const searchQuery = url.searchParams.get("query") || "";
    const offset = (currentPage - 1) * limitItemsPerPage;

    const allowedSortFields = ["CodCli", "Cliente", "Sobrenome", "Cpf", "Cep"];
    const validatedSortBy = allowedSortFields.includes(sortBy) ? sortBy : "CodCli";

    db = getDBConnection(dbConfig(String(token.email)));

    // Filtro para busca
    const baseQuery = db("Clientes")
      .where(function () {
        this.where("Clientes.Cliente", "like", `%${searchQuery}%`)
          .orWhere("Clientes.CodCli", "like", `%${searchQuery}%`)
          .orWhere("Clientes.Sobrenome", "like", `%${searchQuery}%`)
          .orWhere("Clientes.Cpf", "like", `%${searchQuery}%`)
          .orWhere("Clientes.Cep", "like", `%${searchQuery}%`);
      });

    // Total de itens com filtro
    const totalResult = await baseQuery.clone().count({ total: "*" }).first();
    const totalItems = Number(totalResult?.total || 0);
    const totalPages = Math.ceil(totalItems / limitItemsPerPage);

    // Pega os clientes paginados com ordenação
    const customers = await baseQuery
      .clone()
      .leftJoin("Clientes as Indicador", "Clientes.CodInd", "Indicador.CodCli")
      .select(
        "Clientes.Cliente",
        "Clientes.CodCli",
        "Clientes.Sobrenome",
        "Clientes.Cpf",
        "Clientes.Cep",
        "Indicador.Cliente as NomeIndicador",
        "Indicador.CodCli as CodIndicador"
      )
      .orderBy(validatedSortBy, order)
      .offset(offset)
      .limit(limitItemsPerPage);


    return NextResponse.json({ customers, totalPages }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}
