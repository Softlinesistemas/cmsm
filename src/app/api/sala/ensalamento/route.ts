import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";
import moment from "moment-timezone";

export async function GET(request: NextRequest) {
  let db: any;
  try {
    db = getDBConnection(dbConfig());
    // Buscar todas as salas ativas
    const salas = await db("Sala").select("CodSala", "Sala").where("Status", "Ativo");

    // Para cada sala, buscar nomes dos participantes alocados
    const resultado = await Promise.all(
      salas.map(async (sala: any) => {
        const registros = await db("Candidato").select("Nome").where("CodSala", sala.CodSala);
        const participantes = registros.map((r: any) => r.Nome);
        return {
          cod: sala.CodSala,
          sala: sala.Sala,
          participantes
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
      // Passo 1: Buscar todos os candidatos sem sala, ordenados por inscrições mais antigas
     const candidatos = await trx("Candidato")
        .select("CodIns", "PortadorNec")
        .whereNull("CodSala")
        .orderBy("CodIns", "asc");

      // Passo 2: Buscar salas ativas com e sem necessidade especial
      const salasEspeciais = await trx("Sala")
        .select("CodSala", "QtdCadeiras", "PortadorNec")
        .where("PortadorNec", "X")
        .andWhere("Status", "Ativo");

      const salasComuns = await trx("Sala")
        .select("CodSala", "QtdCadeiras")
        .whereNull("PortadorNec")
        .andWhere("Status", "Ativo");
          console.log(candidatos, salasComuns)

      // Função auxiliar para atribuir na primeira sala com vaga
      const atribuirSala = async (codIns: number, salasList: any) => {
        for (const sala of salasList) {
          // Contar ocupação atual
          const [{ count }] = await trx("Candidato")
            .count("CodIns as count")
            .where("CodSala", sala.CodSala);

          if (Number(count) < sala.QtdCadeiras) {
            // Atualiza CodSala e registra timestamp de ensalamento
            await trx("Candidato")
              .where("CodIns", codIns)
              .update({
                CodSala: sala.CodSala,
                DataEnsalamento: moment().tz("America/Sao_Paulo").format("YYYY-MM-DD"),
                HoraEnsalamento: moment().tz("America/Sao_Paulo").format("HH:mm"),           
              });
            return true;
          }
        }
        return false;
      };

      // Passo 3: Para cada candidato, verificar e atribuir
      for (const candidato of candidatos) {
        if (candidato.PortadorNec === 'X') {
          // Priorizar salas especiais
          await atribuirSala(candidato.CodIns, salasEspeciais);
        } else {
          // Atribuir em salas comuns
          await atribuirSala(candidato.CodIns, salasComuns);
        }
      }
    });

    return NextResponse.json(
      { success: true, message: "Ensalamento gerado com sucesso." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao gerar ensalamento:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao gerar ensalamento" },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}
