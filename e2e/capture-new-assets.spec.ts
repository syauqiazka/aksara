import { test } from "@playwright/test";
import path from "path";

test.describe("Visual Capture - Portfolio Logos, BUSS Quran & Geber Masjid", () => {
  test("Capture portfolio with official app logos", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/portofolio", { waitUntil: "networkidle" });
    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "portfolio-official-logos.png"),
      fullPage: true,
    });
  });

  test("Capture BUSS Quran program detail", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/program/buss-quran", { waitUntil: "networkidle" });
    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "program-buss-quran.png"),
      fullPage: true,
    });
  });

  test("Capture Geber Masjid program detail", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/program/geber-masjid", { waitUntil: "networkidle" });
    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "program-geber-masjid.png"),
      fullPage: true,
    });
  });
});
