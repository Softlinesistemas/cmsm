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
  try {
    const url = new URL(request.url);
    const currentPage = parseInt(url.searchParams.get("currentPage") || "1");
    const limitItemsPerPage = parseInt(
      url.searchParams.get("limitItemsPerPage") || "10"
    );
    const sortBy = url.searchParams.get("sortBy") || "CodCli";
    const order = url.searchParams.get("order") === "asc" ? "asc" : "desc";
    const offset = (currentPage - 1) * limitItemsPerPage;

    const allowedSortFields = [
      "CodCli",
      "Cliente",
      "Sobrenome",
      "CPF",
      "Cep",
    ];
    const validatedSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "CodCli";

    const searchParam = decodeURIComponent(params.param);
    const isNumeric = /^\d+$/.test(searchParam);

    db = getDBConnection(dbConfig(String(token.email)));

    // --- tipos ---
    interface Cliente {
      CodCli: number;
      CodUsu: number;
      Cliente: string;
      Sobrenome: string;
      CPF: string;
      Dia_Nasc: string;
      Mes_Nasc: string;
      Ano_Nasc: string;
      Endereco: string;
      Cep: string;
      Estado: string;
      Cidade: string;
      ComplementoEndereco: string;
      Tel: string;
      Telefone: string;
      Tel2: string;
      Email: string;
      CodSeg: string;
      CodInd: string;
      CodCon: string;
      Cli: string;
      Forn: string;
      Cont: string;
      Transp: string;
      Ind: string;
      RedeSocial: string;
      Cargo: string;
      Departamento: string;
      Complemento: string;
    }
    // estende para incluir os campos do indicado
    interface ClienteWithInd extends Cliente {
      indCodCli?: number;
      indCliente?: string;
      indEmail?: string;
    }

    // --- query principal com JOIN ---
    let baseQuery = db<ClienteWithInd>("Clientes as c")
      .leftJoin("Clientes as ind", "ind.CodCli", "c.CodInd")
      .select(
        // campos de c
        "c.CodCli",
        "c.CodUsu",
        "c.Cliente",
        "c.Sobrenome",
        "c.CPF",
        "c.Dia_Nasc",
        "c.Mes_Nasc",
        "c.Ano_Nasc",
        "c.Endereco",
        "c.Cep",
        "c.Estado",
        "c.Cidade",
        "c.ComplementoEndereco",
        "c.Tel",
        "c.Telefone",
        "c.Tel2",
        "c.Email",
        "c.CodSeg",
        "c.CodInd",
        "c.CodCon",
        "c.Cli",
        "c.Forn",
        "c.Cont",
        "c.Transp",
        "c.Ind",
        "c.RedeSocial",
        "c.Cargo",
        "c.Departamento",
        "c.Complemento",
        // campos do indicado
        "ind.CodCli as indCodCli",
        "ind.Cliente as indCliente",
        "ind.Email as indEmail"
      )
      .orderBy(`c.${validatedSortBy}`, order);

    let countQuery = db("Clientes");

    if (isNumeric) {
      baseQuery = baseQuery.where({ "c.CodCli": Number(searchParam) });
      countQuery = countQuery.where({ CodCli: searchParam });
    } else {
      baseQuery = baseQuery.whereRaw(
        "LOWER(c.Cliente) LIKE ?",
        [`%${searchParam.toLowerCase()}%`]
      );
      countQuery = countQuery.whereRaw(
        "LOWER(Cliente) LIKE ?",
        [`%${searchParam.toLowerCase()}%`]
      );
    }

    // paginação
    const customers = await baseQuery.offset(offset).limit(limitItemsPerPage);
    let totalResult = await countQuery.count({ total: "*" }).first();
    let totalItems = Number(totalResult?.total || 0);
    let totalPages = Math.ceil(totalItems / limitItemsPerPage);

    // busca fallback por CPF
    if (customers.length === 0) {
      const cpfQuery = db<ClienteWithInd>("Clientes as c")
        .leftJoin("Clientes as ind", "ind.CodCli", "c.CodInd")
        .select(
          // repetir selects...
          "c.CodCli",
          "c.CodUsu",
          "c.Cliente",
          "c.Sobrenome",
          "c.CPF",
          "c.Dia_Nasc",
          "c.Mes_Nasc",
          "c.Ano_Nasc",
          "c.Endereco",
          "c.Cep",
          "c.Estado",
          "c.Cidade",
          "c.ComplementoEndereco",
          "c.Tel",
          "c.Telefone",
          "c.Tel2",
          "c.Email",
          "c.CodSeg",
          "c.CodInd",
          "c.CodCon",
          "c.Cli",
          "c.Forn",
          "c.Cont",
          "c.Transp",
          "c.Ind",
          "c.RedeSocial",
          "c.Cargo",
          "c.Departamento",
          "c.Complemento",
          "ind.CodCli as indCodCli",
          "ind.Cliente as indCliente",
          "ind.Email as indEmail",
        )
        .where("c.CPF", "LIKE", `%${searchParam}%`)
        .orderBy(`c.${validatedSortBy}`, order);

      const cpfCountQuery = db("Clientes").where("CPF", "LIKE", `%${searchParam}%`);

      const cpfCustomers = await cpfQuery.offset(offset).limit(limitItemsPerPage);
      totalResult = await cpfCountQuery.count({ total: "*" }).first();
      totalItems = Number(totalResult?.total || 0);
      totalPages = Math.ceil(totalItems / limitItemsPerPage);

      customers.push(...cpfCustomers);
    }

    // montar map de contatos
    const contactIds = customers.filter((c) => c.CodCon).map((c) => c.CodCon);
    let contactsMap = new Map<string, string>();
    if (contactIds.length > 0) {
      const contacts = await db("Clientes")
        .select("CodCli", "Cliente")
        .whereIn("CodCli", contactIds);
      contacts.forEach((ct) => contactsMap.set(ct.CodCli.toString(), ct.Cliente));
    }

    // montar objeto final
    const customersWithSegments = customers.map((customer) => {
      const segments: Array<{ value: string; label: string }> = [];
      if (customer.Cli === "X") segments.push({ value: "Cliente", label: "Cliente" });
      if (customer.Forn === "X") segments.push({ value: "Fornecedor", label: "Fornecedor" });
      if (customer.Cont === "X") segments.push({ value: "Contato", label: "Contato" });
      if (customer.Transp === "X")
        segments.push({ value: "Transportadora", label: "Transportadora" });
      if (customer.Ind === "X") segments.push({ value: "Indicado", label: "Indicado" });

      const contactName = customer.CodCon
        ? contactsMap.get(customer.CodCon.toString())
        : null;

      return {
        CodCli: customer.CodCli,
        Cliente: customer.Cliente,
        Sobrenome: customer.Sobrenome,
        CPF: customer.CPF,
        Dia_Nasc: customer.Dia_Nasc,
        Mes_Nasc: customer.Mes_Nasc,
        Ano_Nasc: customer.Ano_Nasc,
        birth:
          customer.Dia_Nasc && customer.Mes_Nasc && customer.Ano_Nasc
            ? `${customer.Dia_Nasc}/${customer.Mes_Nasc}/${customer.Ano_Nasc}`
            : null,
        Endereco: customer.Endereco,
        Cep: customer.Cep,
        Estado: customer.Estado,
        Cidade: customer.Cidade,
        ComplementoEndereco: customer.ComplementoEndereco,
        Tel: customer.Tel,
        Tel2: customer.Tel2,
        Email: customer.Email,
        CodSeg: customer.CodSeg,
        segments,
        RedeSocial: customer.RedeSocial,
        Cargo: customer.Cargo,
        Departamento: customer.Departamento,
        Complemento: customer.Complemento,
        // campo indicado
        indicated: customer.indCodCli
          ? {
              CodCli: customer.indCodCli,
              Cliente: customer.indCliente,
              Email: customer.indEmail,
            }
          : null,
        // contato
        contact: customer.CodCon
          ? {
              value: customer.CodCon,
              label: contactName || String(customer.CodCon),
            }
          : null,
      };
    });

    return NextResponse.json(
      {
        customers: customersWithSegments,
        totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}
