import { test, expect } from "@playwright/test";

test.describe("Tahap 5-A: Tabel Infak Jinan Dua Tingkat (Donasi -> Santri) & Privasi Data", () => {
  test("1. Verifikasi 3 Tab Publik Aktif dan Tab Geber Tersembunyi Default", async ({ page }) => {
    await page.goto("/data-sebaran");

    const main = page.locator("main");

    // 3 Tab harus ada
    const tabJinan = main.getByRole("button", { name: /Infak Al-Qur'an Jinan/i });
    const tabBuss = main.getByRole("button", { name: /BUSS Al-Qur'an/i });
    const tabYatim = main.getByRole("button", { name: /Yatim Berdikari/i });

    await expect(tabJinan).toBeVisible();
    await expect(tabBuss).toBeVisible();
    await expect(tabYatim).toBeVisible();

    // Tab Geber Masjid disembunyikan secara default
    const tabGeber = main.getByRole("button", { name: /Geber Masjid/i });
    await expect(tabGeber).toHaveCount(0);
  });

  test("2. Verifikasi 10 Kolom Utama Infak Jinan Publik dan Perlindungan Privasi Nomor HP", async ({ page }) => {
    await page.goto("/data-sebaran");

    const main = page.locator("main");

    // Judul halaman transparansi
    await expect(main.getByRole("heading", { name: /Data Sebaran & Peta Penyaluran Amanah/i })).toBeVisible();

    // 10 Kolom resmi di tabel desktop
    await expect(main.getByRole("columnheader", { name: "No." })).toBeVisible();
    await expect(main.getByRole("columnheader", { name: "Donatur" })).toBeVisible();
    await expect(main.getByRole("columnheader", { name: "Asal" })).toBeVisible();
    await expect(main.getByRole("columnheader", { name: "Urutan Mushaf" })).toBeVisible();
    await expect(main.getByRole("columnheader", { name: "Dedikasi untuk" })).toBeVisible();
    await expect(main.getByRole("columnheader", { name: "Pesantren Tujuan" })).toBeVisible();
    await expect(main.getByRole("columnheader", { name: "Alamat & Peta" })).toBeVisible();
    await expect(main.getByRole("columnheader", { name: "Tanggal Distribusi" })).toBeVisible();
    await expect(main.getByRole("columnheader", { name: "Tersalurkan", exact: true })).toBeVisible();
    await expect(main.getByRole("columnheader", { name: "Dokumentasi" })).toBeVisible();

    // Nilai data baris pertama
    await expect(main.getByText("Mushaf ke-1").first()).toBeVisible();
    await expect(main.getByText(/Inayah Binti Kartoni/i).first()).toBeVisible();

    // Verifikasi Privasi: tidak ada nomor HP mentah (0812..., 0856..., 0822... dsb) di HTML/DOM
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/08[1-9][0-9]{7,11}/);

    // Tautan santri tersalurkan ada (e.g. 2 Santri)
    const santriLink = main.getByRole("link", { name: /2 Santri/i }).first();
    await expect(santriLink).toBeVisible();
  });

  test("3. Navigasi ke Halaman Detail Donasi (/data-sebaran/infak-jinan/[id]) dan Tabel Santri", async ({ page }) => {
    await page.goto("/data-sebaran");

    const main = page.locator("main");
    const santriLink = main.getByRole("link", { name: /2 Santri/i }).first();
    await expect(santriLink).toBeVisible();

    // Klik link santri untuk navigasi ke halaman detail donasi
    await santriLink.click();
    await page.waitForURL(/\/data-sebaran\/infak-jinan\/.+/);

    // Header ringkasan donasi di halaman detail
    await expect(page.getByText("Mushaf ke-1", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Inayah Binti Kartoni", { exact: true })).toBeVisible();
    await expect(page.getByText("Pondok Pesantren Madrasah Al-Huffazh 2 Gedongan", { exact: true })).toBeVisible();

    // Tabel santri penerima
    const santriHeading = page.getByRole("heading", { name: /Daftar Santri Penerima/i });
    await expect(santriHeading).toBeVisible();

    // Kolom-kolom santri
    await expect(page.getByRole("columnheader", { name: "Nama Santri" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Surat & Ayat Terkini" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Juz" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Progres Bulanan" })).toBeVisible();

    // Baris santri
    await expect(page.getByText("Muhammad Faiz").first()).toBeVisible();
    await expect(page.getByText("Al-Baqarah").first()).toBeVisible();
    await expect(page.getByText(/Ayat ke-252/i).first()).toBeVisible();
    await expect(page.getByText("Juz 2").first()).toBeVisible();

    // Privasi: tidak ada nomor HP di halaman detail
    const detailBody = await page.locator("body").innerText();
    expect(detailBody).not.toMatch(/08[1-9][0-9]{7,11}/);

    // Buka modal riwayat progres bulanan santri
    const riwayatBtn = page.getByRole("button", { name: /Riwayat/i }).first();
    await expect(riwayatBtn).toBeVisible();
    await riwayatBtn.click();

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal.getByText(/Riwayat Progres Hafalan Bulanan/i)).toBeVisible();
    await expect(modal.getByText(/Muhammad Faiz/i)).toBeVisible();

    // Tutup modal
    const closeBtn = modal.getByRole("button", { name: "Tutup" });
    await closeBtn.click();
    await expect(modal).toHaveCount(0);

    // Tombol kembali ke tabel data sebaran
    const backBtn = page.getByRole("link", { name: /Kembali ke Data Sebaran/i });
    await expect(backBtn).toBeVisible();
    await backBtn.click();
    await page.waitForURL(/\/data-sebaran/);
  });

  test("4. Navigasi ke Tab BUSS Al-Qur'an dan Kolom Penerima", async ({ page }) => {
    await page.goto("/data-sebaran");

    const main = page.locator("main");
    const tabBuss = main.getByRole("button", { name: /BUSS Al-Qur'an/i });
    await tabBuss.click();

    // Kolom BUSS tabel desktop
    await expect(main.getByRole("columnheader", { name: "Tahun" })).toBeVisible();
    await expect(main.getByRole("columnheader", { name: "Nama Santri" })).toBeVisible();
    await expect(main.getByRole("columnheader", { name: "Pesantren", exact: true })).toBeVisible();
    await expect(main.getByRole("columnheader", { name: "Surat & Ayat Terkini" })).toBeVisible();

    // Verifikasi donatur Hamba Allah jika donatur anonim
    await expect(main.getByText("Hamba Allah").first()).toBeVisible();
  });

  test("5. Navigasi ke Tab Yatim Berdikari dan Dokumentasi Kegiatan", async ({ page }) => {
    await page.goto("/data-sebaran");

    const main = page.locator("main");
    const tabYatim = main.getByRole("button", { name: /Yatim Berdikari/i });
    await tabYatim.click();

    // Kolom Yatim
    await expect(main.getByRole("columnheader", { name: "Nama Kegiatan" })).toBeVisible();
    await expect(main.getByRole("columnheader", { name: "Penyelenggara" })).toBeVisible();

    // Buka dokumentasi kegiatan
    const docBtn = main.getByRole("button", { name: /Dokumentasi Kegiatan/i }).first();
    await expect(docBtn).toBeVisible();
    await docBtn.click();

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal.getByText(/Pelatihan Vokasi & Digital Marketing/i)).toBeVisible();

    // Tutup modal
    const closeBtn = modal.getByRole("button", { name: /Tutup modal galeri/i });
    await closeBtn.click();
    await expect(modal).toHaveCount(0);
  });

  test("6. Tampilan Responsif Mobile (Kartu Bertumpuk di Viewport 375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/data-sebaran");

    const main = page.locator("main");

    // Tab buttons tetap terlihat
    await expect(main.getByRole("button", { name: /Infak Al-Qur'an Jinan/i })).toBeVisible();

    // Tampilan mobile menampilkan kartu donasi di dalam container .lg:hidden
    const mobileContainer = main.locator(".lg\\:hidden");
    await expect(mobileContainer.getByText("Mushaf ke-1").first()).toBeVisible();
    await expect(mobileContainer.getByText("Dedikasi").first()).toBeVisible();
    
    const mobileSantriBtn = mobileContainer.getByRole("link", { name: /Lihat 2 Santri Penerima/i }).first();
    await expect(mobileSantriBtn).toBeVisible();

    // Klik link di mobile membawa ke detail donasi
    await mobileSantriBtn.click();
    await page.waitForURL(/\/data-sebaran\/infak-jinan\/.+/);
    await expect(page.getByText("Mushaf ke-1", { exact: true }).first()).toBeVisible();
    await expect(page.locator(".md\\:hidden").getByText("Muhammad Faiz").first()).toBeVisible();
  });
});
