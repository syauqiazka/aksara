import "server-only";

import { PrismaClient } from "@prisma/client";

const rawUrl =
  process.env.DATABASE_URL_ACCOUNT ||
  process.env.DIRECT_URL_ACCOUNT ||
  process.env.DATABASE_URL;

export const isPrismaConfigured = Boolean(
  rawUrl &&
  !rawUrl.includes("<db_user>") &&
  !rawUrl.includes("<db_pass>") &&
  (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://"))
);

// Pastikan DATABASE_URL diisi jika ada DATABASE_URL_ACCOUNT untuk CLI Prisma / migrasi
if (typeof process !== "undefined" && rawUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = rawUrl;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null | undefined };

export const prisma: PrismaClient | null =
  globalForPrisma.prisma ??
  (isPrismaConfigured && rawUrl
    ? new PrismaClient({
        datasources: {
          db: {
            url: rawUrl,
          },
        },
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      })
    : null);

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}
