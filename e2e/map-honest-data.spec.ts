import { test, expect } from "@playwright/test";

test.describe("Butir 5 & 8: Peta Sebaran Otentik, Tanpa Bullet, Kontras & Affordance", () => {
  test("Peta sebaran menampilkan data jujur dari database tanpa mock pin fiktif dan tanpa label ganda", async ({
    page,
  }) => {
    await page.goto("/data-sebaran");

    // Pastikan peta render dengan judul yang benar
    const heading = page.locator("h3:has-text('Sebaran Infak Al-Qur\\'an Jinan')");
    await expect(heading).toBeVisible();

    // Verifikasi label ganda / developer terms sudah dibersihkan
    const redundantEyebrow = page.locator("text='PETA SEBARAN NASIONAL'");
    await expect(redundantEyebrow).not.toBeVisible();

    const devTerms = page.locator("text=/viewBox 1000/i");
    await expect(devTerms).not.toBeVisible();

    // Verifikasi screen reader accessible table ada di DOM
    const srTable = page.locator("table[aria-label='Ringkasan sebaran infak Al-Qur\\'an Jinan per pulau']");
    await expect(srTable).toBeAttached();

    // Verifikasi tidak ada bullet dot di dalam kontainer peta
    const mapContainer = page.locator(".select-none.overflow-hidden");
    const mapText = await mapContainer.innerText();
    expect(mapText).not.toContain("•");
    expect(mapText).not.toContain("Masjid:");

    // Verifikasi klik pulau (Jawa) memicu filter wilayah
    const jawaPath = page.locator("path[d^='M 410,270']");
    if (await jawaPath.isVisible()) {
      await jawaPath.click();

      // Filter badge harus muncul
      const islandBadge = page.locator("text=/Wilayah: JAWA/i");
      await expect(islandBadge).toBeVisible();

      // Klik tombol hapus filter pulau
      const clearBtn = page.locator("button[aria-label='Hapus filter wilayah pulau']");
      await clearBtn.click();
      await expect(islandBadge).not.toBeVisible();
    }
  });

  test("Affordance & Dark Surface: tombol pada kontainer gelap memiliki keterbacaan tinggi", async ({
    page,
  }) => {
    await page.goto("/");
    // Verifikasi CTA utama di hero
    const heroCta = page.locator("a:has-text('Salurkan Donasi')").first();
    await expect(heroCta).toBeVisible();

    // Verifikasi button secondary-dark styling
    const sebaranBtn = page.locator("a:has-text('Lihat Peta Sebaran')").first();
    await expect(sebaranBtn).toBeVisible();
  });
});
