import { test } from "@playwright/test";
import path from "path";

test.describe("Capture After Redesign - Beranda Arah A", () => {
  test("Capture beranda after - 1440 desktop & 390 mobile", async ({ page }) => {
    // 1. Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    
    // Dismiss preloader if present
    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);

    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "beranda-1440.png"),
      fullPage: true,
    });

    // 2. Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);

    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "beranda-390.png"),
      fullPage: true,
    });
  });
});

