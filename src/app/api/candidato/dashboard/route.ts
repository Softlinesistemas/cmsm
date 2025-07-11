import { NextResponse } from 'next/server'
import getDBConnection from '@/db/conn'
import dbConfig from '@/db/dbConfig'

export async function GET() {
  const db = getDBConnection(dbConfig())
  try {
    // total
    const inscritos = await db('Candidato').select("CodIns", "Nome", "Seletivo", "CPF", "Sexo", "Email", "Cidade", "Status", "GRUStatus", "ramoForca")

    // pagamentos e pendentes por seletivo
    const sel6 = await db('Candidato')
      .count({ pagos: '*' })
      .where({ Seletivo: '6° ano', GRUStatus: 'CONCLUIDO' })
      .first()

      const pend6 = await db('Candidato')
      .count({ pendentes: '*' })
      .where({ Seletivo: '6° ano' })
      .whereNot({ GRUStatus: 'CONCLUIDO' })
      .first()

    const sel1 = await db('Candidato')
      .count({ pagos: '*' })
      .where({ Seletivo: '1° ano', GRUStatus: 'CONCLUIDO' })
      .first()
    const pend1 = await db('Candidato')
      .count({ pendentes: '*' })
      .where({ Seletivo: '1° ano' })
      .whereNot({ GRUStatus: 'CONCLUIDO' })
      .first()

    // resultados de exame
    const exames = await db('Candidato')
      .select('Seletivo')
      .select(
        db.raw("SUM(case when Status = 'Aprovado' then 1 else 0 end) as aprovados"),
        db.raw("SUM(case when Status = 'Reprovado' then 1 else 0 end) as reprovados"),
        db.raw("SUM(case when Status = 'Ausente' then 1 else 0 end) as ausentes")
      )
      .groupBy('Seletivo')

    // agrupamento por forca e sexo
    const barrasForcaSexoRaw = await db('Candidato')
      .select(db.raw("COALESCE(NULLIF(ramoForca, ''), 'civil') as name"))
      .select(
        db.raw("SUM(case when Sexo = 'M' then 1 else 0 end) as Masculino"),
        db.raw("SUM(case when Sexo = 'F' then 1 else 0 end) as Feminino")
      )
      .groupByRaw("COALESCE(NULLIF(ramoForca, ''), 'civil')")


    // distribuição geral (pie)
    const pieDataRaw = await db('Candidato')
      .select(db.raw("COALESCE(NULLIF(ramoForca, ''), 'civil') as name"))
      .count({ value: '*' })
      .groupByRaw("COALESCE(NULLIF(ramoForca, ''), 'civil')")

    return NextResponse.json({
      total: inscritos,
      pagamentos: {
        '6': { pagos: Number(sel6?.pagos || 0), pendentes: Number(pend6?.pendentes || 0) },
        '1': { pagos: Number(sel1?.pagos || 0), pendentes: Number(pend1?.pendentes || 0) }
      },
      exames,
      barrasForcaSexo: barrasForcaSexoRaw,
      pieData: pieDataRaw
    })
  } catch (e) {
    console.error(e)
    return NextResponse.error()
  } finally {
    await db.destroy()
  }
}