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
    const sortBy = url.searchParams.get("sortBy") || "CodPro";
    const order = url.searchParams.get("order") === "asc" ? "asc" : "desc";
    const searchQuery = url.searchParams.get("query") || "";
    const offset = (currentPage - 1) * limitItemsPerPage;

    const allowedSortFields = ["CodPro", "Produto", "Categoria", "Unidade", "Preco1", "Referencia", "Estoque1", "Data"];
    const validatedSortBy = allowedSortFields.includes(sortBy) ? sortBy : "CodPro";

    db = getDBConnection(dbConfig(String(token.email)));

    const baseQuery = db("Produto")
      .where(function () {
        this.where("Produto", "like", `%${searchQuery}%`)
          .orWhere("Complemento", "like", `%${searchQuery}%`)
          .orWhere("CodPro", "like", `%${searchQuery}%`)
          .orWhere("Referencia", "like", `%${searchQuery}%`)
      });

    const totalResult = await baseQuery.clone().count({ total: "*" }).first();
    const totalItems = Number(totalResult?.total || 0);
    const totalPages = Math.ceil(totalItems / limitItemsPerPage);

    const products = await baseQuery
      .clone()
      .select("CodPro", "Produto", "Categoria", "Caminho2", "Unidade", "Preco1", "Referencia", "Estoque1", "Data", "Largura", "Altura", "Comprimento", "Peso")
      .orderBy(validatedSortBy, order)
      .offset(offset)
      .limit(limitItemsPerPage);

    return NextResponse.json({ products, totalPages }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}
