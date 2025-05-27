import { PrismaClient } from '@prisma/client';

// Cria apenas um cliente Prisma durante toda a execução do app
declare global {
  var prisma: PrismaClient | undefined;
}

// Instancia o PrismaClient apenas uma vez para evitar problemas em dev (Next.js faz hot reload!)
const prisma = globalThis.prisma || new PrismaClient();

// Se estiver em dev, salva a instância global
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export default prisma;
