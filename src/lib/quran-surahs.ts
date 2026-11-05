export interface QuranSurah {
  number: number;
  nameLatin: string;
  nameArabic: string;
  totalAyat: number;
}

export const QURAN_SURAHS: QuranSurah[] = [
  { number: 1, nameLatin: "Al-Fatihah", nameArabic: "الفاتحة", totalAyat: 7 },
  { number: 2, nameLatin: "Al-Baqarah", nameArabic: "البقرة", totalAyat: 286 },
  { number: 3, nameLatin: "Ali 'Imran", nameArabic: "آل عمران", totalAyat: 200 },
  { number: 4, nameLatin: "An-Nisa'", nameArabic: "النساء", totalAyat: 176 },
  { number: 5, nameLatin: "Al-Ma'idah", nameArabic: "المائدة", totalAyat: 120 },
  { number: 6, nameLatin: "Al-An'am", nameArabic: "الأنعام", totalAyat: 165 },
  { number: 7, nameLatin: "Al-A'raf", nameArabic: "الأعراف", totalAyat: 206 },
  { number: 8, nameLatin: "Al-Anfal", nameArabic: "الأنفال", totalAyat: 75 },
  { number: 9, nameLatin: "At-Taubah", nameArabic: "التوبة", totalAyat: 129 },
  { number: 10, nameLatin: "Yunus", nameArabic: "يونس", totalAyat: 109 },
  { number: 11, nameLatin: "Hud", nameArabic: "هود", totalAyat: 123 },
  { number: 12, nameLatin: "Yusuf", nameArabic: "يوسف", totalAyat: 111 },
  { number: 13, nameLatin: "Ar-Ra'd", nameArabic: "الرعد", totalAyat: 43 },
  { number: 14, nameLatin: "Ibrahim", nameArabic: "إبراهيم", totalAyat: 52 },
  { number: 15, nameLatin: "Al-Hijr", nameArabic: "الحجر", totalAyat: 99 },
  { number: 16, nameLatin: "An-Nahl", nameArabic: "النحل", totalAyat: 128 },
  { number: 17, nameLatin: "Al-Isra'", nameArabic: "الإسراء", totalAyat: 111 },
  { number: 18, nameLatin: "Al-Kahf", nameArabic: "الكهف", totalAyat: 110 },
  { number: 19, nameLatin: "Maryam", nameArabic: "مريم", totalAyat: 98 },
  { number: 20, nameLatin: "Taha", nameArabic: "طه", totalAyat: 135 },
  { number: 21, nameLatin: "Al-Anbiya'", nameArabic: "الأنبياء", totalAyat: 112 },
  { number: 22, nameLatin: "Al-Hajj", nameArabic: "الحج", totalAyat: 78 },
  { number: 23, nameLatin: "Al-Mu'minun", nameArabic: "المؤمنون", totalAyat: 118 },
  { number: 24, nameLatin: "An-Nur", nameArabic: "النور", totalAyat: 64 },
  { number: 25, nameLatin: "Al-Furqan", nameArabic: "الفرقان", totalAyat: 77 },
  { number: 26, nameLatin: "Asy-Syu'ara'", nameArabic: "الشعراء", totalAyat: 227 },
  { number: 27, nameLatin: "An-Naml", nameArabic: "النمل", totalAyat: 93 },
  { number: 28, nameLatin: "Al-Qasas", nameArabic: "القصص", totalAyat: 88 },
  { number: 29, nameLatin: "Al-'Ankabut", nameArabic: "العنكبوت", totalAyat: 69 },
  { number: 30, nameLatin: "Ar-Rum", nameArabic: "الروم", totalAyat: 60 },
  { number: 31, nameLatin: "Luqman", nameArabic: "لقمان", totalAyat: 34 },
  { number: 32, nameLatin: "As-Sajdah", nameArabic: "السجدة", totalAyat: 30 },
  { number: 33, nameLatin: "Al-Ahzab", nameArabic: "الأحزاب", totalAyat: 73 },
  { number: 34, nameLatin: "Saba'", nameArabic: "سبأ", totalAyat: 54 },
  { number: 35, nameLatin: "Fatir", nameArabic: "فاطر", totalAyat: 45 },
  { number: 36, nameLatin: "Ya-Sin", nameArabic: "يس", totalAyat: 83 },
  { number: 37, nameLatin: "As-Saffat", nameArabic: "الصافات", totalAyat: 182 },
  { number: 38, nameLatin: "Sad", nameArabic: "ص", totalAyat: 88 },
  { number: 39, nameLatin: "Az-Zumar", nameArabic: "الزمر", totalAyat: 75 },
  { number: 40, nameLatin: "Ghafir", nameArabic: "غافر", totalAyat: 85 },
  { number: 41, nameLatin: "Fussilat", nameArabic: "فصلت", totalAyat: 54 },
  { number: 42, nameLatin: "Asy-Syura", nameArabic: "الشورى", totalAyat: 53 },
  { number: 43, nameLatin: "Az-Zukhruf", nameArabic: "الزخرف", totalAyat: 89 },
  { number: 44, nameLatin: "Ad-Dukhan", nameArabic: "الدخان", totalAyat: 59 },
  { number: 45, nameLatin: "Al-Jasiyah", nameArabic: "الجاثية", totalAyat: 37 },
  { number: 46, nameLatin: "Al-Ahqaf", nameArabic: "الأحقاف", totalAyat: 35 },
  { number: 47, nameLatin: "Muhammad", nameArabic: "محمد", totalAyat: 38 },
  { number: 48, nameLatin: "Al-Fath", nameArabic: "الفتح", totalAyat: 29 },
  { number: 49, nameLatin: "Al-Hujurat", nameArabic: "الحجرات", totalAyat: 18 },
  { number: 50, nameLatin: "Qaf", nameArabic: "ق", totalAyat: 45 },
  { number: 51, nameLatin: "Az-Zariyat", nameArabic: "الذاريات", totalAyat: 60 },
  { number: 52, nameLatin: "At-Tur", nameArabic: "الطور", totalAyat: 49 },
  { number: 53, nameLatin: "An-Najm", nameArabic: "النجم", totalAyat: 62 },
  { number: 54, nameLatin: "Al-Qamar", nameArabic: "القمر", totalAyat: 55 },
  { number: 55, nameLatin: "Ar-Rahman", nameArabic: "الرحمن", totalAyat: 78 },
  { number: 56, nameLatin: "Al-Waqi'ah", nameArabic: "الواقعة", totalAyat: 96 },
  { number: 57, nameLatin: "Al-Hadid", nameArabic: "الحديد", totalAyat: 29 },
  { number: 58, nameLatin: "Al-Mujadilah", nameArabic: "المجادلة", totalAyat: 22 },
  { number: 59, nameLatin: "Al-Hasyr", nameArabic: "الحشر", totalAyat: 24 },
  { number: 60, nameLatin: "Al-Mumtahanah", nameArabic: "الممتحنة", totalAyat: 13 },
  { number: 61, nameLatin: "As-Saff", nameArabic: "الصف", totalAyat: 14 },
  { number: 62, nameLatin: "Al-Jumu'ah", nameArabic: "الجمعة", totalAyat: 11 },
  { number: 63, nameLatin: "Al-Munafiqun", nameArabic: "المنافقون", totalAyat: 11 },
  { number: 64, nameLatin: "At-Tagabun", nameArabic: "التغابن", totalAyat: 18 },
  { number: 65, nameLatin: "At-Talaq", nameArabic: "الطلاق", totalAyat: 12 },
  { number: 66, nameLatin: "At-Tahrim", nameArabic: "التحريم", totalAyat: 12 },
  { number: 67, nameLatin: "Al-Mulk", nameArabic: "الملك", totalAyat: 30 },
  { number: 68, nameLatin: "Al-Qalam", nameArabic: "القلم", totalAyat: 52 },
  { number: 69, nameLatin: "Al-Haqqah", nameArabic: "الحاقة", totalAyat: 52 },
  { number: 70, nameLatin: "Al-Ma'arij", nameArabic: "المعارج", totalAyat: 44 },
  { number: 71, nameLatin: "Nuh", nameArabic: "نوح", totalAyat: 28 },
  { number: 72, nameLatin: "Al-Jinn", nameArabic: "الجن", totalAyat: 28 },
  { number: 73, nameLatin: "Al-Muzzammil", nameArabic: "المزمل", totalAyat: 20 },
  { number: 74, nameLatin: "Al-Muddassir", nameArabic: "المدثر", totalAyat: 56 },
  { number: 75, nameLatin: "Al-Qiyamah", nameArabic: "القيامة", totalAyat: 40 },
  { number: 76, nameLatin: "Al-Insan", nameArabic: "الإنسان", totalAyat: 31 },
  { number: 77, nameLatin: "Al-Mursalat", nameArabic: "المرسلات", totalAyat: 50 },
  { number: 78, nameLatin: "An-Naba'", nameArabic: "النبأ", totalAyat: 40 },
  { number: 79, nameLatin: "An-Nazi'at", nameArabic: "النازعات", totalAyat: 46 },
  { number: 80, nameLatin: "'Abasa", nameArabic: "عبس", totalAyat: 42 },
  { number: 81, nameLatin: "At-Takwir", nameArabic: "التكوير", totalAyat: 29 },
  { number: 82, nameLatin: "Al-Infitar", nameArabic: "الانفطار", totalAyat: 19 },
  { number: 83, nameLatin: "Al-Mutaffifin", nameArabic: "المطففين", totalAyat: 36 },
  { number: 84, nameLatin: "Al-Insyiqaq", nameArabic: "الانشقاق", totalAyat: 25 },
  { number: 85, nameLatin: "Al-Buruj", nameArabic: "البروج", totalAyat: 22 },
  { number: 86, nameLatin: "At-Tariq", nameArabic: "الطارق", totalAyat: 17 },
  { number: 87, nameLatin: "Al-A'la", nameArabic: "الأعلى", totalAyat: 19 },
  { number: 88, nameLatin: "Al-Gasyiyah", nameArabic: "الغاشية", totalAyat: 26 },
  { number: 89, nameLatin: "Al-Fajr", nameArabic: "الفجر", totalAyat: 30 },
  { number: 90, nameLatin: "Al-Balad", nameArabic: "البلد", totalAyat: 20 },
  { number: 91, nameLatin: "Asy-Syams", nameArabic: "الشمس", totalAyat: 15 },
  { number: 92, nameLatin: "Al-Lail", nameArabic: "الليل", totalAyat: 21 },
  { number: 93, nameLatin: "Ad-Duha", nameArabic: "الضحى", totalAyat: 11 },
  { number: 94, nameLatin: "Asy-Syarh", nameArabic: "الشرح", totalAyat: 8 },
  { number: 95, nameLatin: "At-Tin", nameArabic: "التين", totalAyat: 8 },
  { number: 96, nameLatin: "Al-'Alaq", nameArabic: "العلق", totalAyat: 19 },
  { number: 97, nameLatin: "Al-Qadr", nameArabic: "القدر", totalAyat: 5 },
  { number: 98, nameLatin: "Al-Bayyinah", nameArabic: "البينة", totalAyat: 8 },
  { number: 99, nameLatin: "Az-Zalzalah", nameArabic: "الزلزلة", totalAyat: 8 },
  { number: 100, nameLatin: "Al-'Adiyat", nameArabic: "العاديات", totalAyat: 11 },
  { number: 101, nameLatin: "Al-Qari'ah", nameArabic: "القارعة", totalAyat: 11 },
  { number: 102, nameLatin: "At-Takasur", nameArabic: "التكاثر", totalAyat: 8 },
  { number: 103, nameLatin: "Al-'Asr", nameArabic: "العصر", totalAyat: 3 },
  { number: 104, nameLatin: "Al-Humazah", nameArabic: "الهمزة", totalAyat: 9 },
  { number: 105, nameLatin: "Al-Fil", nameArabic: "الفيل", totalAyat: 5 },
  { number: 106, nameLatin: "Quraisy", nameArabic: "قريش", totalAyat: 4 },
  { number: 107, nameLatin: "Al-Ma'un", nameArabic: "الماعون", totalAyat: 7 },
  { number: 108, nameLatin: "Al-Kausar", nameArabic: "الكوثر", totalAyat: 3 },
  { number: 109, nameLatin: "Al-Kafirun", nameArabic: "الكافرون", totalAyat: 6 },
  { number: 110, nameLatin: "An-Nasr", nameArabic: "النصر", totalAyat: 3 },
  { number: 111, nameLatin: "Al-Lahab", nameArabic: "اللهب", totalAyat: 5 },
  { number: 112, nameLatin: "Al-Ikhlas", nameArabic: "الإخلاص", totalAyat: 4 },
  { number: 113, nameLatin: "Al-Falaq", nameArabic: "الفلق", totalAyat: 5 },
  { number: 114, nameLatin: "An-Nas", nameArabic: "الناس", totalAyat: 6 },
];

/**
 * Tabel batas awal resmi 30 Juz Al-Qur'an (Standar Mushaf Madinah / Kemenag RI).
 * Digunakan untuk pemetaan titik batas hafalan secara deterministik & terverifikasi.
 */
export interface JuzBoundary {
  juz: number;
  startSurah: number;
  startAyat: number;
}

export const JUZ_BOUNDARIES: JuzBoundary[] = [
  { juz: 1, startSurah: 1, startAyat: 1 },
  { juz: 2, startSurah: 2, startAyat: 142 },
  { juz: 3, startSurah: 2, startAyat: 253 },
  { juz: 4, startSurah: 3, startAyat: 93 },
  { juz: 5, startSurah: 4, startAyat: 24 },
  { juz: 6, startSurah: 4, startAyat: 148 },
  { juz: 7, startSurah: 5, startAyat: 82 },
  { juz: 8, startSurah: 6, startAyat: 111 },
  { juz: 9, startSurah: 7, startAyat: 88 },
  { juz: 10, startSurah: 8, startAyat: 41 },
  { juz: 11, startSurah: 9, startAyat: 93 },
  { juz: 12, startSurah: 11, startAyat: 6 },
  { juz: 13, startSurah: 12, startAyat: 53 },
  { juz: 14, startSurah: 15, startAyat: 1 },
  { juz: 15, startSurah: 17, startAyat: 1 },
  { juz: 16, startSurah: 18, startAyat: 75 },
  { juz: 17, startSurah: 21, startAyat: 1 },
  { juz: 18, startSurah: 23, startAyat: 1 },
  { juz: 19, startSurah: 25, startAyat: 21 },
  { juz: 20, startSurah: 27, startAyat: 56 },
  { juz: 21, startSurah: 29, startAyat: 46 },
  { juz: 22, startSurah: 33, startAyat: 31 },
  { juz: 23, startSurah: 36, startAyat: 28 },
  { juz: 24, startSurah: 39, startAyat: 32 },
  { juz: 25, startSurah: 41, startAyat: 47 },
  { juz: 26, startSurah: 46, startAyat: 1 },
  { juz: 27, startSurah: 51, startAyat: 31 },
  { juz: 28, startSurah: 58, startAyat: 1 },
  { juz: 29, startSurah: 67, startAyat: 1 },
  { juz: 30, startSurah: 78, startAyat: 1 },
];

export function getSurahByNumber(num: number | string): QuranSurah | undefined {
  const n = typeof num === "string" ? parseInt(num, 10) : num;
  return QURAN_SURAHS.find((s) => s.number === n);
}

export function validateAyatNumber(
  surahNo: number | string,
  ayat: number | string
): { valid: boolean; maxAyat: number; message?: string } {
  const sNo = typeof surahNo === "string" ? parseInt(surahNo, 10) : surahNo;
  const ay = typeof ayat === "string" ? parseInt(ayat, 10) : ayat;

  const surah = getSurahByNumber(sNo);
  if (!surah) {
    return { valid: false, maxAyat: 0, message: "Nomor surah tidak valid" };
  }

  if (isNaN(ay) || ay < 1) {
    return {
      valid: false,
      maxAyat: surah.totalAyat,
      message: `Nomor ayat harus minimal 1`,
    };
  }

  if (ay > surah.totalAyat) {
    return {
      valid: false,
      maxAyat: surah.totalAyat,
      message: `Surah ${surah.nameLatin} hanya memiliki ${surah.totalAyat} ayat (ayat yang diinput: ${ay})`,
    };
  }

  return { valid: true, maxAyat: surah.totalAyat };
}

/**
 * Menghitung nomor Juz secara akurat & deterministik berdasarkan tabel batas resmi 30 Juz.
 */
export function getSuggestedJuz(surahNo: number | string, ayat: number | string): number {
  const sNo = typeof surahNo === "string" ? parseInt(surahNo, 10) : surahNo;
  const ay = typeof ayat === "string" ? parseInt(ayat, 10) : ayat;

  if (isNaN(sNo) || sNo < 1) return 1;
  const effectiveAyat = isNaN(ay) || ay < 1 ? 1 : ay;

  // Telusuri dari Juz 30 mundur ke Juz 1
  for (let i = JUZ_BOUNDARIES.length - 1; i >= 0; i--) {
    const boundary = JUZ_BOUNDARIES[i];
    if (
      sNo > boundary.startSurah ||
      (sNo === boundary.startSurah && effectiveAyat >= boundary.startAyat)
    ) {
      return boundary.juz;
    }
  }

  return 1;
}
