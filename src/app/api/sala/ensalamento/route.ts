import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import moment from "moment-timezone";

export async function GET(request: NextRequest) {
  let db: any;
  try {
    db = getDBConnection(dbConfig());

    // Buscar todas as salas ativas
    const salas = await db("Sala")
      .select("CodSala", "Sala")
      .where("Status", "Ativo");

    // Para cada sala, buscar todos os participantes alocados (com todos os campos)
    const resultado = await Promise.all(
      salas.map(async (sala: any) => {
        const participantes = await db("Candidato")
          .select("*")
          .where("CodSala", sala.CodSala);

        return {
          cod: sala.CodSala,
          sala: sala.Sala,
          participantes // ← contém objetos completos da tabela Candidato
        };
      })
    );

    return NextResponse.json(resultado, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar ensalamento:", error);
    return NextResponse.json({ success: false, message: "Erro ao buscar ensalamento" }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}

export async function POST(request: NextRequest) {
  let db;
  try {
    db = getDBConnection(dbConfig());
    // Iniciar transação
    await db.transaction(async (trx) => {
      // Buscar candidatos sem sala, ordenados por inscrições mais antigas
      const candidatos = await trx('Candidato')
        .select('CodIns', 'PortadorNec')
        .whereNull('CodSala')
        .orderBy('CodIns', 'asc');

      // Buscar salas ativas com reserva para PNE
      const salas = await trx('Sala')
        .select('CodSala', 'QtdCadeiras', 'QtdPortNec', 'PortadorNec')
        .where('Status', 'Ativo');

      // Função auxiliar para atribuir na primeira sala com vaga
      async function atribuirSala(codIns: number, isPortador: boolean, salasList: any) {
        for (const sala of salasList) {
          // Contar ocupação total
          const [{ count: totalCount }] = await trx('Candidato')
            .count('CodIns as count')
            .where('CodSala', sala.CodSala);
          const [{ count: specialCount }] = await trx('Candidato')
            .count('CodIns as count')
            .where('CodSala', sala.CodSala)
            .andWhere('PortadorNec', 'X');
          const total = Number(totalCount);
          const pneCount = Number(specialCount);
          const capacity = sala.QtdCadeiras;
          const reserved = sala.QtdPortNec || 0;

          if (isPortador) {
            // Atribuir a vaga reservada para PNE
            if (pneCount < reserved) {
              await trx('Candidato')
                .where('CodIns', codIns)
                .update({
                  CodSala: sala.CodSala,
                  DataEnsalamento: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
                  HoraEnsalamento: moment().tz('America/Sao_Paulo').format('HH:mm'),
                });
              return true;
            }
          } else {
            // Candidatocomum: pode usar vagas não reservadas
            const normais = total - pneCount;
            const freeForNormal = capacity - reserved;
            if (normais < freeForNormal) {
              // Dentro da cota de vagas comuns
              await trx('Candidato')
                .where('CodIns', codIns)
                .update({
                  CodSala: sala.CodSala,
                  DataEnsalamento: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
                  HoraEnsalamento: moment().tz('America/Sao_Paulo').format('HH:mm'),
                });
              return true;
            }
            // Se todas vagas reservadas estão preenchidas e ainda há capacidade geral
            if (pneCount >= reserved && total < capacity) {
              await trx('Candidato')
                .where('CodIns', codIns)
                .update({
                  CodSala: sala.CodSala,
                  DataEnsalamento: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
                  HoraEnsalamento: moment().tz('America/Sao_Paulo').format('HH:mm'),
                });
              return true;
            }
          }
        }
        return false;
      }

      // Atribuir cada candidato
      for (const candidato of candidatos) {
        await atribuirSala(candidato.CodIns, candidato.PortadorNec === 'X', salas);
      }
    });

    return NextResponse.json(
      { success: true, message: 'Ensalamento gerado com sucesso.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao gerar ensalamento:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao gerar ensalamento' },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}
