import { test } from "@playwright/test";
import path from "path";

test.describe("Capture After Redesign - Program & Detail", () => {
  test("Capture program after - 1440 desktop & 390 mobile", async ({ page }) => {
    // 1. Program Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/program", { waitUntil: "networkidle" });
    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "program-1440.png"),
      fullPage: true,
    });

    // 2. Program Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/program", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "program-390.png"),
      fullPage: true,
    });

    // 3. Program Detail Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/program/infak-jinan", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "program-detail-1440.png"),
      fullPage: true,
    });

    // 4. Program Detail Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/program/infak-jinan", { waitUntil: "networkidle" });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "program-detail-390.png"),
      fullPage: true,
    });
  });
});

