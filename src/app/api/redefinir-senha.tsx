import { NextApiRequest, NextApiResponse } from 'next';
import prisma  from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import dbConfig from '@/db/dbConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token, senha } = req.body;

  if (!token || !senha) {
    return res.status(400).json({ message: 'Token e nova senha são obrigatórios' });
  }

  // Busca o token no banco
  const tokenRecuperacao = await prisma.tokenRecuperacao.findUnique({
    where: { token },
  });

  if (!tokenRecuperacao || new Date() > tokenRecuperacao.expiracao) {
    return res.status(400).json({ message: 'Token inválido ou expirado' });
  }

  // Atualiza a senha do usuário
  const senhaHash = await bcrypt.hash(senha, 10);

  await prisma.usuario.update({
    where: { id: tokenRecuperacao.usuarioId },
    data: { senha: senhaHash },
  });

  // Exclui o token usado
  await prisma.tokenRecuperacao.delete({
    where: { token },
  });

  res.status(200).json({ message: 'Senha redefinida com sucesso!' });
}
