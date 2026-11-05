import { test, expect } from "@playwright/test";

test.describe("Butir 1: Validasi Input Angka, Ayat, dan Juz Otomatis", () => {
  test.beforeEach(async ({ page }) => {
    // Login admin
    await page.goto("/admin/login");
    await page.fill('input[type="email"]', "admin@sahabataksara.id");
    await page.fill('input[type="password"]', "aksaramulia2026");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => url.pathname === "/admin");
  });

  test("1. Mengetik '0' lalu '5' menghasilkan '5' (tanpa 0 di depan), hapus semua lalu '12' -> '12'", async ({ page }) => {
    await page.goto("/admin/infak/new");
    await page.waitForSelector("form");

    const mushafInput = page.locator('input[placeholder="Contoh: 101"]');
    await expect(mushafInput).toBeVisible();

    // Clear and type "0" then "5"
    await mushafInput.fill("");
    await mushafInput.pressSequentially("0");
    await mushafInput.pressSequentially("5");
    await expect(mushafInput).toHaveValue("5");

    // Clear completely and type "12"
    await mushafInput.fill("");
    await expect(mushafInput).toHaveValue("");
    await mushafInput.pressSequentially("12");
    await expect(mushafInput).toHaveValue("12");
  });

  test("2. Ayat Al-Fatihah ayat 10 memunculkan error inline dan mencegah penyimpanan", async ({ page }) => {
    await page.goto("/admin/infak/new");
    await page.waitForSelector("form");

    // Add 1 santri
    const addSantriBtn = page.getByRole("button", { name: "Tambah Baris Santri" });
    if (await addSantriBtn.isVisible()) {
      await addSantriBtn.click();
    } else {
      await page.getByRole("button", { name: "Tambah Santri Pertama" }).click();
    }

    const santriNameInput = page.locator('input[placeholder="Contoh: Muhammad Farhan"]');
    await santriNameInput.fill("Santri Uji Ayat");

    // Santri defaults to Surah 1 (Al-Fatihah)
    const ayatInput = page.locator('input[placeholder="Contoh: 7"]');
    await ayatInput.fill("10");

    // Check inline error appears
    await expect(page.getByText(/Al-Fatihah hanya/i)).toBeVisible();

    // Try submitting via "Terbitkan Sekarang" (actual button text)
    const saveBtn = page.getByRole("button", { name: /Terbitkan Sekarang/i });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    // Global error banner should report the error  
    await expect(page.locator('div[role="alert"]:not(#__next-route-announcer__)')).toContainText("Al-Fatihah");
  });

  test("3. Ganti surah otomatis memperbarui juz, kecuali sudah ditimpa manual (dan ada tautan 'Kembalikan otomatis')", async ({ page }) => {
    await page.goto("/admin/infak/new");
    await page.waitForSelector("form");

    // Add 1 santri
    const addSantriBtn = page.getByRole("button", { name: "Tambah Baris Santri" });
    if (await addSantriBtn.isVisible()) {
      await addSantriBtn.click();
    } else {
      await page.getByRole("button", { name: "Tambah Santri Pertama" }).click();
    }

    // Wait for santri row to appear
    await page.waitForSelector('input[placeholder="Contoh: Muhammad Farhan"]');

    const juzInput = page.locator('input[placeholder="Contoh: 1"]');

    // Initial: Surah 1 (Al-Fatihah), Ayat 7 -> Juz 1
    await expect(juzInput).toHaveValue("1");

    // Change Surah to An-Naba' (78) using native select inside the Select component
    const surahSelect = page.locator("select:has(option[value='78'])").first();
    await surahSelect.selectOption("78");

    // Juz should automatically update to 30
    await expect(juzInput).toHaveValue("30");

    // Now manually edit Juz to 29
    await juzInput.fill("29");
    await expect(juzInput).toHaveValue("29");

    // Link 'Kembalikan otomatis' should be visible
    const resetJuzBtn = page.getByRole("button", { name: "Kembalikan otomatis" });
    await expect(resetJuzBtn).toBeVisible();

    // Click 'Kembalikan otomatis'
    await resetJuzBtn.click();
    // For surah 78 (An-Naba'), ayat 7 -> Juz 30
    await expect(juzInput).toHaveValue("30");
    // Link should disappear
    await expect(resetJuzBtn).not.toBeVisible();
  });
});

