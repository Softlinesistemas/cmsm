import { NextResponse } from 'next/server';
import transporter from '@/services/nodeMailer';

export async function POST(request: Request) {
  try {
    const { subject, message, recipients } = await request.json();

    if (!subject || !message || !recipients || !Array.isArray(recipients)) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    // Enviar e-mails em paralelo
    const sendAll = recipients.map((to) =>
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
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
