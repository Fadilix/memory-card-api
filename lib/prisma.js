const { PrismaClient } = require('@prisma/client');

const prismaClientSingleton = () => {
  return new PrismaClient();
}

const prisma = (global.prismaGlobal = global.prismaGlobal || prismaClientSingleton());

module.exports = prisma;

if (process.env.NODE_ENV !== 'production') global.prismaGlobal = prisma;