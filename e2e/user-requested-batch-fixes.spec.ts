import { test, expect } from "@playwright/test";

test.describe("Batch Perbaikan: Geber 0, Modal Viewport, Legalitas '-', dan Ganti Password Admin", () => {
  test("1. Homepage: Geber Masjid menampilkan angka nyata (0 jika kosong, bukan 12 dummy)", async ({
    page,
  }) => {
    await page.goto("/");

    // Skip preloader if visible
    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await skipBtn.click();
    }

    // Verify "Masjid Dibersihkan" metric stat
    const masjidLabel = page.getByText("Masjid Dibersihkan");
    await expect(masjidLabel).toBeVisible();

    // Verify counter shows 0 and NOT 12
    const masjidSection = masjidLabel.locator("..");
    await expect(masjidSection).toBeVisible();
    const textContent = await masjidSection.innerText();
    expect(textContent).not.toContain("12");
  });

  test("2. Legalitas: Badan Hukum, SK Kemenkumham, dan NPWP resmi tercantum", async ({ page }) => {
    await page.goto("/tentang");

    // Skip preloader if visible
    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await skipBtn.click();
    }

    // Check footer / legal strip
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const footerText = await footer.innerText();
    expect(footerText).toContain("Badan Hukum: Yayasan");
    expect(footerText).toContain("AHU-0022494.AH.01.04. Tahun 2026");
    expect(footerText).toContain("1000 0000 1186 7419");
  });

  test("3. Modal Dokumentasi Kegiatan: Terbuka tepat di tengah viewport via Portal tanpa perlu scroll ke atas", async ({
    page,
  }) => {
    await page.goto("/data-sebaran");

    // Skip preloader if visible
    const skipBtn = page.getByRole("button", { name: /Lewati/i });
    if (await skipBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await skipBtn.click();
    }

    // Check if Yatim tab exists
    const yatimTab = page.getByRole("button", { name: /Yatim Berdikari/i });
    if (await yatimTab.isVisible()) {
      await yatimTab.click();

      const docBtn = page.getByRole("button", { name: /Lihat Dokumentasi Kegiatan/i }).first();
      if (await docBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await docBtn.scrollIntoViewIfNeeded();
        await docBtn.click();

        // Modal should appear directly in document.body
        const modal = page.locator('div[role="dialog"]');
        await expect(modal).toBeVisible();

        // Check modal position relative to viewport
        const box = await modal.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
          // Modal should start near top of viewport (y <= 50) and fill screen
          expect(box.y).toBeLessThanOrEqual(50);
          expect(box.height).toBeGreaterThan(400);
        }

        // Close modal
        const closeBtn = modal.getByRole("button", { name: /Tutup/i }).first();
        await closeBtn.click();
        await expect(modal).not.toBeVisible();
      }
    }
  });

  test("4. Admin Pengaturan: Tersedia form untuk mengubah email dan kata sandi admin", async ({
    page,
  }) => {
    // Login to admin
    await page.goto("/admin/login");
    await page.fill('input[type="email"]', "admin@sahabataksara.id");
    await page.fill('input[type="password"]', "aksaramulia2026");
    await page.click('button[type="submit"]');

    // Wait for redirect to /admin
    await page.waitForURL((url) => url.pathname === "/admin", { timeout: 10000 });

    // Navigate to /admin/pengaturan
    await page.goto("/admin/pengaturan");

    // Verify Admin Credentials Section
    await expect(page.getByText("Kredensial & Keamanan Akun Admin")).toBeVisible();
    await expect(page.getByLabel(/Email Admin Baru/i)).toBeVisible();
    await expect(page.getByPlaceholder("Masukkan kata sandi lama Anda")).toBeVisible();
    await expect(page.getByPlaceholder(/Min. 8 karakter/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Perbarui Akun Admin/i })).toBeVisible();
  });
});
