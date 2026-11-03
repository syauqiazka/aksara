import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve("docs/antislop/audit/screenshots");

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const PUBLIC_PAGES = [
  { name: "01-home", path: "/" },
  { name: "02-tentang", path: "/tentang" },
  { name: "03-program", path: "/program" },
  { name: "04-program-detail", path: "/program/infak-alquran" },
  { name: "05-portofolio", path: "/portofolio" },
  { name: "06-data-sebaran", path: "/data-sebaran" },
  { name: "07-laporan", path: "/laporan" },
  { name: "08-laporan-detail", path: "/laporan/penyaluran-mushaf-ramadhan-1447h" },
  { name: "09-donasi", path: "/donasi" },
  { name: "10-admin-login", path: "/admin/login" },
];

const ADMIN_PAGES = [
  { name: "11-admin-dashboard", path: "/admin" },
  { name: "12-admin-infak", path: "/admin/infak" },
  { name: "13-admin-geber-masjid", path: "/admin/geber-masjid" },
  { name: "14-admin-laporan", path: "/admin/laporan" },
  { name: "15-admin-pengaturan", path: "/admin/pengaturan" },
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 1. Capture Public Pages
  for (const p of PUBLIC_PAGES) {
    const url = `http://localhost:3000${p.path}`;
    console.log(`Capturing ${p.name} from ${url}...`);

    // Desktop 1440
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({
      path: path.join(OUT_DIR, `${p.name}-desktop-1440.png`),
      fullPage: true,
    });

    // Mobile 390
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({
      path: path.join(OUT_DIR, `${p.name}-mobile-390.png`),
      fullPage: true,
    });
  }

  // 2. Set Admin Cookie
  const payload = {
    email: "admin@sahabataksara.id",
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  const token = Buffer.from(JSON.stringify(payload)).toString("base64");
  await page.setCookie({
    name: "sahabat_aksara_admin_session",
    value: token,
    domain: "localhost",
    path: "/",
    httpOnly: true,
  });

  // 3. Capture Admin Pages
  for (const p of ADMIN_PAGES) {
    const url = `http://localhost:3000${p.path}`;
    console.log(`Capturing Admin ${p.name} from ${url}...`);

    // Desktop 1440
    await page.setViewport({ width: 1440, height: 900, isMobile: false });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({
      path: path.join(OUT_DIR, `${p.name}-desktop-1440.png`),
      fullPage: true,
    });

    // Mobile 390
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({
      path: path.join(OUT_DIR, `${p.name}-mobile-390.png`),
      fullPage: true,
    });
  }

  await browser.close();
  console.log("All screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});

