import { test, expect } from "@playwright/test";
import { getSuggestedJuz, validateAyatNumber } from "@/lib/quran-surahs";
import { cleanNumericString, parseNumericInput } from "@/lib/numeric-utils";

test.describe("Butir 1: Titik Batas Juz Al-Qur'an & Input Angka", () => {
  test("1:1 → Juz 1", () => {
    expect(getSuggestedJuz(1, 1)).toBe(1);
    expect(getSuggestedJuz("1", "1")).toBe(1);
  });

  test("2:141 → Juz 1", () => {
    expect(getSuggestedJuz(2, 141)).toBe(1);
  });

  test("2:142 → Juz 2", () => {
    expect(getSuggestedJuz(2, 142)).toBe(2);
  });

  test("2:253 → Juz 3", () => {
    expect(getSuggestedJuz(2, 253)).toBe(3);
  });

  test("78:1 → Juz 30", () => {
    expect(getSuggestedJuz(78, 1)).toBe(30);
  });

  test("114:6 → Juz 30", () => {
    expect(getSuggestedJuz(114, 6)).toBe(30);
  });

  test("1:10 → ditolak karena Al-Fatihah hanya 7 ayat", () => {
    const res = validateAyatNumber(1, 10);
    expect(res.valid).toBe(false);
    expect(res.message).toContain("Al-Fatihah hanya memiliki 7 ayat");
  });

  test("cleanNumericString membersihkan nol di depan dan mengizinkan kosong", () => {
    expect(cleanNumericString("010")).toBe("10");
    expect(cleanNumericString("05")).toBe("5");
    expect(cleanNumericString("0")).toBe("");
    expect(cleanNumericString("0", true)).toBe("0");
    expect(cleanNumericString("")).toBe("");
    expect(cleanNumericString("abc")).toBe("");
    expect(cleanNumericString("12a3")).toBe("123");
    expect(parseNumericInput("012")).toBe(12);
    expect(parseNumericInput("")).toBe(null);
  });
});

