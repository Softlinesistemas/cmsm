import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(
  request: NextRequest,
  { params }: { params: { param: string } }
) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) {
    return NextResponse.json({ message: "Access denied." }, { status: 401 });
  }

  let db = null;
  db = getDBConnection(dbConfig(String(token.email)));
  try {
    const id = params.param;

    const order = await db("Requisi").where({ Pedido: id }).select("CodCli", "LancEntrega as Lanc").first();
    let selectedAddress = null;
    if (order?.Lanc) {
      selectedAddress = await db("Cliente_Entrega").where({ Lanc: order?.Lanc }).select("*").first();
    }
    const mainAddress = await db("clientes")
      .where("CodCli", order.CodCli)
      .select("Endereco", "Bairro", "Cidade", "Estado", "CEP", "ComplementoEndereco", "Numero")
      .first();
    const shippingAddresses = await db("Cliente_Entrega").where("CodCli", order.CodCli).select("*");

    return NextResponse.json({ selectedAddress, mainAddress, shippingAddresses });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    )
  } finally {
    if (db) await db.destroy();
  }
}
