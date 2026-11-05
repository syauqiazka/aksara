import { test } from "@playwright/test";
import path from "path";

test.describe("Capture After Redesign - Admin Backoffice", () => {
  test("Capture admin pages after redesign - 1440 desktop & 390 mobile", async ({ page }) => {
    // 1. Admin Login Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin/login", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "admin-login-1440.png"),
      fullPage: true,
    });

    // 2. Admin Login Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/login", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "admin-login-390.png"),
      fullPage: true,
    });

    // Login process
    await page.fill('input[type="email"]', "admin@sahabataksara.id");
    await page.fill('input[type="password"]', "aksaramulia2026");
    await page.click('button[type="submit"]');
    await page.waitForURL("/admin", { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    // 3. Admin Dashboard Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "admin-dashboard-1440.png"),
      fullPage: true,
    });

    // 4. Admin Dashboard Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "admin-dashboard-390.png"),
      fullPage: true,
    });

    // 5. Admin Infak List Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin/infak", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "admin-infak-1440.png"),
      fullPage: true,
    });

    // 6. Admin Infak List Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/infak", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "admin-infak-390.png"),
      fullPage: true,
    });

    // 7. Admin Infak New Form Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin/infak/new", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "admin-infak-new-1440.png"),
      fullPage: true,
    });

    // 8. Admin Infak New Form Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/infak/new", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(process.cwd(), "docs", "redesign", "after", "admin-infak-new-390.png"),
      fullPage: true,
    });
  });
});

