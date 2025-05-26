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
    const sortBy = url.searchParams.get("sortBy") || "Pedido"; 
    const type = url.searchParams.get("type") || ""; 
    const start = url.searchParams.get("start") || ""; 
    const end = url.searchParams.get("end") || ""; 
    const order = url.searchParams.get("order") === "asc" ? "asc" : "desc"; 
    const searchQuery = url.searchParams.get("query") || ""; 
    const offset = (currentPage - 1) * limitItemsPerPage;

    const allowedSortFields = ["Pedido", "IndicadoNome", "ClienteNome", "Data", "Total"];
    
    const validatedSortBy = allowedSortFields.includes(sortBy) ? sortBy : "Pedido";

    db = getDBConnection(dbConfig());
    console.log(searchQuery)
    const baseQuery = db("Requisi as r")
      .leftJoin("Clientes as c", "r.CodInd", "c.CodCli")
      .leftJoin("Clientes as cl", "r.CodCli", "cl.CodCli")
      .where(function () {
        this.where("r.Pedido", "like", `%${searchQuery}%`)
          .orWhere("cl.Cliente", "like", `%${searchQuery}%`)
          .orWhere("c.Cliente", "like", `%${searchQuery}%`);
      });

    if (type === "INVOICE" || type === "QUOTE") {
      baseQuery.andWhere("r.Tipo", type);
    }

    if (start && end) {
      baseQuery.andWhereBetween("r.Data", [start, end]);
    } else if (start) {
      baseQuery.andWhere("r.Data", ">=", start);
    } else if (end) {
      baseQuery.andWhere("r.Data", "<=", end);
    }

    const totalResult = await baseQuery.clone().count({ total: "*" }).first();
    const totalItems = Number(totalResult?.total || 0);
    const totalPages = Math.ceil(totalItems / limitItemsPerPage);

    const orders = await baseQuery
      .clone()
      .select(
        "r.Pedido",
        "r.Data",
        "r.HoraProposta",
        "r.Tipo",
        "r.Total",
        "r.Autorizacao",
        "c.CodCli as IndicadoCodCli", 
        "c.Cliente as IndicadoNome", 
        "cl.CodCli as ClienteCodCli", 
        "cl.Cliente as ClienteNome"
      )
      .orderBy(validatedSortBy, order)
      .offset(offset)
      .limit(limitItemsPerPage);

    return NextResponse.json({ orders, totalPages }, { status: 200 });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}
