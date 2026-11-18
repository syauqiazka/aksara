/**
 * Utility formatters and parsers for transforming Prisma MySQL data models
 * into application interface types.
 */

export function toStringArray(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map((x) => String(x)).filter(Boolean);
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((x) => String(x)).filter(Boolean);
      }
    } catch {
      // Handle PostgreSQL array syntax if encountered: {"url1","url2"}
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        return trimmed
          .slice(1, -1)
          .split(",")
          .map((s) => s.replace(/^"|"$/g, "").trim())
          .filter(Boolean);
      }
      return [trimmed];
    }
  }
  return [];
}

export function parseDateString(val: Date | string | null | undefined): string {
  if (!val) return "";
  if (val instanceof Date) {
    return val.toISOString().split("T")[0];
  }
  if (typeof val === "string") {
    return val.includes("T") ? val.split("T")[0] : val;
  }
  return String(val);
}

export function parseDateTimeString(val: Date | string | null | undefined): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Date) {
    return val.toISOString();
  }
  return String(val);
}

export function toNumberOrNull(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  const num = Number(val);
  return Number.isNaN(num) ? null : num;
}

export function toNumber(val: unknown, fallback = 0): number {
  if (val === null || val === undefined) return fallback;
  const num = Number(val);
  return Number.isNaN(num) ? fallback : num;
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
