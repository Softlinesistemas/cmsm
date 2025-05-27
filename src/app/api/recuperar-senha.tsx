import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { enviarEmailRecuperacao } from '@/lib/email'; 
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { cpfEmail } = req.body;

  if (!cpfEmail) {
    return res.status(400).json({ message: 'Informe o CPF ou email' });
  }

  // Busca usuário (exemplo usando Prisma)
  const usuario = await prisma.usuario.findFirst({
    where: {
      OR: [
        { email: cpfEmail },
        { cpf: cpfEmail },
      ],
    },
  });

  if (!usuario) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  // Cria token único
  const token = crypto.randomBytes(32).toString('hex');
  const expiracao = new Date(Date.now() + 60 * 60 * 1000); // 1h

  // Salva no banco (ex: tabela "TokenRecuperacao")
  await prisma.tokenRecuperacao.create({
    data: {
      usuarioId: usuario.id,
      token,
      expiracao,
    },
  });

  // Envia email
  const link = `https://${req.headers.host}/adm/RedefinirSenha?token=${token}`;
  await enviarEmailRecuperacao(usuario.email, link);

  res.status(200).json({ message: 'Instruções enviadas!' });
}
