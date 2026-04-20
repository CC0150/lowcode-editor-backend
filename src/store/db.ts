import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("环境变量 DATABASE_URL 未配置");
}

export const prisma = new PrismaClient({
  datasourceUrl: databaseUrl,
  log: ['query', 'info', 'warn', 'error'],
});