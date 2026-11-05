import { test, expect } from "@playwright/test";

test.describe("Pengaturan Animasi Splash / Intro Logo ±5 Detik & Selalu Muncul saat Reload", () => {
  test("1. Kunjungan: Preloader tampil dengan emblem & durasi ~5 detik sebelum transisi membuka konten utama", async ({
    page,
  }) => {
    await page.goto("/");

    // 1. Preloader container should be visible immediately
    const preloader = page.locator('div[aria-label="Animasi Pembuka Yayasan Sahabat Aksara"]');
    await expect(preloader).toBeVisible();

    // 2. Skip button should be present with >= 44px touch target
    const skipButton = page.getByRole("button", { name: /Lewati/i });
    await expect(skipButton).toBeVisible();
    const box = await skipButton.boundingBox();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }

    // 3. Brand typography visible during intro
    await expect(page.getByText("Sahabat Aksara").first()).toBeVisible();
    await expect(page.getByText(/A K S A R A/)).toBeVisible();

    // 4. Wait for the ~5.0s animation to complete naturally
    // Timeout of 10000ms allows for cold hydration + 5.1s animation
    await expect(preloader).not.toBeVisible({ timeout: 10000 });

    // 5. Verify main content is now visible
    const heroHeading = page.locator("h1").first();
    await expect(heroHeading).toBeVisible();
  });

  test("2. Refresh dalam tab yang sama: Animasi intro SELALU muncul kembali pada setiap reload", async ({
    page,
  }) => {
    await page.goto("/");

    // Refresh page
    await page.reload();

    // Preloader MUST be visible again on reload!
    const preloader = page.locator('div[aria-label="Animasi Pembuka Yayasan Sahabat Aksara"]');
    await expect(preloader).toBeVisible();

    // Can skip or let finish
    const skipButton = page.getByRole("button", { name: /Lewati/i });
    await skipButton.click();
    await expect(preloader).not.toBeVisible({ timeout: 2000 });

    // Main page is visible
    const heroHeading = page.locator("h1").first();
    await expect(heroHeading).toBeVisible();
  });

  test("3. Tombol 'Lewati' langsung menutup preloader dan membuka konten utama", async ({
    page,
  }) => {
    await page.goto("/");

    const preloader = page.locator('div[aria-label="Animasi Pembuka Yayasan Sahabat Aksara"]');
    await expect(preloader).toBeVisible();

    // Click skip immediately
    const skipButton = page.getByRole("button", { name: /Lewati/i });
    await skipButton.click();

    // Should immediately disappear within 1.5 seconds (not wait 5s)
    await expect(preloader).not.toBeVisible({ timeout: 1500 });

    // Main page is visible
    const heroHeading = page.locator("h1").first();
    await expect(heroHeading).toBeVisible();
  });

  test("4. Mode prefers-reduced-motion: Transisi instan (~300ms fade sederhana) tanpa animasi panjang", async ({
    page,
  }) => {
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: "reduce" });

    const startTime = Date.now();
    await page.goto("/");

    // Wait for preloader to close under reduced motion
    const preloader = page.locator('div[aria-label="Animasi Pembuka Yayasan Sahabat Aksara"]');
    await expect(preloader).not.toBeVisible({ timeout: 2500 });

    const elapsed = Date.now() - startTime;
    // Should take under 2.5s (much faster than full 5s timeline + wipe)
    expect(elapsed).toBeLessThan(2500);

    const heroHeading = page.locator("h1").first();
    await expect(heroHeading).toBeVisible();
  });

  test("5. Reload di halaman non-home (misal /tentang): Animasi intro muncul dulu sebelum membuka /tentang", async ({
    page,
  }) => {
    await page.goto("/tentang");

    // Preloader MUST be visible on initial load of /tentang
    const preloader = page.locator('div[aria-label="Animasi Pembuka Yayasan Sahabat Aksara"]');
    await expect(preloader).toBeVisible();

    // Skip preloader
    const skipButton = page.getByRole("button", { name: /Lewati/i });
    await skipButton.click();
    await expect(preloader).not.toBeVisible({ timeout: 2000 });

    // Verify we are on /tentang
    await expect(page).toHaveURL(/.*\/tentang/);
    await expect(page.locator("h1")).toContainText(/Profil|Khidmat/i);

    // Now reload while on /tentang
    await page.reload();

    // Preloader MUST appear again on reload of /tentang!
    await expect(preloader).toBeVisible();

    // Skip again
    await page.getByRole("button", { name: /Lewati/i }).click();
    await expect(preloader).not.toBeVisible({ timeout: 2000 });

    // Confirm page content is still /tentang
    await expect(page).toHaveURL(/.*\/tentang/);
    await expect(page.locator("h1")).toContainText(/Profil|Khidmat/i);
  });

  test("6. Foto galeri yang sudah dipublish muncul di halaman /donasi dan /dokumentasi", async ({
    page,
  }) => {
    // Check on /donasi
    await page.goto("/donasi");
    const skipButton = page.getByRole("button", { name: /Lewati/i });
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }

    // Verify gallery section exists on /donasi
    await expect(page.getByText("Dokumentasi Aksi Nyata di Lapangan")).toBeVisible();
    // Verify published gallery title "tes" is rendered
    await expect(page.getByText("tes").first()).toBeVisible();

    // Check on /dokumentasi
    await page.goto("/dokumentasi");
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    await expect(page.getByText("tes").first()).toBeVisible();
  });
});
