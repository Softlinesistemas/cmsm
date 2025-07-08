import { NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import moment from "moment-timezone";
import { z, ZodError } from "zod";

const toNumber = z.preprocess((val) => {
  if (val === null || val === undefined || val === "") return undefined;
  if (typeof val === "string" && val.trim() !== "") return parseInt(val, 10);
  return val;
}, z.number().int());

const candidatoSchema = z.object({
  Nome: z.string().min(3, "O nome deve ter ao menos 3 caracteres."),
  CPF: z.string().regex(/^\d{3}\.?\d{3}\.?\d{3}\-?\d{2}$/, "CPF inválido."),
  Nasc: z.string()
    .refine(s => !isNaN(Date.parse(s)), { message: "Data de nascimento inválida." })
    .transform(s => new Date(s))
    .refine(d => d <= new Date(), { message: "Data de nascimento não pode ser no futuro." }),
  CodIns: toNumber.optional(),
  CodUsu: toNumber.optional(),
  Email: z.string().email("Formato de e-mail inválido.").optional(),
});

export async function GET(request: Request) {
  let db;

  try {
    const url = new URL(request.url);
    const codIns = url.searchParams.get("codIns");

    if (!codIns) {
      return NextResponse.json({ message: "Parâmetro codIns é obrigatório." }, { status: 400 });
    }

    db = getDBConnection(dbConfig());

    const candidato = await db("Candidato").where({ CodIns: codIns }).first();

    if (!candidato) {
      return NextResponse.json({ message: "Candidato não encontrado." }, { status: 404 });
    }

    return NextResponse.json(candidato);
  } catch (error) {
    console.error("Erro ao buscar candidato:", error);
    return NextResponse.json({ message: "Erro ao buscar candidato." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}

export async function POST(request: Request) {
  let db;
  let data;

  try {
    const body = await request.json();
    let { CodIns } = body;    

   try {
      data = candidatoSchema.parse(body);
    } catch (err) {
      if (err instanceof ZodError) {
        // Retorna apenas a primeira mensagem de erro
        const first = err.errors[0];
        return NextResponse.json(
          { error: first.message },
          { status: 400 }
        );
      }
      throw err;
    }

    const {
      CodUsu,
      Nome,
      CPF,
      Nasc,
      Sexo,
      Email,
      Cep,
      Endereco,
      Complemento,
      Bairro,
      Cidade,
      UF,
      CodCot1,
      CodCot2,
      CodCot3,
      CodCot4,
      CodCot5,
      CodCot6,
      CodCot7,
      CodCot8,
      CodCot9,
      CodCot10,
      PortadorNec,
      AtendimentoEsp,
      Responsavel,
      CPFResp,
      NascResp,
      SexoResp,
      CepResp,
      EnderecoResp,
      ComplementoResp,
      BairroResp,
      CidadeResp,
      UFResp,
      ProfissaoResp,
      EmailResp,
      TelResp,
      Parentesco,
      PertenceFA,
      CaminhoFoto,
      CaminhoDoc1,
      CaminhoDoc2,
      RegistroGRU,
      GRUData,
      GRUValor,
      GRUHora,
      CodSala,
      DataEnsalamento,
      HoraEnsalamento,
      CodUsuEnsalamento,
      Status,
      CaminhoResposta,
      CaminhoRedacao,
      RevisaoGabarito,
      DataImportacao,
      HoraImportacao,
      CodUsuImportacao,
      NotaMatematica,
      NotaPortugues,
      NotaRedacao,
      DataRevisao,
      CodUsuRev,
      Seletivo,
      isencao,
      observacao
    } = body;

    db = getDBConnection(dbConfig());
    
    if (!CodIns) {
      const maxCodInsRow = await db("Candidato").max("CodIns as maxCodIns").first();
      const maxCodIns = maxCodInsRow?.maxCodIns ?? 0;

      CodIns = maxCodIns >= 10001 ? maxCodIns + 1 : 10001;
    }

    const existing = await db("Candidato").where({ CodIns }).first();
    const cpfFormatado = CPF?.replace(/\D/g, "");
    const cpfExistente = await db("Candidato")
      .where("CPF", cpfFormatado)
      .first();

    if (existing?.CPF !== cpfFormatado && cpfExistente) {
      return NextResponse.json(
        { error: "Já existe um candidato com esse CPF." },
        { status: 400 }
      );
    }

    if (existing) {
      // Atualiza
      await db("Candidato")
        .where({ CodIns })
        .update({         
          Nome,
          Nasc,
          Sexo: Sexo === "masculino" ? "M" : "F",
          Email,
          Cep: Cep.replace("-", ""),
          Endereco,
          Complemento,
          Bairro,
          Cidade,
          UF,
          CodCot1,
          CodCot2,
          CodCot3,
          CodCot4,
          CodCot5,
          CodCot6,
          CodCot7,
          CodCot8,
          CodCot9,
          CodCot10,
          PortadorNec,
          AtendimentoEsp,
          Responsavel,
          CPFResp: CPFResp?.replace(".", "").replace("-", ""),
          NascResp,
          SexoResp: Sexo === "masculino" ? "M" : "F",
          CepResp: CepResp.replace("-", ""),
          EnderecoResp,
          ComplementoResp,
          BairroResp,
          CidadeResp,
          UFResp,
          ProfissaoResp,
          EmailResp,
          TelResp: TelResp.replace(/\D/g, ''),
          Parentesco,
          PertenceFA,
          CaminhoFoto,
          CaminhoDoc1,
          CaminhoDoc2,
          RegistroGRU,
          GRUData,
          GRUValor,
          GRUHora,
          CodSala,
          DataEnsalamento,
          HoraEnsalamento,
          CodUsuEnsalamento,
          Status,
          CaminhoResposta,
          CaminhoRedacao,
          RevisaoGabarito,
          DataImportacao,
          HoraImportacao,
          CodUsuImportacao,
          NotaMatematica,
          NotaPortugues,
          NotaRedacao,
          DataRevisao,
          CodUsuRev,
          isencao,
          observacao
        });
      return NextResponse.json({ message: "Candidato atualizado com sucesso." });
    } else {
      const lastCodUsu = await db("Candidato")
        .max("CodUsu as maxCodUsu")
        .first();
      const CodUsu = (lastCodUsu?.maxCodUsu || 0) + 1;

      await db("Candidato").insert({
        CodUsu: CodUsu,
        CodIns,
        Nome,
        Seletivo,
        DataCad: moment().tz("America/Sao_Paulo").format("YYYY-MM-DD"),
        HoraCad: moment().tz("America/Sao_Paulo").format("HH:mm"),
        CPF: cpfFormatado,
        Nasc,
        Sexo: Sexo === "masculino" ? "M" : "F",
        Email,
        Cep: Cep.replace("-", ""),
        Endereco,
        Complemento,
        Bairro,
        Cidade,
        UF,
        CodCot1,
        CodCot2,
        CodCot3,
        CodCot4,
        CodCot5,
        CodCot6,
        CodCot7,
        CodCot8,
        CodCot9,
        CodCot10,
        PortadorNec,
        AtendimentoEsp,
        Responsavel,
        CPFResp: CPFResp?.replace(".", "").replace("-", ""),
        NascResp,
        SexoResp: Sexo === "masculino" ? "M" : "F",
        CepResp: CepResp.replace("-", ""),
        EnderecoResp,
        ComplementoResp,
        BairroResp,
        CidadeResp,
        UFResp,
        ProfissaoResp,
        EmailResp,
        TelResp: TelResp.replace(/\D/g, ''),
        Parentesco,
        PertenceFA,
        CaminhoFoto,
        CaminhoDoc1,
        CaminhoDoc2,
        RegistroGRU,
        GRUData,
        GRUValor,
        GRUHora,
        CodSala,
        DataEnsalamento,
        HoraEnsalamento,
        CodUsuEnsalamento,
        Status,
        CaminhoResposta,
        CaminhoRedacao,
        RevisaoGabarito,
        DataImportacao,
        HoraImportacao,
        CodUsuImportacao,
        NotaMatematica,
        NotaPortugues,
        NotaRedacao,
        DataRevisao,
        CodUsuRev,
        isencao,
        observacao
      });
      return NextResponse.json({ message: "Candidato inserido com sucesso." });
    }
  } catch (error) {
    console.error("Erro ao salvar candidato:", error);
    return NextResponse.json({ message: "Erro ao salvar formulário." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}
