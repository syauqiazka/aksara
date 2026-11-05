import { test } from "@playwright/test";
import path from "path";

test.describe("Capture After Redesign - Laporan & Detail", () => {
  test("Capture laporan after - 1440 desktop & 390 mobile", async ({ page }) => {
    // 1. Laporan Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/laporan", { waitUntil: "networkidle" });
    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "laporan-1440.png"),
      fullPage: true,
    });

    // 2. Laporan Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/laporan", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "laporan-390.png"),
      fullPage: true,
    });

    // 3. Laporan Detail Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/laporan/laporan-infak-mushaf-q1-2026", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "laporan-detail-1440.png"),
      fullPage: true,
    });

    // 4. Laporan Detail Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/laporan/laporan-infak-mushaf-q1-2026", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "laporan-detail-390.png"),
      fullPage: true,
    });
  });
});

