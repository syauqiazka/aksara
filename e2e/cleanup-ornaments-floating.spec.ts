import { test, expect } from "@playwright/test";

test.describe("Penyesuaian & Pembersihan: Bintang Emas, Splash 5s Reload, Hapus Card Melayang", () => {
  test("1. Verifikasi tidak ada card/badge melayang di hero section", async ({ page }) => {
    await page.goto("/");

    // Skip preloader if visible to test main content
    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }

    // Card melayang "Mushaf Tersalurkan" dan "Aksi Geber Kebersihan" tidak boleh ada di hero section
    const floatingMushaf = page.locator(".animate-\\[float_4s_ease-in-out_infinite\\]");
    await expect(floatingMushaf).toHaveCount(0);

    const floatingGeber = page.locator(".animate-\\[float_5s_ease-in-out_infinite_reverse\\]");
    await expect(floatingGeber).toHaveCount(0);

    // Verifikasi teks 'Aksi Geber Kebersihan' tidak ada di hero
    const heroSection = page.locator("section").first();
    const heroText = await heroSection.innerText();
    expect(heroText).not.toContain("Aksi Geber Kebersihan");
  });

  test("2. Verifikasi tidak ada class bg-islamic-stars di halaman", async ({ page }) => {
    await page.goto("/");

    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }

    const starBg = page.locator(".bg-islamic-stars");
    await expect(starBg).toHaveCount(0);
  });

  test("3. Verifikasi preloader muncul kembali saat reload halaman", async ({ page }) => {
    await page.goto("/");

    // Reload halaman
    await page.reload();

    const preloader = page.locator('div[aria-label="Animasi Pembuka Yayasan Sahabat Aksara"]');
    await expect(preloader).toBeVisible();

    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    await skipBtn.click();
    await expect(preloader).not.toBeVisible();
  });
});

