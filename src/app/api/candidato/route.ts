import { NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import moment from "moment-timezone";
import { z, ZodError } from "zod";

const candidatoSchema = z.object({
  CodIns: z.number().int().optional(),
  CodUsu: z.number().int().optional(),
  Nome: z.string().min(3, "O nome deve ter ao menos 3 caracteres."),
  CPF: z.string()
    .regex(/^\d{3}\.?\d{3}\.?\d{3}\-?\d{2}$/, "CPF inválido."),
  Nasc: z.string()
    .refine(s => !isNaN(Date.parse(s)), { message: "Data de nascimento inválida." })
    .transform(s => new Date(s))
    .refine(d => d <= new Date(), { message: "Data de nascimento não pode ser no futuro." }),
  Sexo: z.enum(["masculino", "feminino"]),
  Email: z.string().email("Formato de e-mail inválido.").optional(),
  Cep: z.string()
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido.")
    .optional(),
  Endereco: z.string().max(60).optional(),
  Complemento: z.string().max(30).optional(),
  Bairro: z.string().max(30).optional(),
  Cidade: z.string().max(30).optional(),
  UF: z.string().length(2, "UF deve ter 2 caracteres.").optional(),
  CodCot1: z.number().int().optional(),
  CodCot2: z.number().int().optional(),
  CodCot3: z.number().int().optional(),
  CodCot4: z.number().int().optional(),
  CodCot5: z.number().int().optional(),
  CodCot6: z.number().int().optional(),
  CodCot7: z.number().int().optional(),
  CodCot8: z.number().int().optional(),
  CodCot9: z.number().int().optional(),
  CodCot10: z.number().int().optional(),
  PortadorNec: z.boolean().optional(),
  AtendimentoEsp: z.boolean().optional(),
  Responsavel: z.string().max(100).optional(),
  CPFResp: z.string()
    .transform(s => s ? s.replace(/\D/g, "") : s)
    .refine(s => !s || /^\d{11}$/.test(s), { message: "CPF do responsável inválido." })
    .optional(),
  NascResp: z.string()
    .refine(s => !s || !isNaN(Date.parse(s)), { message: "Data de nascimento do responsável inválida." })
    .transform(s => s ? new Date(s) : s)
    .optional(),
  SexoResp: z.enum(["masculino", "feminino"]).optional(),
  CepResp: z.string()
    .regex(/^\d{5}-?\d{3}$/, "CEP do responsável inválido.")
    .optional(),
  EnderecoResp: z.string().max(60).optional(),
  ComplementoResp: z.string().max(30).optional(),
  BairroResp: z.string().max(30).optional(),
  CidadeResp: z.string().max(30).optional(),
  UFResp: z.string().length(2).optional(),
  ProfissaoResp: z.string().max(100).optional(),
  EmailResp: z.string().email("Formato de e-mail inválido.").optional(),
  TelResp: z.string()
    .transform(s => s ? s.replace(/\D/g, "") : s)
    .optional(),
  Parentesco: z.string().max(20).optional(),
  PertenceFA: z.string().max(20).optional(),
  CaminhoFoto: z.string().optional(),
  CaminhoDoc1: z.string().optional(),
  CaminhoDoc2: z.string().optional(),
  RegistroGRU: z.string().optional(),
  GRUData: z.string()
    .transform(s => s ? new Date(s) : s)
    .optional(),
  GRUValor: z.number().optional(),
  GRUHora: z.string().optional(),
  CodSala: z.number().int().optional(),
  DataEnsalamento: z.string()
    .transform(s => s ? new Date(s) : s)
    .optional(),
  HoraEnsalamento: z.string().optional(),
  CodUsuEnsalamento: z.number().int().optional(),
  Status: z.string().max(20).optional(),
  CaminhoResposta: z.string().optional(),
  CaminhoRedacao: z.string().optional(),
  RevisaoGabarito: z.boolean().optional(),
  DataImportacao: z.string()
    .transform(s => s ? new Date(s) : s)
    .optional(),
  HoraImportacao: z.string().optional(),
  CodUsuImportacao: z.number().int().optional(),
  NotaMatematica: z.number().optional(),
  NotaPortugues: z.number().optional(),
  NotaRedacao: z.string().optional(),
  DataRevisao: z.string()
    .transform(s => s ? new Date(s) : s)
    .optional(),
  CodUsuRev: z.number().int().optional(),
  Seletivo: z.string().max(10, "Seletivo inválido.").optional(),
  isencao: z.string().max(12).optional(),
  observacao: z.string().max(255).optional(),
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
        return NextResponse.json(
          { errors: err.errors.map(e => ({ field: e.path.join("."), message: e.message })) },
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
