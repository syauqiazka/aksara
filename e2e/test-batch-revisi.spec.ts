import { test, expect } from "@playwright/test";

test.describe("Verifikasi 5 Item Revisi User", () => {
  test("1. Homepage BUSS Al-Qur'an konsisten dengan program (4 kategori mulai Rp 200.000)", async ({
    page,
  }) => {
    await page.goto("/");

    // Skip preloader
    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await skipBtn.click();
    }

    // Badge Mulai Rp 200.000 / Bln
    await expect(page.getByText("Mulai Rp 200.000 / Bln")).toBeVisible();

    // 4 Kategori BUSS
    await expect(page.getByText("BUSS Kelas Ekonomis")).toBeVisible();
    await expect(page.getByText("Rp 200.000 / bln", { exact: true })).toBeVisible();

    await expect(page.getByText("BUSS Kelas Bisnis")).toBeVisible();
    await expect(page.getByText("Rp 400.000 / bln", { exact: true })).toBeVisible();

    await expect(page.getByText("BUSS Kelas Eksekutif")).toBeVisible();
    await expect(page.getByText("Rp 600.000 / bln", { exact: true })).toBeVisible();

    await expect(page.getByText("BUSS Kelas Luxury")).toBeVisible();
    await expect(page.getByText("Rp 1.000.000 / bln", { exact: true })).toBeVisible();
  });

  test("2. Seluruh 6 pills Program Khidmat Sahabat Aksara Lainnya memiliki ikon", async ({ page }) => {
    await page.goto("/");

    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await skipBtn.click();
    }

    const pills = [
      "Geber Bersih Masjid",
      "Majlis Tasmi' 30 Juz Bil-Ghoib",
      "Program Yatim Berdikari",
      "Beasiswa Pelatihan IT Mitra Produktif",
      "Pembinaan UMKM Umat",
      "Bantuan Tematik Tanggap Bencana",
    ];

    const main = page.locator("#main-content");
    for (const pillLabel of pills) {
      const link = main.getByRole("link", { name: pillLabel });
      await expect(link).toBeVisible();
      // Ensure SVG icon exists inside each pill link
      const icon = link.locator("svg");
      await expect(icon).toBeVisible();
    }
  });

  test("3. Badges centang (Cetak nama custom, Monitoring hafalan, Data koordinat) telah dihapus dari Beranda", async ({
    page,
  }) => {
    await page.goto("/");

    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await skipBtn.click();
    }

    await expect(page.getByText("Monitoring hafalan bulanan")).not.toBeVisible();
    await expect(page.getByText("Data koordinat & foto terbuka")).not.toBeVisible();
  });

  test("4 & 5. Tentang Kami: Subtitle PageHeader memuat profil legalitas & Section 2 lama telah dihapus", async ({
    page,
  }) => {
    await page.goto("/tentang");

    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await skipBtn.click();
    }

    // Verifikasi subtitle PageHeader mengandung teks misi dan profil lembaga
    await expect(
      page.getByText(
        "Yayasan Sahabat Aksara (Yayasan Ajirasa Aksara Semesta) mendedikasikan ikhtiar dakwah, pendidikan, sosial, dan teknologi untuk kemandirian umat."
      )
    ).toBeVisible();

    const main = page.locator("#main-content");

    // Verifikasi rincian profil dalam subtitle
    await expect(main.getByText("Profil Lembaga & Legalitas Resmi:")).toBeVisible();
    await expect(main.getByText("22 Oktober 2026")).toBeVisible();
    await expect(main.getByText("Bogor, Jawa Barat, Indonesia")).toBeVisible();
    await expect(main.getByText("AHU-0022494.AH.01.04. Tahun 2026")).toBeVisible();
    await expect(main.getByText("1000 0000 1186 7419")).toBeVisible();
    await expect(main.getByText("ajirasaaksarasemesta@gmail.com")).toBeVisible();

    // Verifikasi Section 2 lama (kotak grid 6 kartu hijau) sudah tidak ada
    // Di section lama terdapat judul "Profil Lembaga & Legalitas Resmi" dalam div flex-col lg:flex-row
    // Kita pastikan tidak ada 6 kartu grid terpisah
    const oldGrid = page.locator(".grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-6");
    await expect(oldGrid).toHaveCount(0);
  });
});

