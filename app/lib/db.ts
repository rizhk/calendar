import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

if (global.prisma === undefined) {
  global.prisma = new PrismaClient();
}

export const prismaClient = global.prisma;
