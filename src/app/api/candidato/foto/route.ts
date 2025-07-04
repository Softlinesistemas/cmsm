// app/api/foto-candidato/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session?.user?.access_token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const accessToken = session?.user?.access_token;

  const res = await fetch("https://sso.staging.acesso.gov.br/userinfo/picture", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Erro ao buscar imagem" }, { status: res.status });
  }

  const contentType = res.headers.get("content-type") || "image/jpeg";
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
