# AGENTS.md — Website Yayasan Sahabat Aksara

Panduan untuk AI coding agent (dan developer) yang mengerjakan repo ini. Baca file ini **dan** `DESIGN.md` sebelum menulis kode apa pun. Kalau dua file bertentangan: keamanan & data (file ini) menang atas visual, visual (`DESIGN.md`) menang atas selera pribadi agent.

---

## 1. Ringkasan proyek

Website resmi **Yayasan Sahabat Aksara** (nama badan hukum di dokumen: Yayasan Ajirasa Aksara Semesta). Yayasan nirlaba dengan 4 pilar: Spiritual, Sosial, Pendidikan, Teknologi.

Website punya **dua sisi**:

| Sisi | URL | Siapa | Sifat |
|---|---|---|---|
| Publik | `/` dan halaman turunannya | Semua orang | Konten statis + data dinamis (read-only) |
| Admin | `/admin` | Pengurus yayasan | Login wajib, CRUD data, **tidak ada link menuju /admin di UI publik** |

**Konten statis** (di-hardcode di kode / MDX): profil, kisah founder, visi-misi, makna filosofis nama & logo, program, portofolio aplikasi.

**Konten dinamis** (diinput admin, tampil di publik):
1. **Data Sebaran Infak 1 Jt Al-Qur'an** (wajib)
2. **Data Sebaran Geber Masjid** (wajib)
3. Laporan Penyaluran Program (di docx disebut "bisa diinput admin")
4. Dokumentasi Program, Donasi Tematik (bencana), Rekening/Kontak/Medsos (disarankan dinamis, lihat §5)

Sumber konten: `Kerangka_Deskripsi_Website_Sahabat_Aksara.docx`. Teks dari docx adalah **draft** — lihat §11 untuk hal yang harus dikonfirmasi ke owner sebelum publish.

---

## 2. Tech stack (default — boleh diganti kalau owner minta)

- **Framework**: Next.js 15 (App Router) + TypeScript strict
- **Styling**: Tailwind CSS v4 + CSS variables dari `DESIGN.md` (token di `src/styles/tokens.css`)
- **Animasi**: GSAP 3 (`gsap`, `ScrollTrigger`, `SplitText`, `Flip`, `MotionPath`, `DrawSVG`), `@gsap/react` (`useGSAP`), **Lenis** untuk smooth scroll, **lottie-react** / `@lottiefiles/dotlottie-react` untuk Lottie
- **Backend**: Supabase (Postgres + Auth + Storage + Row Level Security)
- **Form & validasi**: React Hook Form + Zod (skema yang sama dipakai client & server)
- **Tabel admin**: TanStack Table
- **Peta sebaran**: MapLibre GL (tile gratis/OSM) atau SVG peta Indonesia custom — lihat `DESIGN.md` §9
- **Font**: `next/font` (self-host), lihat `DESIGN.md` §4
- **Deploy**: Vercel (atau VPS dengan Node) — env via `.env.local`, jangan commit

> Kalau agent ingin mengganti stack, tulis alasan di PR/commit dan update bagian ini.

### Perintah

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
pnpm lint           # eslint + tsc --noEmit
pnpm test           # vitest (util, skema zod)
pnpm e2e            # playwright (login admin, input data, tampil di publik)
pnpm db:types       # supabase gen types → src/lib/db/types.ts
```

Sebelum menyatakan tugas selesai: `pnpm lint && pnpm build` harus hijau.

---

## 3. Struktur folder

```
src/
  app/
    (public)/
      page.tsx                    # Beranda
      tentang/page.tsx            # Profil, Visi & Misi, Makna Filosofis (Nama & Logo)
      program/page.tsx
      program/[slug]/page.tsx
      portofolio/page.tsx
      data-sebaran/page.tsx       # tab: Infak 1 Jt Al-Qur'an | Geber Masjid
      laporan/page.tsx
      laporan/[slug]/page.tsx
      donasi/page.tsx             # Info donasi, rekening, kontak, medsos, mitra, donasi tematik
      dokumentasi/page.tsx
    admin/
      login/page.tsx
      (protected)/
        layout.tsx                # cek sesi + allowlist admin
        page.tsx                  # dashboard ringkas
        infak/…                   # list, new, [id]/edit
        geber-masjid/…
        laporan/…
        dokumentasi/…
        donasi-tematik/…
        pengaturan/…              # rekening, kontak, medsos, mitra
    api/                          # hanya jika perlu (upload signed URL, revalidate)
    robots.ts  sitemap.ts
  components/
    ui/                           # primitif (Button, Card, Badge, Input…)
    sections/                     # blok halaman publik
    motion/                       # wrapper animasi (Reveal, SplitHeading, Marquee, Magnetic…)
    admin/                        # komponen khusus admin
  content/                        # konten statis (ts/mdx): profil, visi-misi, program, portofolio
  lib/
    db/                           # klien supabase (server/browser), types, queries
    validation/                   # skema zod
    motion/                       # registrasi GSAP, Lenis, helper reduced-motion
    utils/
  styles/tokens.css  globals.css
public/
  images/                         # lihat §8 untuk pemetaan aset
  lottie/                         # file .json / .lottie
supabase/migrations/              # SQL migrasi (sumber kebenaran skema)
```

Aturan: halaman publik = **Server Components** sebisanya; hanya komponen animasi/interaktif yang `"use client"`.

---

## 4. Routing & akses

### Publik (menu utama navbar)
1. **Tentang Kami** — Profil, Kisah & Latar Belakang Founder, Fokus Pilar, Visi & Misi, Makna Filosofis Nama & Logo
2. **Program Lembaga**
3. **Portofolio Produk**
4. **Data Sebaran Donasi** — tabel/peta, data dari admin
5. **Laporan Penyaluran Program** — gaya laporan transparan (referensi: Yayasan Sahabat Yatim Indonesia), data dari admin
6. **Info Donasi & Dokumentasi Program**

> Docx menulis "5 menu utama" tetapi mendaftar 6. Implementasikan 6 dan konfirmasi ke owner (boleh digabung jadi 5 dengan menaruh Laporan di bawah Data Sebaran).

### Admin
- URL: `/admin` (redirect ke `/admin/login` jika belum login).
- **Tidak boleh** ada link ke `/admin` di navbar, footer, sitemap, atau robots yang menyebutnya secara eksplisit.
- Header `X-Robots-Tag: noindex, nofollow` + `<meta name="robots" content="noindex">` di seluruh `/admin/**`.
- Perlindungan di **tiga lapis** (jangan hanya andalkan "URL tersembunyi"):
  1. `middleware.ts`: tolak/redirect request `/admin/**` tanpa sesi valid.
  2. Layout server `(protected)/layout.tsx`: cek sesi **dan** email/ID ada di tabel `admin_users`.
  3. **RLS Postgres**: tulis/ubah/hapus hanya untuk admin; publik hanya `SELECT` baris `status = 'published'`.
- Login: Supabase Auth email + password. Tambahkan rate limit login, pesan error generik ("Email atau kata sandi salah"), tanpa registrasi publik (akun admin dibuat manual lewat dashboard Supabase/seed).
- Sesi: cookie httpOnly (pakai `@supabase/ssr`). Logout menghapus sesi.

---

## 5. Model data (Postgres)

Semua tabel dinamis punya: `id uuid pk`, `status text check (status in ('draft','published'))`, `created_at`, `updated_at`, `created_by`. Publik hanya melihat `published`.

### `infak_distributions` — Data Sebaran Infak 1 Jt Al-Qur'an
| Kolom | Catatan |
|---|---|
| `mushaf_no` int | "Mushaf ke-1", "ke-2", … (unik) |
| `donor_name` text | nama custom di cover mushaf (contoh di foto: "Inayah Binti Kartoni") |
| `show_donor_name` bool default **false** | tampilkan nama ke publik hanya jika donatur setuju; kalau false tampil "Hamba Allah" |
| `recipient_name` text | nama pesantren / masjid / madrasah penerima |
| `recipient_type` enum | `pesantren`, `masjid`, `madrasah`, `lainnya` |
| `province`, `city`, `district` text | untuk filter & peta |
| `lat`, `lng` numeric null | opsional, untuk titik peta |
| `distributed_at` date | tanggal penyaluran |
| `quantity` int default 1 | jumlah mushaf |
| `photo_url` text null | foto serah-terima |
| `notes` text null | |

### `geber_masjid_distributions` — Data Sebaran Geber Masjid
`mosque_name`, `province`, `city`, `district`, `address`, `lat`, `lng`, `activity_date`, `participants` int, `activity_notes`, `photo_urls text[]`, `status`.

### `reports` — Laporan Penyaluran Program
`slug`, `title`, `program` (enum: infak_alquran, geber_masjid, tasmi, pena_yatim, bela_berdikari, umkm, tematik), `period_start`, `period_end`, `summary`, `body` (markdown), `beneficiaries` int, `amount_idr` bigint null, `cover_url`, `gallery_urls text[]`, `pdf_url` null.

### Disarankan dinamis (Tier 2)
- `gallery_items` (Dokumentasi Program: `title`, `program`, `date`, `image_url`, `caption`)
- `themed_campaigns` (Donasi Tematik: `title`, `disaster_type`, `location`, `status` aktif/selesai, `description`, `cover_url`, `target_idr`, `collected_idr`)
- `site_settings` (key-value: rekening, kontak person, medsos, mitra)
- `admin_users` (`user_id`, `role`)

### Storage
Bucket `public-media` (baca publik) dan `admin-uploads` (draft). Batas upload 5 MB, hanya `image/jpeg|png|webp`, kompres & resize di sisi server/Edge sebelum disimpan (maks sisi panjang 2000 px, buat varian `webp`).

**Statistik beranda** (jumlah mushaf tersalurkan, masjid ter-bersihkan, provinsi terjangkau) dihitung dari query agregat atas tabel di atas — **jangan hardcode angka**.

---

## 6. Halaman Data Sebaran (fitur inti)

- Dua tab: **Infak 1 Jt Al-Qur'an** | **Geber Masjid**.
- Setiap tab: (a) angka ringkasan animasi, (b) peta/visual sebaran, (c) **tabel** dengan pencarian, filter provinsi/kota/tipe/tahun, sort, paginasi (server-side jika > 200 baris).
- Tabel responsif: di mobile berubah jadi kartu bertumpuk.
- Perubahan filter memakai GSAP Flip agar baris berpindah halus (lihat `DESIGN.md`).
- Data diambil server-side dengan revalidate: `revalidate = 60` **atau** `revalidateTag` dipanggil dari aksi admin saat simpan/publish agar publik langsung terbarui.
- Ekspor CSV hanya di admin.
- State kosong ("Belum ada data") dan state loading wajib didesain (skeleton, bukan spinner polos).

## 7. Admin — kebutuhan fungsional

- Dashboard: total mushaf, total masjid, draft menunggu publish, 5 entri terbaru.
- CRUD untuk tiap tabel dinamis: tabel + pencarian, form Zod, upload foto (drag & drop + preview), toggle `draft/published`, konfirmasi sebelum hapus (soft delete lebih baik).
- Bulk import CSV untuk Infak dan Geber (dengan pratinjau & laporan baris error) — sangat berguna karena data historis kemungkinan masih di spreadsheet.
- UI admin **boleh lebih sederhana dan tanpa animasi berat**, tetapi tetap memakai token warna/typography yang sama. Admin harus nyaman di laptop dan layak pakai di HP.
- Bahasa UI: **Bahasa Indonesia**.

---

## 8. Aset yang sudah ada

Salin dari folder `assets/` ke `public/images/` dengan nama ini. Gambar dioptimalkan lewat `next/image` (jangan pakai `<img>` mentah untuk foto besar).

| File | Dipakai di | Catatan |
|---|---|---|
| `logo-sahabat-aksara.jpg` (1024×1024) | Navbar, footer, favicon, OG image, loader | Latar hijau solid. **Minta/buat versi vektor (SVG) dan PNG transparan** — JPG tidak ideal untuk logo di atas latar lain. Sementara: tempel apa adanya di atas hijau `--green-900`, atau potong lingkaran. |
| `founder-ahmad-dahlan.jpg` (1204×1600, potret) | Bagian **Kisah & Latar Belakang Founder** | Crop potret 3:4 atau bingkai bentuk lengkung mihrab. Latar kayu/krem hangat sudah serasi dengan palet. |
| `infak-mushaf-custom.jpg` (896×1190) | Program **Infak 1 Jt Al-Qur'an Custom Nama** | Ini visualisasi mockup cover mushaf ("Donasi Infak dari: Inayah Binti Kartoni, Mushaf ke-1"). Pakai sebagai ilustrasi contoh custom nama; beri keterangan "Contoh cover". Idealnya nanti diganti foto produk asli. |
| `tasmi-30-juz-dokumentasi.jpg` (1195×896) | Program **Majlis Tasmi' Al-Qur'an 30 Juz** | Foto dokumentasi agak redup dan beresolusi sedang. Boleh diberi koreksi warna ringan + overlay hijau; **jangan di-upscale** atau dipakai full-bleed hero layar besar tanpa overlay. Pakai ukuran kartu/split-section. |

Foto yang menampilkan wajah orang: pastikan ada izin penggunaan sebelum dipublikasikan.

---

## 9. Konvensi kode

- TypeScript `strict`; tidak ada `any` tanpa komentar alasan.
- Komponen: PascalCase, satu komponen per file. Hook/util: camelCase.
- Warna, spacing, radius, shadow, durasi & easing **hanya dari token** (`DESIGN.md`). Dilarang hex/ms/px acak di komponen.
- Teks konten statis di `src/content/`, bukan tersebar di JSX.
- Aksesibilitas: HTML semantik, satu `<h1>` per halaman, fokus terlihat, kontras AA, `alt` bermakna, navigasi keyboard di navbar/tab/tabel.
- SEO: `generateMetadata` per halaman, OG image, JSON-LD `Organization` (+ `NGO`), sitemap tanpa `/admin`.
- Bahasa: konten & UI **Bahasa Indonesia**; istilah Arab ditulis konsisten (Al-Qur'an, Tasmi', Mushaf, Infak). Teks Arab memakai font Arab (lihat `DESIGN.md`) dan `dir="rtl"`/`lang="ar"` pada elemennya.
- Commit kecil, pesan jelas (`feat(data-sebaran): filter provinsi`).

### Aturan animasi (ringkas — detail di `DESIGN.md` §8–10)
- Semua GSAP dibuat di dalam `useGSAP()` dengan `scope` ref → otomatis cleanup. Jangan ada `ScrollTrigger` yatim.
- Daftarkan plugin sekali di `lib/motion/register.ts`.
- Hormati `prefers-reduced-motion`: gunakan `gsap.matchMedia()`; di mode reduce, ganti dengan fade singkat/tanpa gerak.
- Animasikan **hanya** `transform` dan `opacity` (plus `clip-path`/`filter` seperlunya). Jangan animasikan `width/height/top/left`.
- Lottie: lazy-load (`dynamic import`), pause saat di luar viewport, file ≤ 150 KB per animasi.
- Konten penting tidak boleh bergantung pada animasi untuk terbaca (SSR harus menghasilkan konten terlihat; animasi masuk adalah peningkatan, bukan syarat).

---

## 10. Kualitas & performa (definisi "selesai")

- Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95.
- LCP < 2.5 dtk, CLS < 0.1, INP < 200 ms — animasi "gila" tidak boleh mengorbankan ini.
- Anggaran JS awal halaman beranda ≤ ~250 KB gzip (GSAP plugin & Lottie di-split per section).
- Uji manual di Chrome, Safari iOS, dan HP Android kelas menengah. 60 fps saat scroll.
- Tes e2e minimum: login salah/benar, tambah entri draft → tidak tampil di publik → publish → tampil di publik, `/admin` tanpa login → redirect.

## 11. Hal yang HARUS dikonfirmasi owner (jangan ditebak agent)

1. **Nama badan hukum**: docx menulis "Yayasan Ajirasa Akasara Semesta / Ajirasa Aksara Semesta", dan satu kali "Sahabat Alam SemestaQu". Mana nama resmi? Disarankan pakai satu nama resmi + "Sahabat Aksara" sebagai nama brand.
2. **Tanggal**: "resmi berdiri 28 September 2026" tetapi Akta Pendirian tertanggal 15 Januari 2024 dan SK Kemenkumham "Tahun 2026"; kisah founder menyebut "akhir tahun 2026". Perlu diluruskan.
3. **NPWP** (`827382389`) — apakah boleh tampil publik? Format NPWP biasanya 15/16 digit; nomor ini tampak belum lengkap.
4. Harga Infak: judul "1 Jt" tapi isi menyebut **Rp 200.000** per mushaf. Maksud "1 Jt" = target 1 juta mushaf? Pastikan wording agar tidak membingungkan donatur.
5. Rekening yayasan, kontak person, akun medsos, daftar mitra (belum ada di docx).
6. Apakah nama donatur boleh ditampilkan publik (default: tidak, `show_donor_name = false`).
7. Foto founder dan foto dokumentasi: izin publikasi.
8. Tautan unduh/Play Store tiap aplikasi di Portofolio (KajianQu, Bank Saku Digital, DiaryQu, E-AbsensiQu, DKM MasjidQu, SapawargaQu).
9. Typo di docx yang perlu dirapikan sebelum tayang (mis. "seluuh", "berdesikasi", "Indinesia", "tanggal bencana alam" → "tanggap bencana alam", "Contac Person").

## 12. Jangan lakukan

- Jangan menaruh secret/service-role key di client atau di repo.
- Jangan membuat tautan ke `/admin` di UI publik.
- Jangan hardcode angka statistik atau data sebaran.
- Jangan pakai palet/ font di luar `DESIGN.md` tanpa memperbaruinya.
- Jangan menyalin teks/aset desain dari situs yayasan lain; referensi hanya untuk **pola** (struktur, ritme animasi), bukan salinan.
- Jangan mengubah isi doktrin/teks keagamaan (ayat, istilah) tanpa persetujuan owner.
