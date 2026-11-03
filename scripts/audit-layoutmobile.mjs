import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const viewports = [
  { name: 'mobile-small', width: 360, height: 740 },
  { name: 'mobile-standard', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop-small', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
];

const testRoutes = [
  '/',
  '/tentang',
  '/program',
  '/program/infak-alquran',
  '/portofolio',
  '/data-sebaran',
  '/laporan',
  '/donasi',
  '/admin/login',
  '/admin',
  '/admin/infak',
  '/admin/geber-masjid',
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Set admin session cookie
  const payload = {
    email: 'admin@sahabataksara.id',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  const token = Buffer.from(JSON.stringify(payload)).toString('base64');
  await page.setCookie({
    name: 'sahabat_aksara_admin_session',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  const findings = [];

  for (const vp of viewports) {
    console.log(`\n--- Menguji Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.width < 768 });

    for (const route of testRoutes) {
      const url = `http://localhost:3000${route}`;
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 12000 });
        await new Promise((r) => setTimeout(r, 400));

        // 1. Check Horizontal Overflow
        const overflow = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const bodyWidth = document.body.scrollWidth;
          const maxW = Math.max(docWidth, bodyWidth);
          return {
            hasOverflow: maxW > winWidth + 1,
            diff: maxW - winWidth,
            scrollWidth: maxW,
            innerWidth: winWidth,
          };
        });

        if (overflow.hasOverflow) {
          findings.push({
            type: 'HORIZONTAL_OVERFLOW',
            viewport: `${vp.name} (${vp.width}px)`,
            route,
            detail: `Lebar dokumen ${overflow.scrollWidth}px melebihi viewport ${overflow.innerWidth}px (overflow: +${overflow.diff}px)`,
          });
        }

        // 2. Check Under-Sized Tap Targets (< 44x44 px) on Mobile
        if (vp.width <= 768) {
          const smallTargets = await page.evaluate(() => {
            const clickable = Array.from(document.querySelectorAll('a, button, input, select'));
            const bad = [];
            for (const el of clickable) {
              const rect = el.getBoundingClientRect();
              // Check if visible
              if (rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight * 3) {
                if (rect.width < 44 || rect.height < 44) {
                  // Ignore inline text links inside paragraphs
                  const isInlineText = el.tagName === 'A' && el.parentElement?.tagName === 'P';
                  if (!isInlineText) {
                    bad.push({
                      tag: el.tagName,
                      text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30),
                      width: Math.round(rect.width),
                      height: Math.round(rect.height),
                    });
                  }
                }
              }
            }
            return bad.slice(0, 5); // report top 5 per page
          });

          if (smallTargets.length > 0) {
            findings.push({
              type: 'UNDERSIZED_TAP_TARGET',
              viewport: `${vp.name} (${vp.width}px)`,
              route,
              detail: `Ditemukan ${smallTargets.length} target sentuh <44px (misal: ${smallTargets.map((t) => `${t.tag} '${t.text}' [${t.width}x${t.height}px]`).join(', ')})`,
            });
          }
        }
      } catch (err) {
        console.error(`Error pada ${route} @ ${vp.width}px:`, err.message);
      }
    }
  }

  await browser.close();

  console.log('\n=== HASIL AUDIT LAYOUTMOBILE (AUDIT-2) ===');
  console.log(`Total temuan layout mobile: ${findings.length}`);
  console.log(JSON.stringify(findings, null, 2));
}

run();

