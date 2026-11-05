/**
 * Helper format tanggal resmi standar Indonesia (DD MMMM YYYY)
 * Contoh: "2026-10-30" -> "30 Oktober 2026"
 */
export function formatTanggal(dateString?: string | null): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

