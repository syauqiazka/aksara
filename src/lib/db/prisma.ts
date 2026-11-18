import "server-only";

import { PrismaClient } from "@prisma/client";

function getFormattedDatabaseUrl(): string | undefined {
  const url =
    process.env.DATABASE_URL_ACCOUNT ||
    process.env.DIRECT_URL_ACCOUNT ||
    process.env.DATABASE_URL;

  if (!url || url.includes("<db_user>") || url.includes("<db_pass>")) {
    return undefined;
  }

  // Ensure connection limit and timeouts for Hostinger MySQL shared hosting
  if (url.startsWith("mysql://") || url.startsWith("mariadb://")) {
    if (!url.includes("connection_limit=")) {
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}connection_limit=10&connect_timeout=10`;
    }
  }

  return url;
}

const formattedUrl = getFormattedDatabaseUrl();

export const isPrismaConfigured = Boolean(
  formattedUrl &&
  (formattedUrl.startsWith("mysql://") || formattedUrl.startsWith("mariadb://"))
);

// Synchronize process.env.DATABASE_URL for Prisma engine
if (typeof process !== "undefined" && formattedUrl && process.env.DATABASE_URL !== formattedUrl) {
  process.env.DATABASE_URL = formattedUrl;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null | undefined };

export const prisma: PrismaClient | null =
  globalForPrisma.prisma ??
  (isPrismaConfigured && formattedUrl
    ? new PrismaClient({
        datasources: {
          db: {
            url: formattedUrl,
          },
        },
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      })
    : null);

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

export function requirePrisma(): PrismaClient {
  if (!prisma) {
    throw new Error(
      "Koneksi database Hostinger MySQL (Prisma) belum aktif atau DATABASE_URL belum dikonfigurasi dengan benar di environment server."
    );
  }
  return prisma;
}
