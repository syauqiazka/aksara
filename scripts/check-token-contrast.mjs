/**
 * Script untuk memverifikasi kontras warna token DESIGN.md sesuai standar WCAG AA.
 * Dijalankan sebagai bagian dari 'pnpm lint'.
 */

function luminance(hex) {
  const rgb = hex
    .replace('#', '')
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16) / 255)
    .map((val) => (val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrastRatio(hex1, hex2) {
  const lum1 = luminance(hex1);
  const lum2 = luminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const tokens = {
  green950: '#06210F',
  green900: '#0C3A18',
  green800: '#114A1C',
  green700: '#1A5F2A',
  green600: '#2C7A3F',
  gold300: '#EAD58A',
  gold400: '#E0BF4F',
  gold500: '#D4AF37',
  gold600: '#B8922A',
  gold700: '#8A6A12',
  cream50: '#FBF8EF',
  cream100: '#F5EFDD',
  cream200: '#EBE2C8',
  sage100: '#E4EDDF',
  sage300: '#B5CBAD',
  sage500: '#6F9269',
  teal600: '#1F7A74',
  terracotta500: '#C8793F',
  ink900: '#14231A',
  ink600: '#3E5246',
  ink400: '#6B7C71',
};

// Pasangan token resmi dari DESIGN.md
const pairings = [
  // 1. Teks di atas latar krim/terang (Body & Subheadings)
  { name: 'ink-900 di atas cream-50 (Body Text)', fg: tokens.ink900, bg: tokens.cream50, min: 4.5 },
  { name: 'ink-600 di atas cream-50 (Secondary Text)', fg: tokens.ink600, bg: tokens.cream50, min: 4.5 },
  { name: 'green-800 di atas cream-50 (Brand Text)', fg: tokens.green800, bg: tokens.cream50, min: 4.5 },
  { name: 'green-700 di atas cream-50 (Link Text)', fg: tokens.green700, bg: tokens.cream50, min: 4.5 },
  { name: 'gold-700 di atas cream-50 (Teks Aksen Emas Normal)', fg: tokens.gold700, bg: tokens.cream50, min: 4.5 },
  { name: 'gold-700 di atas cream-100 (Teks Aksen Emas Bold/Heading)', fg: tokens.gold700, bg: tokens.cream100, min: 3.0 },
  { name: 'ink-900 di atas cream-100 (Body Text)', fg: tokens.ink900, bg: tokens.cream100, min: 4.5 },
  { name: 'ink-600 di atas cream-100 (Secondary Text)', fg: tokens.ink600, bg: tokens.cream100, min: 4.5 },

  // 2. Teks di atas latar hijau gelap (hero / dark sections)
  { name: 'cream-50 di atas green-950 (Body Text)', fg: tokens.cream50, bg: tokens.green950, min: 4.5 },
  { name: 'cream-100 di atas green-950 (Secondary Text)', fg: tokens.cream100, bg: tokens.green950, min: 4.5 },
  { name: 'gold-300 di atas green-950 (Display Text)', fg: tokens.gold300, bg: tokens.green950, min: 4.5 },
  { name: 'gold-400 di atas green-950 (Aksen Emas)', fg: tokens.gold400, bg: tokens.green950, min: 4.5 },
  { name: 'sage-300 di atas green-950 (Muted Text)', fg: tokens.sage300, bg: tokens.green950, min: 4.5 },
  { name: 'cream-50 di atas green-900', fg: tokens.cream50, bg: tokens.green900, min: 4.5 },
  { name: 'gold-300 di atas green-900', fg: tokens.gold300, bg: tokens.green900, min: 4.5 },
  { name: 'gold-400 di atas green-900', fg: tokens.gold400, bg: tokens.green900, min: 4.5 },
  { name: 'gold-500 di atas green-950 (Large Text / UI Component)', fg: tokens.gold500, bg: tokens.green950, min: 3.0 },
];

let failed = 0;
console.log('--- Verifikasi Kontras Token Desain (WCAG AA) ---');

for (const p of pairings) {
  const ratio = contrastRatio(p.fg, p.bg);
  const pass = ratio >= p.min;
  const status = pass ? '✓ PASS' : '✗ FAIL';
  console.log(`${status} [${ratio.toFixed(2)}:1 >= ${p.min}:1] ${p.name}`);
  if (!pass) failed++;
}

if (failed > 0) {
  console.error(`\nKontras token gagal: ${failed} pasangan tidak memenuhi standar WCAG AA.`);
  process.exit(1);
} else {
  console.log(`\nSemua ${pairings.length} pasangan token resmi lolos standar WCAG AA!\n`);
}
