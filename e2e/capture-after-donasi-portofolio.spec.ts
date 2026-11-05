import { test } from "@playwright/test";
import path from "path";

test.describe("Capture After Redesign - Donasi, Dokumentasi & Portofolio", () => {
  test("Capture donasi, dokumentasi, and portofolio after - 1440 desktop & 390 mobile", async ({ page }) => {
    // 1. Donasi Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/donasi", { waitUntil: "networkidle" });
    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "donasi-1440.png"),
      fullPage: true,
    });

    // 2. Donasi Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/donasi", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "donasi-390.png"),
      fullPage: true,
    });

    // 3. Dokumentasi Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/dokumentasi", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "dokumentasi-1440.png"),
      fullPage: true,
    });

    // 4. Dokumentasi Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dokumentasi", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "dokumentasi-390.png"),
      fullPage: true,
    });

    // 5. Portofolio Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/portofolio", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "portofolio-1440.png"),
      fullPage: true,
    });

    // 6. Portofolio Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/portofolio", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "portofolio-390.png"),
      fullPage: true,
    });
  });
});

