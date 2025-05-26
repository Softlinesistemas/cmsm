import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import moment from "moment-timezone";

export async function POST(request: NextRequest) {
  let db = null;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: "Access denied." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      Data,
      Cliente,
      Indicado,
      Observacao,
      payments,
      Tipo_Preco,
      Status,
      CodCli,
      CodForma1,
      DataBaixa,
      HoraBaixa,
      CodApr,
      Subtotal,
      Frete,
      Indice,
      Produtos,
      Encargo,
      Seguro,
      Despesas,
      Total,
      isProspect,
      prospectName,
      address,
      number,
      zip_code,
      state,
      city,
      complement,
      products: produtosList
    } = body;

    db = getDBConnection(dbConfig());

    const result = await db.transaction(async trx => {
      const shippingAddress = await trx("Cliente_Entrega").where({Endereco: address, Numero: number}).select("Lanc").first();
      let lancShipping = null;
      if (!shippingAddress?.Lanc) {
        const shipping = await trx("Cliente_Entrega").insert({
          CodCli: Cliente?.value,
          Numero: number,
          Cep: zip_code,
          Estado: state,
          Cidade: city,
          Endereco: address,
          ComplementoEndereco: complement,
        }).returning("Lanc")
        lancShipping = shipping[0].Lanc;
      } else {
        lancShipping = shippingAddress.Lanc;
      }

      const ultimo = await trx("Requisi").max("Pedido as maxPedido").first();
      const novoPedido = (ultimo?.maxPedido ?? 0) + 1;

      const [pedido] = await trx("Requisi")
        .insert({
          Pedido: novoPedido,
          Dados: `Pedido ${novoPedido}`,
          Data1: Data ?? moment().tz("America/Sao_Paulo").format("L"),
          Data: Data ?? moment().tz("America/Sao_Paulo").format("L"),
          HoraProposta: moment().tz("America/Sao_Paulo").format("HH:mm"),
          CodCli: isProspect ? 0 : CodCli ?? Cliente?.value,
          Autorizacao: isProspect ? prospectName : undefined,
          CodInd: Indicado?.value,
          Observacao,
          Tipo_Preco,
          Status,
          CodForma1,
          DataBaixa,
          HoraBaixa,
          CodApr,
          Subtotal,
          Frete,
          Valor1: Total,
          Total,
          Indice,
          Produtos,
          Encargo,
          Seguro,
          Despesas,
          LancEntrega: lancShipping,
          ...generatePaymentFields(payments)
        })
        .returning("*");

      if (Array.isArray(produtosList) && produtosList.length) {
        const detalhes = produtosList.map((p: any) => {
          const comps = Array.from({ length: 6 }, (_, i) => p.componentes?.[i]?.component || null);
          const texs  = Array.from({ length: 5 }, (_, i) => p.componentes?.[i]?.texture   || null);
          const fins  = Array.from({ length: 6 }, (_, i) => p.componentes?.[i]?.finish    || null);

          return {
            Pedido: novoPedido,
            Marca: p.Marca,
            Desconto: p.Desconto,
            Foto: p.Foto,
            Codpro: p.CodPro,
            Qtd: p.QTD,
            Preco1: p.PrecoRequisi1 || p.Preco1,
            Total: p.Total,
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
        });

        await trx("Requisi1").insert(detalhes).returning("Lanc");
      }

      const newOrder = await trx("Requisi as r")
        .leftJoin("Clientes as c", "r.CodInd", "c.CodCli")
        .leftJoin("Clientes as cl", "r.CodCli", "cl.CodCli")
        .where("r.Pedido", novoPedido)
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
        ).first();

      return { pedido, newOrder };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}

export async function GET() {
  return NextResponse.json({ message: "Not allowed method" }, { status: 405 });
}

function generatePaymentFields(payments: any[]) {
  const fields: Record<string, any> = {};
  payments.forEach((p, i) => {
    const idx = i + 1;
    if (p.method) fields[`CodForma${idx}`] = p.method;
    if (p.value)  fields[`Valor${idx}`]   = p.value;
    if (p.date)   fields[`Data${idx}`]    = p.date;
  });
  return fields;
}
