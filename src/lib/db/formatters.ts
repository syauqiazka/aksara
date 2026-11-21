/**
 * Utility formatters and parsers for transforming Prisma MySQL data models
 * into application interface types.
 */

export function toStringArray(val: unknown): string[] {
  if (!val) return [];
  let list: string[] = [];
  if (Array.isArray(val)) {
    list = val.map((x) => String(x)).filter(Boolean);
  } else if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        list = parsed.map((x) => String(x)).filter(Boolean);
      }
    } catch {
      // Handle PostgreSQL array syntax if encountered: {"url1","url2"}
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        list = trimmed
          .slice(1, -1)
          .split(",")
          .map((s) => s.replace(/^"|"$/g, "").trim())
          .filter(Boolean);
      } else {
        list = [trimmed];
      }
    }
  }
  return list.filter((item) => !item.includes("placeholder.internal"));
}

export function sanitizeImageUrl(url: unknown): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed.includes("placeholder.internal")) return null;
  return trimmed;
}

export function sanitizeImageUrls(urls: unknown): string[] {
  return toStringArray(urls).filter(
    (u) => Boolean(u) && !u.includes("placeholder.internal")
  );
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
