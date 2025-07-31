import { NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function GET() {
  const db = getDBConnection(dbConfig());
  try {
    // total
    const inscritos = await db("Candidato").select(
      "CodIns",
      "Nome",
      "Seletivo",
      "CPF",
      "Sexo",
      "Email",
      "Cidade",
      "Status",
      "GRUStatus",
      "ramoForca"
    );

    // pagamentos e pendentes por seletivo
    const sel6 = await db("Candidato")
      .select("Nome", "GruRef", "GruValor", "GruData", "RegistroGru")
      .where({ Seletivo: "6° ano", GRUStatus: "CONCLUIDO" });

    const pend6 = await db("Candidato")
      .select("Nome", "GruRef", "GruValor", "GruData", "RegistroGru")
      .where("Seletivo", "6° ano")
      .andWhere((qb) => {
        qb.whereNot("GRUStatus", "CONCLUIDO").orWhereNull("GRUStatus");
      })
      .andWhere((qb) => {
        qb.whereNot("isencao", "Deferido").orWhereNull("isencao");
      });

    const sel1 = await db("Candidato")
      .select("Nome", "GruRef", "GruValor", "GruData", "RegistroGru")
      .where({ Seletivo: "1° ano", GRUStatus: "CONCLUIDO" });

    const pend1 = await db("Candidato")
      .select("Nome", "GruRef", "GruValor", "GruData", "RegistroGru")
      .where("Seletivo", "1° ano")
      .andWhere((qb) => {
        qb.whereNot("GRUStatus", "CONCLUIDO").orWhereNull("GRUStatus");
      })
      .andWhere((qb) => {
        qb.whereNot("isencao", "Deferido").orWhereNull("isencao");
      });

    const isentos6 = await db("Candidato").where({
      Seletivo: "6° ano",
      isencao: "Deferido",
    });

    const isentos1 = await db("Candidato")
      .where({ Seletivo: "1° ano" })
      .andWhere({ isencao: "Deferido" });

    // resultados de exame
    const exames = await db("Candidato")
      .select("Seletivo")
      .select(
        db.raw(
          "SUM(case when Status = 'Aprovado' then 1 else 0 end) as aprovados"
        ),
        db.raw(
          "SUM(case when Status = 'Reprovado' then 1 else 0 end) as reprovados"
        ),
        db.raw(
          "SUM(case when Status = 'Ausente' then 1 else 0 end) as ausentes"
        )
      )
      .groupBy("Seletivo");

    // agrupamento por forca e sexo
    const barrasForcaSexoRaw = await db("Candidato")
      .select(db.raw("COALESCE(NULLIF(ramoForca, ''), 'civil') as name"))
      .select(
        db.raw("SUM(case when Sexo = 'M' then 1 else 0 end) as Masculino"),
        db.raw("SUM(case when Sexo = 'F' then 1 else 0 end) as Feminino")
      )
      .groupByRaw("COALESCE(NULLIF(ramoForca, ''), 'civil')");

    // distribuição geral (pie)
    const pieDataRaw = await db("Candidato")
      .select(db.raw("COALESCE(NULLIF(ramoForca, ''), 'civil') as name"))
      .count({ value: "*" })
      .groupByRaw("COALESCE(NULLIF(ramoForca, ''), 'civil')");

    return NextResponse.json({
      total: inscritos,
      pagamentos: {
        "6": {
          pagos: sel6,
          pendentes: pend6,
          isentos: Number(isentos6?.length),
        },
        "1": {
          pagos: sel1,
          pendentes: pend1,
          isentos: Number(isentos1?.length),
        },
      },
      exames,
      barrasForcaSexo: barrasForcaSexoRaw,
      pieData: pieDataRaw,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  } finally {
    await db.destroy();
  }
}
