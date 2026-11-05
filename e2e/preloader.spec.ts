import { test, expect } from "@playwright/test";

test.describe("Tahap 3: Intro Animasi Loading Preloader ±3 Detik", () => {
  test("1. Kunjungan pertama: Preloader tampil dengan emblem & tirai wipe-up (selesai ~3.0 dtk)", async ({
    page,
  }) => {
    // Navigate to homepage with clean session
    await page.goto("/");

    // 1. Preloader container should be visible immediately
    const preloader = page.locator('div[aria-label="Animasi Pembuka Yayasan Sahabat Aksara"]');
    await expect(preloader).toBeVisible();

    // 2. Skip button should be present with >= 44px touch target
    const skipButton = page.getByRole("button", { name: /Lewati/i });
    await expect(skipButton).toBeVisible();
    const box = await skipButton.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);

    // 3. Brand typography visible during intro
    await expect(page.getByText("Sahabat Aksara").first()).toBeVisible();
    await expect(page.getByText(/A K S A R A/)).toBeVisible();

    // 4. Wait for the ~3.0s animation to complete naturally
    // Timeout of 8000ms allows for cold hydration + 3.0s animation
    await expect(preloader).not.toBeVisible({ timeout: 8000 });

    // 5. Verify flag in sessionStorage
    const visitedFlag = await page.evaluate(() => sessionStorage.getItem("sahabat_aksara_visited"));
    expect(visitedFlag).toBe("true");

    // 6. Verify main content is now visible
    const heroHeading = page.locator("h1").first();
    await expect(heroHeading).toBeVisible();
  });

  test("2. Refresh dalam tab yang sama: Preloader TIDAK muncul lagi (sessionStorage guard)", async ({
    page,
  }) => {
    // First visit sets session storage
    await page.goto("/");
    // Wait for preloader to close
    await expect(
      page.locator('div[aria-label="Animasi Pembuka Yayasan Sahabat Aksara"]')
    ).not.toBeVisible({ timeout: 8000 });

    // Refresh page in the same session
    await page.reload();

    // Preloader should NOT be visible at all
    const preloader = page.locator('div[aria-label="Animasi Pembuka Yayasan Sahabat Aksara"]');
    await expect(preloader).toHaveCount(0);

    // Main page is immediately visible
    const heroHeading = page.locator("h1").first();
    await expect(heroHeading).toBeVisible();
  });

  test("3. Tombol 'Lewati' langsung menutup preloader dan menyimpan flag sessionStorage", async ({
    page,
  }) => {
    // Clean session
    await page.goto("/");

    const preloader = page.locator('div[aria-label="Animasi Pembuka Yayasan Sahabat Aksara"]');
    await expect(preloader).toBeVisible();

    // Click skip immediately
    const skipButton = page.getByRole("button", { name: /Lewati/i });
    await skipButton.click();

    // Should immediately disappear within 1.5 seconds (not wait 3s)
    await expect(preloader).not.toBeVisible({ timeout: 1500 });

    // Verify flag set
    const visitedFlag = await page.evaluate(() => sessionStorage.getItem("sahabat_aksara_visited"));
    expect(visitedFlag).toBe("true");

    // Reload to verify it doesn't reappear
    await page.reload();
    await expect(page.locator('div[aria-label="Animasi Pembuka Yayasan Sahabat Aksara"]')).toHaveCount(0);
  });

  test("4. Mode prefers-reduced-motion: Transisi instan (~300ms fade sederhana) tanpa animasi 3 dtk", async ({
    page,
  }) => {
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: "reduce" });

    const startTime = Date.now();
    await page.goto("/");

    // Wait for sessionStorage to be set by the reduced-motion handler
    await page.waitForFunction(
      () => sessionStorage.getItem("sahabat_aksara_visited") === "true",
      null,
      { timeout: 3000 }
    );

    const elapsed = Date.now() - startTime;
    // Should take under 2.5s (much faster than full 3s timeline + wipe)
    expect(elapsed).toBeLessThan(2500);

    // Preloader should not be visible
    const preloader = page.locator('div[aria-label="Animasi Pembuka Yayasan Sahabat Aksara"]');
    await expect(preloader).not.toBeVisible({ timeout: 1000 });
  });
});
