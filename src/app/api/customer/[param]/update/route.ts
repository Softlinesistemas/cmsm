import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function PUT(request: NextRequest, { params }: { params: { param: string } }) {
  let db = null;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: "Access denied." }, { status: 401 });
  }

  try {
    if (!params?.param) {
      return NextResponse.json({ message: "No customer selected." }, { status: 400 });
    }

    const customerId = Number(decodeURIComponent(params.param));
    if (isNaN(customerId)) {
      return NextResponse.json({ message: "Invalid customer ID." }, { status: 400 });
    }

    const body = await request.json();

    const {
      first_name,
      last_name,
      ein,
      birth,
      address,
      number,
      zip_code,
      state,
      city,
      complement,
      phone,
      whatsapp,
      email,
      segment,
      Indicado,
      partner,
      social_network,
      job_position,
      department,
      segments,
      contact,
      sales_notes,
      locale
    } = body;

    db = getDBConnection(dbConfig(String(token?.email)));

    const segmentValues = {
      Cli: segments?.some((s: any) => s.value === "Cliente") ? "X" : "",
      Forn: segments?.some((s: any) => s.value === "Fornecedor") ? "X" : "",
      Cont: segments?.some((s: any) => s.value === "Contato") ? "X" : "",
      Transp: segments?.some((s: any) => s.value === "Transportadora") ? "X" : "",
      Ind: segments?.some((s: any) => s.value === "Indicado") ? "X" : "",
    };

    const updated = await db("Clientes")
      .where({ CodCli: customerId })
      .update({
        Cliente: first_name,
        CodUsu2: token?.id,
        Sobrenome: last_name,
        CPF: ein,
        Dia_Nasc: locale === "pt-BR" ? birth?.split("/")[0] : birth?.split("/")[1],
        Mes_Nasc: locale === "pt-BR" ? birth?.split("/")[1] : birth?.split("/")[0],
        Ano_Nasc: birth?.split("/")[2],
        Endereco: address,
        Numero: number,
        cep: zip_code?.replace("-", ""),
        Estado: state,
        Cidade: city,
        ComplementoEndereco: complement,
        Tel: phone?.replace(" ", ""),
        Telefone: phone?.replace(" ", ""),
        Tel2: whatsapp?.replace(" ", ""),
        Email: email,
        CodSeg: segment,
        CodInd: Indicado?.value,
        CodCon: contact?.value,
        ...segmentValues,
        RedeSocial: social_network,
        Cargo: job_position,
        Departamento: department,
        Complemento: sales_notes,
        // ObservacaoVenda: sales_notes,
      })
      .returning("*");

    if (!updated || updated.length === 0) {
      return NextResponse.json({ message: "Customer not found." }, { status: 404 });
    }

    return NextResponse.json({ customer: updated[0] }, { status: 200 });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
}
