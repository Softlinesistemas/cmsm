import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import moment from "moment-timezone";

export async function PUT(request: NextRequest, { params }: { params: { param: string } }) {
  let db = null;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: "Access denied." }, { status: 401 });
  }

  try {
    if (!params?.param) {
      return NextResponse.json({ message: "No order selected." }, { status: 400 });
    }

    const orderId = Number(decodeURIComponent(params.param));
    if (isNaN(orderId)) {
      return NextResponse.json({ message: "Invalid order ID." }, { status: 400 });
    }

    const body = await request.json();
    const {
      Indicado,
      Data,
      products,
      payments,
      Encargo,
      Total,
      locale,
      address,
      number,
      zip_code,
      state,
      city,
      Cliente,
      complement,
    } = body;

    db = getDBConnection(dbConfig());

    const result = await db.transaction(async trx => {
      
      const shipping = await trx("Cliente_Entrega").insert({
        CodCli: Cliente?.value,
        Numero: Number(number),
        Cep: zip_code,
        Estado: state,
        Cidade: city, 
        Endereco: address,
        ComplementoEndereco: complement,
      }).returning("Lanc");

      const [order] = await trx("Requisi")
        .where({ Pedido: orderId })
        .update({
          Data1: Data ?? moment().tz("America/Sao_Paulo").locale(locale).format("L"),
          Total,
          Encargo,
          LancEntrega: shipping[0].Lanc,
          CodInd: Indicado?.value,
          ...clearPaymentFields(),
          ...generatePaymentFields(payments) // Adicionando os campos de pagamento dinamicamente
        })
        .returning("*");

      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
      }

      const existing = await trx("Requisi1")
        .where({ Pedido: orderId })
        .select("Lanc");
      const existingLanc = existing.map(r => r.Lanc);

      const incomingLanc = products.map((p: any) => p.Lanc).filter((l: any) => l != null);

      const toDelete = existingLanc.filter(l => !incomingLanc.includes(l));
      if (toDelete.length) {
        await trx("Requisi1")
          .where({ Pedido: orderId })
          .whereIn("Lanc", toDelete)
          .del();
      }

      const toInsert = products.filter((p: any) => !existingLanc.includes(p.Lanc));
      if (toInsert.length) {
        const rows = toInsert.map((p: any) => ({
          Pedido: orderId,
          CaminhoVenda: p.Caminho,
          Codpro: p.CodPro,
          Preco1: p.Preco1,
          Qtd: p.quantity || p.Qtd,
          Unidade: p.Unidade,
          Producao: p.Produto
        }));
        await trx("Requisi1").insert(rows).returning("*");
      }

      const toUpdate = products.filter((p: any) => existingLanc.includes(p.Lanc));
      for (const prod of toUpdate) {
        await trx("Requisi1")
          .where({ Pedido: orderId, Lanc: prod.Lanc })
          .update({
            CaminhoVenda: prod.Caminho,
            Codpro: prod.CodPro,
            Preco1: prod.Preco1,
            Qtd: prod.quantity || prod.Qtd,
            Unidade: prod.Unidade,
            Producao: prod.Produto
          });
      }

      return order;
    });

    return NextResponse.json({ order: result }, { status: 200 });
  } catch (error: any) {
    if (error.message === "ORDER_NOT_FOUND") {
      return NextResponse.json({ message: "order not found." }, { status: 404 });
    }
    console.error("Error updating order:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}

function clearPaymentFields() {
  const fields: Record<string, null> = {};
  for (let i = 1; i <= 16; i++) {
    fields[`CodForma${i}`] = null;
    fields[`Valor${i}`] = null;
    fields[`Data${i}`] = null;
  }
  return fields;
}

function generatePaymentFields(payments: any[]) {
  const paymentFields: Record<string, any> = {};
  payments.forEach((payment, index) => {
    const idx = index + 1;
    if (idx > 16) return;

    const rawDate = payment.date;
    let formattedDate: string | null = null;

    if (rawDate) {
      const m = moment(rawDate, ['YYYY-MM-DD', 'DD/MM/YYYY', moment.ISO_8601], true);
      if (m.isValid()) {
        formattedDate = m.format('YYYY-MM-DD');
      } else {
        console.warn(`Invalid payment date format: ${rawDate}`);
      }
    }

    paymentFields[`CodForma${idx}`] = payment.method ?? null;
    paymentFields[`Valor${idx}`] = payment.value ?? null;
    paymentFields[`Data${idx}`] = formattedDate;
  });

  return paymentFields;
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
}
