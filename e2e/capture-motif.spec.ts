import { test } from "@playwright/test";
import path from "path";

test.describe("Visual Capture - Islamic Motif on Splash Screen & Hero", () => {
  test("Capture splash screen preloader with Islamic motif", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    // Go to homepage with cold session
    await page.goto("/", { waitUntil: "domcontentloaded" });
    
    // Wait for splash screen to be visible with mandala and typography (at 1.6s)
    await page.waitForTimeout(1600);

    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "splash-motif.png"),
    });

    // Dismiss splash screen by clicking Lewati or wait for curtain wipe
    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }
    await page.waitForTimeout(800);

    // Capture Hero Showcase with Islamic motif
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "hero-motif.png"),
    });
  });
});
