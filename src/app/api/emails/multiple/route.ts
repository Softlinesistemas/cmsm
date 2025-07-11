import { NextResponse } from 'next/server';
import transporter from '@/services/nodeMailer';
import getDBConnection from "@/db/conn";
import dbConfig from "@/db/dbConfig";

export async function POST(request: Request) {
  let db;
  try {
    db = getDBConnection(dbConfig());

    const { subject, message } = await request.json();


    if (!subject || !message) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }
    const recipients = await db("Candidato").select("Email");

    const sendAll = recipients.map(({ Email }) =>
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: Email,
        subject,
        html: `<p>${message}</p>`,
      })
    );

    await Promise.all(sendAll);

    return NextResponse.json({ message: 'E-mails enviados com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mails:', error);
    return NextResponse.json({ error: 'Erro interno ao enviar e-mails' }, { status: 500 });
  }
}
