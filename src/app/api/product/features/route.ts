import getDBConnection from "@/db/conn"; 
import dbConfig from "@/db/dbConfig"; 
import { NextRequest, NextResponse } from "next/server"; 
import { getToken } from "next-auth/jwt"; 

export async function GET(request: NextRequest) { 
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }); 
  if (!token) { 
    return NextResponse.json({ message: "Access denied." }, { status: 401 }); 
  }

  let db = null; 
  try { 

    db = getDBConnection(dbConfig(String(token.email)));

    const features = await db("Cor").select("Cor", "Chave", "Componente", "CodCor");      

    return NextResponse.json({ features }, { status: 200 });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    if (db) await db.destroy();
  }
}
