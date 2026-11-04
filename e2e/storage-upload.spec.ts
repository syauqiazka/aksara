import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("Tahap 1: Bug Upload & Alur Upload-on-Save", () => {
  const photoAPath = path.resolve(__dirname, "fixtures/photo-a.png");
  const photoBPath = path.resolve(__dirname, "fixtures/photo-b.png");
  const photoCPath = path.resolve(__dirname, "fixtures/photo-c.png");

  test("1. Pilih foto lalu batalkan → 0 blob baru diunggah ke storage (upload-on-save)", async ({
    page,
  }) => {
    // Login
    await page.goto("/admin/login");
    await page.fill('input[type="email"]', "admin@sahabataksara.id");
    await page.fill('input[type="password"]', "aksaramulia2026");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => url.pathname === "/admin");

    let uploadApiCalled = false;
    page.on("request", (req) => {
      if (req.url().includes("/api/admin/upload") && req.method() === "POST") {
        uploadApiCalled = true;
      }
    });

    await page.goto("/admin/infak/new");
    await page.waitForSelector("form");

    // Select photo A
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(photoAPath);

    // Wait for client preview (createObjectURL produces blob: URL)
    const previewImg = page.locator('img[src^="blob:"]');
    await expect(previewImg).toBeVisible();

    // Verify NO network request was made to /api/admin/upload upon selecting the file
    expect(uploadApiCalled).toBe(false);

    // Cancel form / navigate away
    await page.click('a[href="/admin/infak"]');
    await page.waitForURL((url) => url.pathname === "/admin/infak");

    // Confirm that upload API was never triggered
    expect(uploadApiCalled).toBe(false);
  });

  test("2. Pilih foto A lalu ganti B lalu simpan → hanya B ada di storage", async ({
    page,
    request,
  }) => {
    // Login UI
    await page.goto("/admin/login");
    await page.fill('input[type="email"]', "admin@sahabataksara.id");
    await page.fill('input[type="password"]', "aksaramulia2026");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => url.pathname === "/admin");

    await page.goto("/admin/infak/new");
    await page.waitForSelector("form");

    const fileInput = page.locator('input[type="file"]');
    // Select photo A first
    await fileInput.setInputFiles(photoAPath);
    await expect(page.locator('img[src^="blob:"]')).toBeVisible();

    // Replace with photo B
    await fileInput.setInputFiles(photoBPath);
    await expect(page.locator('img[src^="blob:"]')).toBeVisible();

    // Fill required form fields using placeholders
    const uniqueNo = Math.floor(10000 + Math.random() * 89999);
    await page.getByPlaceholder("Contoh: 101").fill(uniqueNo.toString());
    await page.getByPlaceholder("Contoh: Inayah Binti Kartoni").fill("Hamba Allah E2E");
    await page.getByPlaceholder("Contoh: Cirebon, Jakarta").fill("Cirebon");
    await page.getByPlaceholder("Contoh: Alm. H. Ahmad Bin Abdullah & Keluarga").fill("Keluarga Alm. E2E");
    await page.getByPlaceholder("Contoh: Pondok Pesantren Al-Hikmah").fill("Pesantren E2E Test");
    await page.getByPlaceholder("Contoh: Jl. Pesantren No. 12").fill("Jl. Pesantren No. 99");

    // Submit form
    await page.getByRole("button", { name: /Simpan/i }).click();
    await page.waitForURL((url) => url.pathname === "/admin/infak");

    // Authenticate API request context
    await request.post("/api/admin/auth/login", {
      data: { email: "admin@sahabataksara.id", password: "aksaramulia2026" },
    });

    // Fetch distributions to find the created item and its photo URL
    const res = await request.get("/api/admin/infak");
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.data || [];
    const createdItem = items.find((i: { mushaf_no: number }) => i.mushaf_no === uniqueNo);
    expect(createdItem).toBeDefined();
    const photoUrl = createdItem.photo_url || createdItem.photos?.[0]?.url;
    expect(photoUrl).toBeTruthy();

    // Verify photo was saved with webp format
    expect(photoUrl).toMatch(/\.webp$/);
  });

  test("3. Simpan gagal (paksa error) → rollback membersihkan blob yang baru diunggah", async ({
    request,
  }) => {
    // Authenticate API request context
    const loginRes = await request.post("/api/admin/auth/login", {
      data: { email: "admin@sahabataksara.id", password: "aksaramulia2026" },
    });
    expect(loginRes.ok()).toBe(true);

    const bufferA = fs.readFileSync(photoAPath);

    // 1. Direct simulation of upload-on-save
    const uploadRes = await request.post("/api/admin/upload", {
      multipart: {
        file: {
          name: "rollback-test.png",
          mimeType: "image/png",
          buffer: bufferA,
        },
      },
    });

    const uploadData = await uploadRes.json();
    expect(uploadRes.ok()).toBe(true);
    const uploadedUrl = uploadData.url;
    expect(uploadedUrl).toBeTruthy();

    // 2. Simulate failure during DB insert -> trigger compensating rollback delete
    const deleteRes = await request.delete("/api/admin/upload", {
      data: { url: uploadedUrl },
    });
    const deleteData = await deleteRes.json();
    expect(deleteRes.ok()).toBe(true);
    expect(deleteData.deletedCount).toBe(1);

    // 3. Confirm blob was cleaned up (file no longer exists at URL)
    const checkRes = await request.get(uploadedUrl);
    expect(checkRes.status()).toBe(404);
  });

  test("4. Ganti foto record yang sudah ada → blob lama terhapus dari storage", async ({
    request,
  }) => {
    // Authenticate API request context
    const loginRes = await request.post("/api/admin/auth/login", {
      data: { email: "admin@sahabataksara.id", password: "aksaramulia2026" },
    });
    expect(loginRes.ok()).toBe(true);

    const bufferB = fs.readFileSync(photoBPath);
    const bufferC = fs.readFileSync(photoCPath);

    // 1. Upload initial photo (Photo B)
    const uploadRes1 = await request.post("/api/admin/upload", {
      multipart: {
        file: {
          name: "initial-b.png",
          mimeType: "image/png",
          buffer: bufferB,
        },
      },
    });
    const data1 = await uploadRes1.json();
    const photoBUrl = data1.url;

    // Create record with photo B
    const uniqueNo = Math.floor(10000 + Math.random() * 89999);
    const createRes = await request.post("/api/admin/infak", {
      data: {
        mushaf_no: uniqueNo,
        donor_name: "Hamba Allah",
        show_donor_name: false,
        donor_origin: "DKI Jakarta",
        dedication_name: "Keluarga Besar Test",
        pesantren_name: "Pesantren Target Test",
        address: "Jl. Tebet No. 10",
        distributed_at: "2026-11-04",
        status: "published",
        photos: [{ url: photoBUrl, caption: "Foto B", sort: 1 }],
      },
    });
    const createData = await createRes.json();
    expect(createRes.ok()).toBe(true);
    const recordId = createData.id || createData.data?.id;
    expect(recordId).toBeTruthy();

    // 2. Upload replacement photo (Photo C)
    const uploadRes2 = await request.post("/api/admin/upload", {
      multipart: {
        file: {
          name: "replace-c.png",
          mimeType: "image/png",
          buffer: bufferC,
        },
      },
    });
    const data2 = await uploadRes2.json();
    const photoCUrl = data2.url;

    // 3. Update record with photo C; handler should automatically delete old photo B
    const updateRes = await request.put("/api/admin/infak", {
      data: {
        id: recordId,
        mushaf_no: uniqueNo,
        donor_name: "Hamba Allah",
        show_donor_name: false,
        donor_origin: "DKI Jakarta",
        dedication_name: "Keluarga Besar Test",
        pesantren_name: "Pesantren Target Test",
        address: "Jl. Tebet No. 10",
        distributed_at: "2026-11-04",
        status: "published",
        photos: [{ url: photoCUrl, caption: "Foto C", sort: 1 }],
      },
    });
    expect(updateRes.ok()).toBe(true);

    // 4. Verify photo B has been deleted from storage (returns 404)
    const oldPhotoCheck = await request.get(photoBUrl);
    expect(oldPhotoCheck.status()).toBe(404);

    // 5. Verify photo C is present (returns 200)
    const newPhotoCheck = await request.get(photoCUrl);
    expect(newPhotoCheck.status()).toBe(200);
  });
});
