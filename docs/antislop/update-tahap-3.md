# LAPORAN DELIVERY GATE — TAHAP 3: INTRO ANIMASI LOADING ±3 DETIK

**Mode**: `antislop active: during`  
**Status Delivery Gate**: ✅ **PASS** (13/13 pengujian Playwright E2E lolos, 0 error lint, build 33/33 route sukses)  
**Tanggal**: 4 November 2026  

---

## 1. Spesifikasi Teknis Animasi & Urutan Timeline
Intro animasi loading di [`Preloader.tsx`](file:///e:/syauqi/web-yayasan/src/components/motion/Preloader.tsx) berdurasi tepat ~3.0 detik dengan ritme sinematik menggunakan GSAP:
1. **0.0s – 0.85s**:
   - **Cincin Ganda Emas Konsentris**: Lingkaran luar (r=88 px, stroke 2 px `var(--gold-400)`) dan lingkaran dalam (r=81 px, stroke 1.2 px `var(--gold-500)`) menggambar dirinya menggunakan `strokeDashoffset` (560 dan 510).
2. **0.5s – 1.5s**:
   - **Simbol Visual Logo Filosofis (Docx Baru)**:
     - **Dua Telapak Tangan Memangku** (`palmsRef`): Menggambarkan kasih sayang dan perlindungan `khalifah fil ardh`.
     - **Siluet Mushaf / Buku Terbuka** (`bookRef`): Melambangkan Al-Qur'an dan keterbukaan ilmu pengetahuan.
     - **Globe / Bumi** (`globeRef`): Lingkaran bumi dengan garis bujur dan meridian emas di tengah.
     - **Tunas Muda Bertumbuh** (`sproutRef`): Batang dan daun tunas tumbuh mekar dari puncak bumi dengan animasi elastis, melambangkan generasi penerus dan regenerasi kebaikan.
3. **1.3s – 2.15s**:
   - **Tipografi & Identitas Lembaga**:
     - Judul `"Sahabat Aksara"` melayang masuk dengan font serif Fraunces.
     - Akronim huruf `"A • K • S • A • R • A"` meregang dengan letter-spacing elegan.
     - Tagline filosofis: `"Spiritual • Sosial • Pendidikan • Teknologi"`.
4. **2.15s – 2.3s**:
   - Konten emblem memudar halus (`opacity: 0, y: -15`).
5. **2.3s – 3.0s**:
   - **Tirai Hijau Menyapu ke Atas (Wipe Up)**: Layar penuh hijau tua `bg-[var(--green-950)]` menyapu ke atas (`yPercent: -100`, ease: `"power4.inOut"`) secara megah mengungkap beranda berlatar krem.

---

## 2. Fitur Interaksi, Guarding, & Aksesibilitas
1. **Guard Session Storage Aman**:
   - Di-guard dengan blok `try / catch` saat pembacaan dan penyimpanan `sessionStorage.getItem("sahabat_aksara_visited")` agar tidak crash pada lingkungan private browsing.
   - Sekali dilihat, preloader **tidak akan muncul lagi** saat refresh atau berpindah halaman dalam tab yang sama.
2. **Tombol "Lewati"**:
   - Posisi `fixed top-5 right-5` (z-index 100000).
   - Target sentuh memenuhi standar WCAG (≥ 44 px, `min-w-[44px] min-h-[44px]`).
   - Saat diklik: seketika mematikan GSAP timeline (`tl.kill()`), menyapu tirai naik dalam 300 ms, menyimpan flag `sessionStorage`, dan memfokuskan konten utama.
3. **Penghormatan `prefers-reduced-motion`**:
   - Mendeteksi `window.matchMedia("(prefers-reduced-motion: reduce)").matches`.
   - Mengganti animasi gerak 3.0 detik dengan transisi fade lembut 300 ms tanpa transform, mencegah disorientasi pada pengguna sensitif vestibular motion.
4. **Manajemen Fokus Aksesibilitas**:
   - Begitu intro selesai, fokus keyboard dipindahkan otomatis ke elemen `<main id="main-content">` dengan `{ preventScroll: true }`, sehingga pengguna screen reader dan keyboard langsung berada pada konten utama tanpa jebakan fokus.

---

## 3. Hasil Verifikasi Playwright E2E (`e2e/preloader.spec.ts`)
```text
Running 4 tests using 1 worker

  ok 1 [chromium] › 1. Kunjungan pertama: Preloader tampil dengan emblem & tirai wipe-up (selesai ~3.0 dtk) (4.5s)
  ok 2 [chromium] › 2. Refresh dalam tab yang sama: Preloader TIDAK muncul lagi (sessionStorage guard) (1.8s)
  ok 3 [chromium] › 3. Tombol 'Lewati' langsung menutup preloader dan menyimpan flag sessionStorage (2.6s)
  ok 4 [chromium] › 4. Mode prefers-reduced-motion: Transisi instan (~300ms fade sederhana) tanpa animasi 3 dtk (2.2s)

  4 passed (14.9s)
```

**Hasil Total Pengujian Seluruh Rangkaian E2E**: 13/13 PASS (27.4s).
- `e2e/storage-upload.spec.ts`: 4/4 PASS
- `e2e/capture-tahap-2.spec.ts`: 5/5 PASS
- `e2e/preloader.spec.ts`: 4/4 PASS

---

## 4. Kepatuhan Aturan Anti-Slop (R-xx)
- **R-08 (Motion with Purpose)**: Preloader memiliki durasi yang ketat (3.0s), menceritakan filosofi visual logo resmi (cincin ganda, telapak tangan, mushaf, bumi, tunas), bukan sekadar lingkaran berputar generik.
- **R-04 (Accessibility)**: Tombol Lewati memiliki touch target ≥ 44 px; reduced-motion didukung penuh; fokus dialihkan ke main landmark.
- **R-06 (No Persistent Distraction)**: Dibatasi satu kali per sesi menggunakan `sessionStorage`.

---
**Rekomendasi**: Tahap 3 telah tuntas dan terverifikasi penuh. Siap melanjutkan ke **TAHAP 4: Tabel Data Sebaran (tab default Infak, tabel responsif kartu, filter GSAP Flip, tanpa pre-filled query, pagination server-friendly)** setelah persetujuan owner.

