import { test } from "@playwright/test";
import path from "path";

const routes = [
  { name: "beranda", url: "/" },
  { name: "tentang", url: "/tentang" },
  { name: "program", url: "/program" },
  { name: "program-detail", url: "/program/infak-jinan" },
  { name: "portofolio", url: "/portofolio" },
  { name: "data-sebaran", url: "/data-sebaran" },
  { name: "data-sebaran-detail", url: "/data-sebaran/infak-jinan/jinan-1" },
  { name: "laporan", url: "/laporan" },
  { name: "laporan-detail", url: "/laporan/laporan-infak-mushaf-q1-2026" },
  { name: "donasi", url: "/donasi" },
  { name: "dokumentasi", url: "/dokumentasi" },
];

test.describe("Capture Before Redesign Screenshots", () => {
  for (const r of routes) {
    test(`Capture ${r.name} - 1440 desktop & 390 mobile`, async ({ page }) => {
      // 1. Desktop 1440x900
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(r.url, { waitUntil: "networkidle" });
      
      // If preloader is present, dismiss it by clicking "Lewati" or wait
      const skipBtn = page.getByRole("button", { name: /Lewati/i });
      if (await skipBtn.isVisible()) {
        await skipBtn.click();
      }
      await page.waitForTimeout(500);

      await page.screenshot({
        path: path.join(process.cwd(), "docs", "redesign", "before", `${r.name}-1440.png`),
        fullPage: true,
      });

      // 2. Mobile 390x844
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(r.url, { waitUntil: "networkidle" });
      if (await skipBtn.isVisible()) {
        await skipBtn.click();
      }
      await page.waitForTimeout(500);

      await page.screenshot({
        path: path.join(process.cwd(), "docs", "redesign", "before", `${r.name}-390.png`),
        fullPage: true,
      });
    });
  }
});

