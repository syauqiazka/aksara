import { test, expect } from "@playwright/test";
import path from "path";

const viewports = [
  { width: 360, height: 800, name: "360-mobile-small" },
  { width: 390, height: 844, name: "390-mobile-standard" },
  { width: 768, height: 1024, name: "768-tablet" },
  { width: 1440, height: 900, name: "1440-desktop" },
];

test.describe("Tahap 2: Verifikasi Visual Dropdown & Kontrol Form", () => {
  for (const vp of viewports) {
    test(`Capture /data-sebaran filters at ${vp.width}px (${vp.name})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/data-sebaran");

      // Wait for the filter section to be visible
      const searchInput = page.locator('input[placeholder*="Cari"]');
      await expect(searchInput).toBeVisible();

      // Ensure selects are visible
      const selects = page.locator("select");
      await expect(selects.first()).toBeVisible();

      // Capture screenshot of the filter bar
      const filterSection = page.locator('div:has(> div > input[placeholder*="Cari"])').first();
      await filterSection.screenshot({
        path: path.resolve(
          `docs/antislop/audit/screenshots/tahap-2/filter-bar-${vp.width}.png`
        ),
      });

      // Capture full viewport
      await page.screenshot({
        path: path.resolve(
          `docs/antislop/audit/screenshots/tahap-2/page-sebaran-${vp.width}.png`
        ),
      });
    });
  }

  test("Verifikasi opsi panjang pada dropdown tidak menabrak ikon chevron", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/data-sebaran");

    const provinceSelect = page.locator("select").first();
    await expect(provinceSelect).toBeVisible();

    // Select option by index
    await provinceSelect.selectOption({ index: 0 });

    // Check padding right on select is >= 40px (pr-11 = 44px)
    const paddingRight = await provinceSelect.evaluate((el) => {
      return window.getComputedStyle(el).paddingRight;
    });

    expect(parseFloat(paddingRight)).toBeGreaterThanOrEqual(40);
  });
});
