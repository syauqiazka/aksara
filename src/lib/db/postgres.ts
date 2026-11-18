import "server-only";

/**
 * @deprecated
 * Aksara has migrated completely to Hostinger MySQL via Prisma ORM.
 * Direct PostgreSQL connection pool and pgQuery have been retired.
 */
export const isPostgresConfigured = false;

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export async function pgQuery(): Promise<never> {
  throw new Error("pgQuery sudah dinonaktifkan. Aksara sekarang menggunakan Prisma MySQL secara penuh.");
}

export async function initPostgresSchema(): Promise<void> {
  // No-op
}
