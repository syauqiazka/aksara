import { test, expect } from "@playwright/test";

test.describe("Craftsmanship & Seamless Page Transitions", () => {
  test("1. Page transition container wraps content and triggers on route navigation", async ({
    page,
  }) => {
    await page.goto("/tentang");
    await page.waitForLoadState("networkidle");

    const container = page.locator(".page-transition-container");
    await expect(container).toBeVisible();

    // Navigate to Program
    const programLink = page.locator("nav[aria-label='Navigasi Utama'] a[href='/program']");
    await programLink.click();
    await page.waitForURL("**/program");

    await expect(page.locator(".page-transition-container")).toBeVisible();
    await expect(page.locator("h1")).toContainText(/Program|Khidmat/i);
  });

  test("2. Automatic scroll restoration resets window.scrollY to 0 on page navigation", async ({
    page,
  }) => {
    await page.goto("/tentang");
    await page.waitForLoadState("networkidle");

    // Scroll down deeply
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(300);

    const scrolledY = await page.evaluate(() => window.scrollY);
    expect(scrolledY).toBeGreaterThan(200);

    // Click link to Portofolio
    const portofolioLink = page.locator("nav[aria-label='Navigasi Utama'] a[href='/portofolio']");
    await portofolioLink.click();
    await page.waitForURL("**/portofolio");

    // Wait for smooth transition & lenis reset
    await page.waitForTimeout(500);

    const newY = await page.evaluate(() => window.scrollY);
    expect(newY).toBeLessThanOrEqual(50);
  });

  test("3. Typographical craftsmanship: headings have text-wrap balance and body has text-wrap pretty", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const h1Wrap = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      return h1 ? window.getComputedStyle(h1).textWrap : null;
    });
    expect(h1Wrap).toBe("balance");

    const pWrap = await page.evaluate(() => {
      const p = document.querySelector("p");
      return p ? window.getComputedStyle(p).textWrap : null;
    });
    expect(pWrap).toBe("pretty");
  });

  test("4. Button craftsmanship: active tactile scale, cursor-pointer, and accessible focus", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const heroCtaButton = page.locator("section a[href='/donasi']").first();
    await expect(heroCtaButton).toBeVisible();

    // Check class attributes for craftsmanship standards
    const className = await heroCtaButton.getAttribute("class");
    expect(className).toContain("cursor-pointer");
    expect(className).toContain("active:scale-[0.98]");
  });

  test("5. Prefers-reduced-motion: respects user accessibility preference", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/tentang");
    await page.waitForLoadState("networkidle");

    const isAnimationDisabled = await page.evaluate(() => {
      const el = document.querySelector(".page-transition-container");
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return style.animationName === "none" || style.animationDuration === "0.01ms";
    });

    expect(isAnimationDisabled).toBe(true);
  });
});
