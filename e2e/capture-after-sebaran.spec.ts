import { test } from "@playwright/test";
import path from "path";

test.describe("Capture After Redesign - Data Sebaran & Detail", () => {
  test("Capture data sebaran - 1440 desktop & 390 mobile", async ({ page }) => {
    // 1. Data Sebaran Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/data-sebaran", { waitUntil: "networkidle" });
    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "data-sebaran-1440.png"),
      fullPage: true,
    });

    // 2. Data Sebaran Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/data-sebaran", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "data-sebaran-390.png"),
      fullPage: true,
    });

    // 3. Detail Donasi Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/data-sebaran/infak-jinan/jinan-1", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "data-sebaran-detail-1440.png"),
      fullPage: true,
    });

    // 4. Detail Donasi Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/data-sebaran/infak-jinan/jinan-1", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "data-sebaran-detail-390.png"),
      fullPage: true,
    });
  });
});

