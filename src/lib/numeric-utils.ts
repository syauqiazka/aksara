/**
 * Helper untuk normalisasi dan pembersihan input angka (Butir 1).
 *
 * Aturan:
 * 1. Simpan state sebagai string selama mengetik.
 * 2. Buang karakter non-angka dan nol di depan ("010" -> "10", "05" -> "5").
 * 3. Kolom boleh KOSONG selama mengetik (tidak boleh dipaksa jadi "0").
 * 4. Bila allowZero = true, angka "0" tunggal diizinkan.
 * 5. Nilai akhir saat submit / konversi: number | null.
 */

export function cleanNumericString(raw: string, allowZero = false): string {
  if (typeof raw !== "string") {
    raw = String(raw ?? "");
  }

  // Buang semua karakter non-angka
  const digitsOnly = raw.replace(/\D/g, "");
  if (!digitsOnly) return "";

  if (digitsOnly === "0") {
    return allowZero ? "0" : "";
  }

  // Buang angka 0 di depan (misal "010" -> "10", "007" -> "7")
  const stripped = digitsOnly.replace(/^0+/, "");
  return stripped || (allowZero ? "0" : "");
}

export function parseNumericInput(val: string): number | null {
  const cleaned = cleanNumericString(val, true);
  if (!cleaned) return null;
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

