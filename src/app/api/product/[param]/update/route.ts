import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const resetPayload = {
  CodCor: null,
  CodCor2: null,
  CodCor3: null,
  CodCor4: null,
  CodCor5: null,
  Componente1: null,
  Componente2: null,
  Componente3: null,
  Componente4: null,
  Componente5: null,
  Componente6: null,
  TComponente1: null,
  TComponente2: null,
  TComponente3: null,
  TComponente4: null,
  TComponente5: null,
  TComponente6: null,
};

export async function PUT(request: NextRequest, { params }: { params: { param: string } }) {
  let db = null;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ message: "Access denied." }, { status: 401 });

  try {
    const Lanc = Number(decodeURIComponent(params.param || ""));
    if (isNaN(Lanc)) return NextResponse.json({ message: "Invalid product ID." }, { status: 400 });

    const body = await request.json();
    const {products } = body;
    const produtosList = Array.isArray(products) ? products : [];

    db = getDBConnection(dbConfig());

    await db("Requisi1").where("Lanc", Lanc).update(resetPayload);

    const item = produtosList.find((p: any) => Number(p.Lanc) === Lanc);
    if (!item) return NextResponse.json({ message: "No matching product to update." }, { status: 404 });

    const comps = Array.from({ length: 6 }, (_, i) => item.componentes?.[i]?.component || null);
    const texs  = Array.from({ length: 5 }, (_, i) => item.componentes?.[i]?.texture   || null);
    const fins  = Array.from({ length: 6 }, (_, i) => item.componentes?.[i]?.finish    || null);

    const updatePayload = {
      Preco1: item.PrecoRequisi1 || item.Preco1 || undefined,
      Qtd: item.Qtd || undefined,
      Desconto: item.Desconto || undefined,
      CodCor:   texs[0] != null ? Number(texs[0]) : null,
      CodCor2:  texs[1] != null ? Number(texs[1]) : null,
      CodCor3:  texs[2] != null ? Number(texs[2]) : null,
      CodCor4:  texs[3] != null ? Number(texs[3]) : null,
      CodCor5:  texs[4] != null ? Number(texs[4]) : null,
      Componente1: comps[0],
      Componente2: comps[1],
      Componente3: comps[2],
      Componente4: comps[3],
      Componente5: comps[4],
      Componente6: comps[5],
      TComponente1: fins[0],
      TComponente2: fins[1],
      TComponente3: fins[2],
      TComponente4: fins[3],
      TComponente5: fins[4],
      TComponente6: fins[5]
    };


    const result = await db("Requisi1")
      .where("Lanc", Lanc)
      .update(updatePayload)
      .returning("*");

    return NextResponse.json({ product: result }, { status: 200 });

  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}

export async function GET() {
  return NextResponse.json({ message: "Not allowed method" }, { status: 405 });
}
