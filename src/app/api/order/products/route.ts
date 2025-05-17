import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ message: "Access denied." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const order = searchParams.get("order");

  if (!order) {
    return NextResponse.json({ message: "Pedido não informado." }, { status: 400 });
  }

  let db = null;
  try {
    db = getDBConnection(dbConfig(String(token.email)));

    // 1) requisição principal
    const requisi = await db("Requisi as rq")
      .select(
        "rq.Indice",
        "rq.Autorizacao",
        "rq.Pedido",
        "rq.Tipo",
        "rq.Observacao",
        "rq.Seguro",
        "rq.Encargo",
        "rq.Frete",
        "rq.Despesas",
        "rq.Total",
        "rq.Subtotal",
        "rq.HoraProposta",
        "ce.Numero",
        "ce.Cep",
        "ce.Estado",
        "ce.Cidade",
        "ce.Endereco",
        "ce.ComplementoEndereco",
        ...Array.from({ length: 16 }, (_, idx) => [
          `rq.CodForma${idx + 1}`,
          `rq.Valor${idx + 1}`,
          `rq.Data${idx + 1}`
        ]).flat()
      )
      .where("rq.Pedido", order)
      .join("Cliente_Entrega as ce", "ce.Lanc", "rq.LancEntrega")
      .first();

    // 2) produtos
    const rawProducts = await db("Requisi1 as r")
      .join("Produto as p", "r.CodPro", "p.CodPro")
      .select(
        "r.CodPro",
        "r.CaminhoVenda",
        "p.Produto",
        "r.Desconto",
        "r.Lanc",
        "p.Categoria",
        "p.Caminho2",
        "p.Estoque1",
        "p.Unidade",
        "p.Preco1",
        "r.Preco1 as PrecoRequisi1",
        "p.Referencia",
        "r.Transito",
        "r.Qtd",
        "r.Componente1", "r.Componente2", "r.Componente3", "r.Componente4", "r.Componente5", "r.Componente6",
        "r.TComponente1", "r.TComponente2", "r.TComponente3", "r.TComponente4", "r.TComponente5", "r.TComponente6",
        "r.CodCor", "r.CodCor2", "r.CodCor3", "r.CodCor4", "r.CodCor5"
      )
      .where("r.Pedido", order);

    const coresMap = await db("Cor").select("CodCor", "Cor");
    const coresDict = Object.fromEntries(coresMap.map(c => [c.CodCor, c.Cor]));
    const products = rawProducts.map(p => {
      const componentesArr = [
        p.Componente1, p.Componente2, p.Componente3,
        p.Componente4, p.Componente5, p.Componente6
      ].filter(Boolean);
      const tComponentesArr = [
        p.TComponente1, p.TComponente2, p.TComponente3,
        p.TComponente4, p.TComponente5, p.TComponente6
      ].filter(Boolean);
      const coresArr = [
        p.CodCor, p.CodCor2, p.CodCor3,
        p.CodCor4, p.CodCor5
      ].filter(Boolean);
      const nomesCoresArr = coresArr.map(cod => coresDict[cod] || "Desconhecida");
      const components = componentesArr.map((component, idx) => ({
        component,
        textureName: nomesCoresArr[idx] ?? null,
        texture: coresArr[idx] ?? null,
        finish: tComponentesArr[idx] ?? null
      }));
      return {
        ...p,
        tComponentes: tComponentesArr,
        cores: coresArr,
        coresNomes: nomesCoresArr,
        componentes: components.length ? components : [{ component: "", texture: "", finish: "" }]
      };
    });

    const indicated = await db("Requisi as rq")
      .join("Clientes as c", "rq.CodInd", "c.CodCli")
      .select("c.CodCli", "c.Cliente", "c.Email")
      .where("rq.Pedido", order)
      .first();

    const customer = await db("Requisi as rq")
      .join("Clientes as c", "rq.CodCli", "c.CodCli")
      .select("c.CodCli", "c.Cliente", "c.Cep", "c.Email", "c.Tel", "c.Endereco")
      .where("rq.Pedido", order)
      .first();

    const indicatedCad = await db("Clientes as c")
      .join("Clientes as ind", "ind.CodCli", "c.CodInd")
      .select(
        "ind.CodCli as indCodCli",
        "ind.Cliente as indCliente",
        "ind.Email as indEmail"
      )
      .where("c.CodCli", customer.CodCli)
      .first();

    return NextResponse.json({ products, indicated, customer, indicatedCad, order: requisi }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}
