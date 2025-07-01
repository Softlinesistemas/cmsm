import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/db/dbConfig";
import getDBConnection from "@/db/conn";

function getIdFromRequest(request: NextRequest): string | null {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  return parts[parts.length - 1] || null;
}

export async function PUT(request: NextRequest) {
  let db;
  try {
    const CodIns = getIdFromRequest(request);
    if (!CodIns) {
        return NextResponse.json({ success: false, message: "ID inválido." }, { status: 400 });
    }
    const body = await request.json();
    const {
      observacao,
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
    } = body;

    if (!CodIns) {
      return NextResponse.json(
        { error: "O campo CodIns é obrigatório para atualização." },
        { status: 400 }
      );
    }

    db = getDBConnection(dbConfig());

    const existing = await db("Candidato").where({ CodIns }).first();

    if (!existing) {
      return NextResponse.json(
        { error: "Candidato não encontrado para o CodIns informado." },
        { status: 404 }
      );
    }

    const cpfFormatado = CPF?.replace(/\D/g, "");
    if (cpfFormatado) {
      const cpfExistente = await db("Candidato")
        .where("CPF", cpfFormatado)
        .andWhereNot("CodIns", CodIns)
        .first();

      if (cpfExistente) {
        return NextResponse.json(
          { error: "Já existe outro candidato com esse CPF." },
          { status: 400 }
        );
      }
    }

    await db("Candidato")
      .where({ CodIns })
      .update({
        observacao,
        Nome,
        CPF: cpfFormatado,
        Nasc,
        Sexo: Sexo === "masculino" ? "M" : "F",
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
        CPFResp: CPFResp?.replace(/\D/g, ""),
        NascResp,
        isencao,
        SexoResp: SexoResp === "masculino" ? "M" : "F",
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
        Seletivo
      });

    return NextResponse.json({ message: "Candidato atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar candidato:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar candidato." },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}
