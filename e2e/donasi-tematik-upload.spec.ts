import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

test.describe("Donasi Tematik Photo Upload E2E", () => {
  const testImagePath = path.join(process.cwd(), "e2e", "test-assets", "sample-donasi.png");

  test.beforeAll(() => {
    const dir = path.dirname(testImagePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(testImagePath)) {
      // 1x1 transparent png
      const base64Png =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      fs.writeFileSync(testImagePath, Buffer.from(base64Png, "base64"));
    }
  });

  test("Upload foto cover pada kampanye donasi tematik berhasil disimpan dan tampil", async ({
    page,
  }) => {
    // 1. Login admin
    await page.goto("/admin/login");
    await page.fill('input[type="email"]', "admin@sahabataksara.id");
    await page.fill('input[type="password"]', "aksaramulia2026");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => url.pathname === "/admin");

    // 2. Go to donasi-tematik page
    await page.goto("/admin/donasi-tematik");

    // 3. Open modal
    const addBtn = page.getByRole("button", { name: /Tambah Kampanye/i }).first();
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // 4. Fill form
    const uniqueTitle = `Bencana Uji E2E ${Date.now()}`;
    await page.fill('input[placeholder*="Contoh: Tanggap Gempa"]', uniqueTitle);
    await page.fill('input[placeholder*="Contoh: Cianjur"]', "Kab. Sukabumi");
    await page.fill('input[placeholder*="Contoh: 50000000"]', "25000000");
    await page.fill('textarea[placeholder*="Jelaskan kebutuhan"]', "Bantuan logistik mushaf dan sembako darurat.");

    // 5. Upload photo
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(testImagePath);

    // 6. Submit
    const submitBtn = page.locator('form').getByRole("button", { name: "Tambah Kampanye" });
    await submitBtn.click();

    // 7. Verify success notification and card visible
    await expect(page.getByText(`berhasil ditambahkan`)).toBeVisible({ timeout: 15000 });
    const card = page.locator(`text=${uniqueTitle}`).first();
    await expect(card).toBeVisible();

    // 8. Delete test campaign to keep data clean
    const deleteBtn = page.locator(`div:has-text("${uniqueTitle}") button[title="Hapus Kampanye"]`).last();
    page.once("dialog", (dialog) => dialog.accept());
    await deleteBtn.click();
    await expect(page.getByText(`berhasil dihapus`)).toBeVisible({ timeout: 10000 });
  });
});
