import { test, expect } from "@playwright/test";

test.describe("Tahap 4: Sinkronisasi Konten Docx Baru (Kerangka 104457)", () => {
  test("1. Verifikasi Profil Lembaga, Legalitas, dan Tanggal Pendirian di /tentang", async ({ page }) => {
    await page.goto("/tentang");

    const main = page.locator("main");

    // Legal & Kisah Lembaga
    await expect(main.getByText("Kisah & Latar Belakang Lembaga")).toBeVisible();
    await expect(main.getByText("Ahmad Dahlan").first()).toBeVisible();
    await expect(main.getByText("Madrasah Al-Huffazh 2 Gedongan").first()).toBeVisible();
    await expect(main.getByText("Institut PTIQ Jakarta").first()).toBeVisible();

    // Visi & Misi baru
    await expect(
      main.getByText("Menjadi lembaga yayasan yang berdedikasi dalam menjaga & memuliakan Al-Qur'an")
    ).toBeVisible();

    // Acronym AKSARA baru (Al-Qur'an, Kemanusiaan, Sinergi, Akhlak, Riset, Aplikasi)
    await expect(main.getByText("Makna Filosofis Nama A-K-S-A-R-A")).toBeVisible();
    await expect(main.getByRole("heading", { name: "Al-Qur'an", exact: true })).toBeVisible();
    await expect(main.getByRole("heading", { name: "Kemanusiaan", exact: true })).toBeVisible();
    await expect(main.getByRole("heading", { name: "Sinergi", exact: true })).toBeVisible();
    await expect(main.getByRole("heading", { name: "Akhlak", exact: true })).toBeVisible();
    await expect(main.getByRole("heading", { name: "Riset", exact: true })).toBeVisible();
    await expect(main.getByRole("heading", { name: "Aplikasi", exact: true })).toBeVisible();

    // Slogan lama tidak ada
    const oldTagline = main.getByText("Satu mushaf, sejuta pahala abadi");
    await expect(oldTagline).toHaveCount(0);
  });

  test("2. Verifikasi 8 Program Lembaga dalam Urutan Docx Baru di /program", async ({ page }) => {
    await page.goto("/program");
    const main = page.locator("main");

    // 8 Program titles
    await expect(main.getByRole("heading", { name: /Infak Al-Qur'an Jinan/i }).first()).toBeVisible();
    await expect(main.getByRole("heading", { name: /Program BUSS Al-Qur'an/i }).first()).toBeVisible();
    await expect(main.getByRole("heading", { name: /Gerakan Bersih Masjid \(Geber Masjid\)/i }).first()).toBeVisible();
    await expect(main.getByRole("heading", { name: /Majlis Tasmi' Al-Qur'an 30 Juz Bil-Ghoib/i }).first()).toBeVisible();
    await expect(main.getByRole("heading", { name: /Program Yatim Berdikari/i }).first()).toBeVisible();
    await expect(main.getByRole("heading", { name: /Beasiswa Pelatihan IT Mitra Produktif/i }).first()).toBeVisible();
    await expect(main.getByRole("heading", { name: /Program Dukungan Pembinaan dan Pemberdayaan UMKM/i }).first()).toBeVisible();
    await expect(main.getByRole("heading", { name: /Program Bantuan Tematik Nusantara/i }).first()).toBeVisible();

    // Harga Infak Jinan adalah Rp 100.000 / Mushaf
    await expect(main.getByText("Rp 100.000 / Mushaf")).toBeVisible();
  });

  test("3. Detail Program /program/infak-jinan dan backward compatibility alias /program/infak-alquran", async ({ page }) => {
    // Navigasi ke primary slug
    await page.goto("/program/infak-jinan");
    await expect(page.locator("h1").filter({ hasText: "Infak Al-Qur'an Jinan" })).toBeVisible();
    await expect(page.locator("main").getByText("Rp 100.000 / Mushaf", { exact: true })).toBeVisible();

    // Navigasi ke alias slug lama (tetap bekerja tanpa 404)
    await page.goto("/program/infak-alquran");
    await expect(page.locator("h1").filter({ hasText: "Infak Al-Qur'an Jinan" })).toBeVisible();
  });

  test("4. Verifikasi Info Donasi, Kontak 0822-6217-0018, dan Mitra di /donasi", async ({ page }) => {
    await page.goto("/donasi");
    const main = page.locator("main");

    // Rekening tanpa karangan nomor
    await expect(main.getByText("Informasi rekening segera diumumkan")).toBeVisible();
    await expect(main.getByText("Yayasan Ajirasa Aksara Semesta").first()).toBeVisible();

    // Kontak WhatsApp resmi
    const waLink = main.locator("a[href*='wa.me/082262170018'], a[href*='wa.me/6282262170018']");
    await expect(waLink).toBeVisible();

    // Mitra kami
    await expect(main.getByText("Madrasah Al-Huffazh Gedongan")).toBeVisible();
  });

  test("5. Verifikasi Portofolio 6 Aplikasi di /portofolio", async ({ page }) => {
    await page.goto("/portofolio");
    const main = page.locator("main");

    await expect(main.getByRole("heading", { name: "Aplikasi KajianQu" })).toBeVisible();
    await expect(main.getByRole("heading", { name: "Aplikasi Bank Saku Digital" })).toBeVisible();
    await expect(main.getByRole("heading", { name: "Aplikasi DiaryQu" })).toBeVisible();
    await expect(main.getByRole("heading", { name: "Aplikasi E-AbsensiQu" })).toBeVisible();
    await expect(main.getByRole("heading", { name: "Aplikasi DKM MasjidQu" })).toBeVisible();
    await expect(main.getByRole("heading", { name: "Aplikasi SapawargaQu" })).toBeVisible();
  });
});
