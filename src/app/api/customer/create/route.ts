import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  let db = null;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: "Access denied." }, { status: 401 });
  }

  try {
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
      sales_notes,
      contact,
      segments,
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

    const lastId = await db("clientes").select("CodCli").orderBy("CodCli", "desc").first();

    const customer = await db("Clientes")
      .insert({
        CodCli: lastId.CodCli + 1,
        CodUsu: token.id,
        Cliente: first_name,
        Razao: first_name,
        Sobrenome: last_name,
        CPF: ein,
        Dia_Nasc: locale === "pt-BR" ? birth?.split("/")[0] : birth?.split("/")[1],
        Mes_Nasc: locale === "pt-BR" ? birth?.split("/")[1] : birth?.split("/")[0],
        Ano_Nasc: birth?.split("/")[2],
        Endereco: address,
        cep: zip_code?.replace("-", "")?.trim(),
        Estado: state,
        Cidade: city,
        ComplementoEndereco: complement,
        Numero: number,
        Tel: phone?.replace(" ", ""),
        Telefone: phone?.replace(" ", ""),
        Tel2: whatsapp?.replace(" ", ""),
        Email: email,
        CodSeg: segment,
        CodInd: Indicado?.value,
        CodCon: contact.value,
        ...segmentValues,
        RedeSocial: social_network,
        Cargo: job_position,
        Departamento: department,
        Complemento: sales_notes,
        // ObservacaoVenda: sales_notes,
      })
      .returning("*");

    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}

export async function GET() {
  return NextResponse.json({ message: "Not allowed method" }, { status: 405 });
}
 
