import { test, expect } from "@playwright/test";

test.describe("Admin Bank Account Management & Public Visibility E2E", () => {
  test("Admin dapat menambah rekening bank baru dan tampil di halaman publik /donasi & homepage", async ({
    page,
  }) => {
    // 1. Login sebagai Admin
    await page.goto("/admin/login");
    await page.fill('input[type="email"]', "admin@sahabataksara.id");
    await page.fill('input[type="password"]', "aksaramulia2026");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => url.pathname === "/admin", { timeout: 10000 });

    // 2. Buka halaman pengaturan admin
    await page.goto("/admin/pengaturan");
    await expect(page.getByRole("heading", { name: "Pengaturan Situs Yayasan" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Rekening Bank Resmi").first()).toBeVisible();

    // 3. Tambah Rekening Bank Baru
    const addBankBtn = page.getByRole("button", { name: /Tambah Rekening Bank/i }).first();
    await expect(addBankBtn).toBeVisible();
    await addBankBtn.click();

    // 4. Isi data rekening yang baru ditambahkan (rekening terakhir)
    const testBankName = "Bank Syariah Indonesia (BSI)";
    const testAccountNumber = "7722334455";
    const testHolderName = "Yayasan Ajirasa Aksara Semesta";
    const testBranchName = "KC Cirebon Siliwangi";

    const bankNameInputs = page.locator('input[placeholder*="Bank BCA, Bank BSI"]');
    const lastBankNameInput = bankNameInputs.last();
    await lastBankNameInput.fill(testBankName);

    const bankNumberInputs = page.locator('input[placeholder*="1234567890"]');
    const lastBankNumberInput = bankNumberInputs.last();
    await lastBankNumberInput.fill(testAccountNumber);

    const bankHolderInputs = page.locator('input[placeholder*="Yayasan Ajirasa Aksara Semesta"]');
    const lastBankHolderInput = bankHolderInputs.last();
    await lastBankHolderInput.fill(testHolderName);

    const bankBranchInputs = page.locator('input[placeholder*="KC Cirebon"]');
    const lastBankBranchInput = bankBranchInputs.last();
    await lastBankBranchInput.fill(testBranchName);

    // 5. Simpan pengaturan
    const saveBtn = page.getByRole("button", { name: /Simpan Semua Pengaturan/i });
    await saveBtn.click();

    // Verifikasi pesan sukses
    await expect(
      page.getByText(/Daftar rekening bank dan informasi kontak resmi berhasil disimpan/i)
    ).toBeVisible({ timeout: 10000 });

    // 6. Kunjungi halaman /donasi publik
    await page.goto("/donasi");
    await expect(page.getByText(testBankName)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(testAccountNumber)).toBeVisible();
    await expect(page.getByText(testHolderName).first()).toBeVisible();
    await expect(page.getByText(testBranchName)).toBeVisible();

    // 7. Kunjungi Homepage dan verifikasi kartu rekening
    await page.goto("/");
    await expect(page.getByText(testAccountNumber)).toBeVisible({ timeout: 10000 });
  });
});
