import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

// Helper para extrair o ID da URL
function getIdFromRequest(request: NextRequest): string | null {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  return parts[parts.length - 1] || null;
}

export async function GET(request: NextRequest) {
  let db;
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return NextResponse.json({ success: false, message: "ID inválido." }, { status: 400 });
    }

    db = getDBConnection(dbConfig());

    const sala = await db("Sala")
      .select(
        "CodSala",
        "Sala",
        "QtdCadeiras",
        "Predio",
        "Andar",
        "Status",
        "PortadorNec"
      )
      .where({ CodSala: Number(id) })
      .first();

    if (!sala) {
      return NextResponse.json(
        { success: false, message: "Sala não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, sala });
  } catch (error) {
    console.error("Erro ao buscar sala:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar sala" },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}

export async function PUT(request: NextRequest) {
  let db;
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return NextResponse.json({ success: false, message: "ID inválido." }, { status: 400 });
    }

    const body = await request.json();
    db = getDBConnection(dbConfig());

    const updated = await db("Sala")
      .where({ CodSala: Number(id) })
      .update({ ...body });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Sala não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Sala atualizada com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar sala:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao atualizar sala." },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}

export async function DELETE(request: NextRequest) {
  let db;
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return NextResponse.json({ success: false, message: "ID inválido." }, { status: 400 });
    }

    db = getDBConnection(dbConfig());

    const deleted = await db("Sala")
      .where({ CodSala: Number(id) })
      .del();

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Sala não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Sala excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir sala:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao excluir sala." },
      { status: 500 }
    );
  } finally {
    if (db) await db.destroy();
  }
}
