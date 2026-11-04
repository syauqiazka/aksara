# DESIGN.md — Sistem Desain Website Sahabat Aksara

Dokumen ini adalah sumber kebenaran visual & gerak. Semua nilai di sini harus diimplementasikan sebagai **design token** (`src/styles/tokens.css`), lalu dipakai lewat Tailwind/CSS variables.

---

## 1. Arah kreatif

**Konsep: "Cahaya di atas Zamrud."**
Emas yang hangat menyala di atas hijau zamrud yang dalam — persis logo — lalu "dinapaskan" oleh krem hangat dan hijau salam (sage) supaya mata tidak lelah. Hijau tua dipakai untuk momen sakral/dramatis (hero, kutipan, footer); krem untuk bagian membaca panjang & data; emas hanya sebagai **aksen yang disengaja**, bukan wallpaper.

**Karakter**: khidmat tapi hangat, modern tapi berakar (pola geometri Islami, kaligrafi, lembaran buku terbuka), transparan (data & laporan jadi pahlawan visual), penuh gerak namun tetap tenang.

**Yang dihindari (anti-"AI slop")**
- Gradasi ungu-biru, kartu kaca (glassmorphism) di mana-mana, emoji sebagai ikon, ilustrasi stok generik.
- Semua section memakai pola "judul tengah + 3 kartu ikon".
- Emas di atas krem untuk teks kecil (kontras buruk).
- Animasi yang sama diulang di setiap elemen (semua fade-up 20px).
- Kutipan palsu, angka palsu, testimoni karangan.

---

## 2. Palet warna

Diambil dari logo (hijau latar ≈ `#114A1C`, emas ≈ `#D4AF37`–`#C9A24A`) lalu dilengkapi warna pendamping.

### Inti brand
| Token | Hex | Pakai untuk |
|---|---|---|
| `--green-950` | `#06210F` | Latar paling gelap, footer, overlay teks di atas foto |
| `--green-900` | `#0C3A18` | Latar hero/section gelap |
| `--green-800` | `#114A1C` | **Hijau logo** — warna brand utama, tombol primer |
| `--green-700` | `#1A5F2A` | Hover tombol primer, tautan di krem |
| `--green-600` | `#2C7A3F` | Ikon, garis, chart sekunder |
| `--gold-300` | `#EAD58A` | Highlight, kilau, hover emas |
| `--gold-400` | `#E0BF4F` | Emas terang di atas hijau gelap (teks/ikon) |
| `--gold-500` | `#D4AF37` | **Emas logo** — aksen utama di atas hijau |
| `--gold-600` | `#B8922A` | Garis/ornamen di atas krem |
| `--gold-700` | `#8A6A12` | **Teks emas di atas krem** (lolos kontras) |

### Pendamping (agar nyaman dan tidak monoton)
| Token | Hex | Pakai untuk |
|---|---|---|
| `--cream-50` | `#FBF8EF` | Latar halaman utama |
| `--cream-100` | `#F5EFDD` | Section selang-seling, kartu |
| `--cream-200` | `#EBE2C8` | Border halus, divider |
| `--sage-100` | `#E4EDDF` | Latar section sejuk, tabel zebra |
| `--sage-300` | `#B5CBAD` | Ilustrasi, pola, skeleton |
| `--sage-500` | `#6F9269` | Teks sekunder di atas gelap |
| `--teal-600` | `#1F7A74` | Aksen data/info & chart (membedakan seri) |
| `--terracotta-500` | `#C8793F` | Aksen hangat, badge, CTA sekunder (dari patch kulit mushaf) |
| `--terracotta-100` | `#F4E2D2` | Latar callout hangat |
| `--ink-900` | `#14231A` | Teks utama di atas krem (hijau-hitam, bukan hitam murni) |
| `--ink-600` | `#3E5246` | Teks sekunder |
| `--ink-400` | `#6B7C71` | Teks pendukung/placeholder (min. 16px) |

### Semantik
`--success #2C7A3F` · `--warning #C98A1B` · `--danger #B3382C` · `--info #1F7A74`

### Aturan pakai (proporsi per halaman)
- **60%** krem/putih hangat · **25%** hijau (gelap & sage) · **10%** emas · **5%** terracotta/teal.
- Teks di atas `--green-900/950`: `--cream-50` (isi) dan `--gold-400/500` (judul/aksen).
- Teks di atas krem: `--ink-900`; aksen teks: `--green-800` atau `--gold-700`. **Jangan** `--gold-500` untuk teks di atas krem.
- Gradien yang diizinkan: `green-950 → green-800` (vertikal), "kilau emas" `gold-600 → gold-300 → gold-600` hanya untuk garis/tombol/teks display besar.
- Kontras minimum WCAG AA (4.5:1 teks, 3:1 UI besar). Cek tiap kombinasi baru.

```css
:root{
  --green-950:#06210F; --green-900:#0C3A18; --green-800:#114A1C; --green-700:#1A5F2A; --green-600:#2C7A3F;
  --gold-300:#EAD58A; --gold-400:#E0BF4F; --gold-500:#D4AF37; --gold-600:#B8922A; --gold-700:#8A6A12;
  --cream-50:#FBF8EF; --cream-100:#F5EFDD; --cream-200:#EBE2C8;
  --sage-100:#E4EDDF; --sage-300:#B5CBAD; --sage-500:#6F9269;
  --teal-600:#1F7A74; --terracotta-500:#C8793F; --terracotta-100:#F4E2D2;
  --ink-900:#14231A; --ink-600:#3E5246; --ink-400:#6B7C71;
}
```

Mode gelap pengguna: **tidak wajib**. Situs sudah punya section gelap alami; fokus ke satu tema berkualitas.

---

## 3. Bentuk, jarak, elevasi

- **Grid**: container maks 1280 px, 12 kolom desktop / 4 kolom mobile, gutter 24/16 px.
- **Skala spasi (4 px base)**: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Jarak antar-section: 96–160 px desktop, 64–96 px mobile.
- **Radius**: `--r-sm 8px` (input), `--r-md 16px` (kartu), `--r-lg 28px` (panel besar), `--r-pill 999px`.
- **Bentuk khas — "lengkung mihrab"**: foto founder, kartu program utama, dan frame media memakai bentuk arch (atas melengkung, bawah rata). Ini signature visual; pakai konsisten tapi tidak berlebihan.
- **Ornamen**: pola geometri Islami (kisi bintang 8 sudut/khatam) dari garis tipis emas pada opacity 6–12% sebagai tekstur latar section gelap; satu aset SVG yang bisa di-tile.
- **Elevasi**: halus & hangat — `0 1px 2px rgba(20,35,26,.06)`, `0 12px 32px -12px rgba(12,58,24,.25)`. Di atas gelap pakai border emas 1 px opacity 30% alih-alih shadow.
- **Garis & divider**: garis ganda tipis emas (mengingat cincin ganda di logo) sebagai pemisah section penting.

---

## 4. Tipografi

| Peran | Font (Google Fonts, self-host via `next/font`) | Catatan |
|---|---|---|
| Display / judul | **Fraunces** (variable, opsz & SOFT) | Serif hangat berkarakter, selaras nuansa kaligrafi logo. Bobot 500–700 |
| Body & UI | **Plus Jakarta Sans** | Terbaca, ramah, dukungan bahasa Indonesia bagus |
| Arab | **Amiri** (isi) / **Scheherazade New** (ayat besar) | Ukuran minimal 1.25× teks Latin di sampingnya, `line-height` ≥ 2 |
| Data/angka | Plus Jakarta Sans dengan `font-variant-numeric: tabular-nums` | Angka tabel & counter rapi |

**Skala (fluid, `clamp`)**
| Token | Ukuran | Pakai |
|---|---|---|
| `display-xl` | clamp(3.2rem, 8vw, 7.5rem) | Judul hero |
| `display-lg` | clamp(2.4rem, 5vw, 4.5rem) | Judul section |
| `h2` | clamp(1.8rem, 3vw, 2.75rem) | |
| `h3` | clamp(1.35rem, 2vw, 1.75rem) | |
| `body-lg` | 1.125rem / 1.7 | Paragraf pengantar |
| `body` | 1rem / 1.7 | Isi |
| `caption` | 0.875rem / 1.5 | Keterangan; jangan di bawah 14 px |

Aturan: `letter-spacing` judul display −0.02em; eyebrow berupa teks polos tanpa bingkai pill, uppercase +0.14em, warna `--gold-700`/`--gold-400`. Paragraf maks ~68 karakter per baris. Judul besar selalu `text-wrap: balance`.

---

## 5. Komponen inti

- **Tombol**: primer (isi `--green-800`, teks krem, ikon panah) · emas (isi gradien emas, teks `--green-950`) untuk CTA donasi di atas gelap · sekunder (outline) · teks+garis bawah animasi. Tinggi 48–56 px, radius pill. State: hover (geser isi + kilau), fokus (ring emas 2 px + offset), disabled, loading.
- **Navbar**: transparan di atas hero gelap → solid krem/hijau setelah scroll (transisi halus). Logo kiri, 6 menu tengah, CTA "Donasi" kanan. Mobile: menu layar penuh hijau dengan stagger animasi. Tidak ada link ke admin.
- **Kartu program**: bentuk arch di atas untuk media, judul Fraunces, tag pilar, panah. Hover: gambar zoom 1.06, garis emas menjalar di tepi.
- **Stat counter**: angka besar Fraunces emas, label kecil krem; hitung naik saat masuk viewport.
- **Tabel data sebaran**: header hijau tua teks krem, baris zebra `--sage-100`, hover `--cream-100`, kolom angka rata kanan tabular. Sticky header. Mobile → kartu.
- **Label kategori / Status**: teks kategori ringkas atau penanda status sederhana; warna per jenis (pesantren = hijau, masjid = emas, madrasah = teal, tematik = terracotta). Dilarang membungkus eyebrow di atas judul utama dengan bingkai pill/kapsul AI.
- **Form (admin & publik)**: label di atas, input radius 8 px, border `--cream-200`, fokus ring emas, pesan error jelas (ikon + teks), tanpa mengandalkan warna saja.
- **Footer**: `--green-950`, pola geometri samar, logo, rekening (salin dengan satu klik), kontak, medsos, garis ganda emas di atasnya.

---

## 6. Struktur & komposisi halaman publik

Setiap halaman membuka dengan **momen sinematik**, lalu turun ke ritme membaca yang tenang.

### Beranda
1. **Hero (gelap, layar penuh)** — logo emas "menggambar diri" (cincin ganda → tangan → globe → tunas), judul display "Menebar Cahaya Al-Qur'an, Memakmurkan Rumah Allah di Pelosok Negeri", sub-copy singkat, CTA ganda (Donasi · Lihat Sebaran). Latar: pola geometri parallax + partikel debu emas halus.
2. **Marquee nilai** — A-K-S-A-R-A (Al-Qur'an, Kemanusiaan, Sinergi, Akhlak, Riset, Aplikasi) berjalan pelan; klik/hover menjelaskan makna tiap huruf.
3. **Angka dampak** — mushaf tersalurkan, masjid dibersihkan, provinsi terjangkau (dari database).
4. **Empat pilar** — Spiritual, Sosial, Pendidikan, Teknologi (pinned section: tiap pilar masuk bergantian).
5. **Program unggulan** — Infak Al-Qur'an Jinan (Rp 100.000 / mushaf), BUSS Al-Qur'an, Geber Masjid, Tasmi' 30 Juz Bil-Ghoib.
6. **Peta sebaran** (pratinjau) → CTA ke halaman Data Sebaran.
7. **Kisah & latar belakang lembaga** (cuplikan profil Ahmad Dahlan) dengan foto di bingkai mihrab.
8. **Laporan terbaru** (3 kartu) + **dokumentasi** (galeri).
9. **CTA donasi** besar + rekening resmi.

### Tentang Kami
Profil → Kisah & latar belakang lembaga (scrollytelling: foto sticky di kiri, paragraf bergantian di kanan, timeline perjuangan: MA Al-Huffazh 2 Gedongan Cirebon → Paket C → Institut PTIQ Jakarta → yayasan) → Fokus pilar → Visi (layar penuh, berdedikasi memuliakan Al-Qur'an & memakmurkan masjid) → Misi (4 bidang) → **Makna Filosofis Nama** (A-K-S-A-R-A, interaktif) → **Makna Logo** (logo besar dengan titik-titik hotspot: tangan memangku globe, siluet buku terbuka, tunas bertumbuh, bentuk geometris, warna emas & hijau zamrud).

### Program Lembaga
Daftar 8 program resmi:
1. Infak Al-Qur'an Jinan (Rp 100.000 / mushaf custom nama)
2. Program BUSS Al-Qur'an (Rp 150rb / 300rb / 500rb)
3. Geber Masjid (Gerakan Bersih Masjid)
4. Majlis Tasmi' Al-Qur'an 30 Juz Bil-Ghoib
5. Program Yatim Berdikari
6. Beasiswa Pelatihan IT Mitra Produktif
7. Program Dukungan Pembinaan & Pemberdayaan UMKM
8. Program Bantuan Tematik Nusantara
Scroll horizontal ber-pin pada desktop; tumpukan vertikal di mobile. Detail tiap program punya halaman sendiri dengan hero foto, penjelasan, cara berpartisipasi, dan laporan terkait.

### Portofolio Produk
Enam aplikasi (KajianQu, Bank Saku Digital, DiaryQu, E-AbsensiQu, DKM MasjidQu, SapawargaQu) sebagai kartu besar dengan mockup perangkat; tilt 3D halus mengikuti kursor; tombol Play Store bila ada. Placeholder mockup dibuat dari SVG/CSS sampai screenshot asli tersedia — **jangan pakai gambar karangan yang menyesatkan**.

### Data Sebaran Donasi
Lihat §9.

### Laporan Penyaluran
Gaya laporan transparan: filter program & periode, kartu laporan (cover, ringkasan, jumlah penerima manfaat, unduh PDF), halaman detail dengan galeri. Angka penting diberi visual (bar/area chart sederhana).

### Info Donasi & Dokumentasi
Rekening (kartu dengan tombol salin), kontak person (tombol WhatsApp), medsos, mitra (logo marquee), galeri dokumentasi (masonry + lightbox), **Donasi Tematik** (kartu kampanye bencana: gempa NTT, karhutla Kalimantan, erupsi Krakatau, banjir Aceh — dengan badge status Aktif/Selesai; admin yang mengisi).

---

## 7. Gambar & fotografi

- Tone foto: hangat, sedikit desaturasi, bayangan diangkat. Terapkan satu preset color-grade untuk semua foto agar seragam.
- Overlay di atas foto: `linear-gradient(to top, rgba(6,33,15,.85), rgba(6,33,15,0))`.
- Foto founder → bingkai mihrab, crop dari bahu ke atas; latar kayu-krem menyatu dengan palet.
- Foto tasmi' → kartu atau split-section, jangan jadi hero layar penuh (resolusi/pencahayaan terbatas); beri overlay hijau 20–30% dan grain halus.
- Mockup mushaf → pakai sebagai gambar "mengambang" dengan parallax, bayangan lembut; label "Contoh cover custom nama".
- Semua gambar: `next/image`, `sizes` tepat, `placeholder="blur"`, rasio tetap (cegah CLS).

---

## 8. Sistem gerak (motion)

Filosofi: **gerak bercerita, bukan menghias.** Ambisinya "gila" — tapi terstruktur dengan bahasa gerak yang konsisten, sehingga terasa mewah, bukan berantakan.

### Token gerak
| Token | Nilai |
|---|---|
| `--ease-out` | `power3.out` (masuk) |
| `--ease-inout` | `power3.inOut` (transisi halaman, pin) |
| `--ease-spring` | `back.out(1.4)` (tombol, badge, pop kecil) |
| `--ease-expo` | `expo.out` (reveal judul besar) |
| `--dur-xs/sm/md/lg/xl` | 0.2 / 0.4 / 0.7 / 1.1 / 1.8 s |
| `--stagger` | 0.06–0.12 s (kata/baris), 0.04 s (huruf) |

### Pustaka & peran
| Alat | Dipakai untuk |
|---|---|
| **GSAP core + ScrollTrigger** | Reveal, pin, scrub, parallax, horizontal scroll |
| **SplitText** | Judul masuk per baris/kata/huruf; visi menyala kata-demi-kata |
| **DrawSVG / stroke-dashoffset** | Logo & cincin menggambar diri, garis peta, garis timeline |
| **MotionPath** | Titik/partikel bergerak menyusuri jalur (rute penyaluran dari pusat ke daerah di peta) |
| **Flip** | Perpindahan tata letak saat filter tabel/galeri, tab Infak↔Geber |
| **Lenis** | Smooth scroll (sinkron dengan ScrollTrigger lewat `lenis.on('scroll', ScrollTrigger.update)` & `gsap.ticker`) |
| **Lottie / dotLottie** | Ilustrasi hidup berulang: tangan-globe, tunas tumbuh, masjid, buku terbuka, loader, empty state, centang sukses |
| CSS (`@view-transition`, `scroll-timeline` bila didukung) | Peningkatan progresif untuk transisi halaman sederhana |

### Katalog gerak (pakai ini, bukan improvisasi tiap kali)
1. **Preloader (±1.8 dtk, hanya kunjungan pertama per sesi)**: lingkaran ganda emas menggambar diri → tangan & globe muncul (Lottie) → tunas tumbuh → layar hijau "terbelah" ke atas/bawah (clip-path) membuka beranda. Bisa dilewati; tidak muncul ulang saat navigasi internal.
2. **Hero**: judul per huruf naik dari mask (`yPercent:110 → 0`, stagger 0.03); pola geometri parallax lambat; partikel emas (canvas ringan ≤ 60 partikel) bergerak lambat mengikuti kursor sangat halus; CTA masuk terakhir dengan spring.
3. **Reveal standar**: blok teks `y:40, opacity:0 → 1` ; gambar dengan **clip-path wipe** (`inset(0 0 100% 0) → inset(0)`) + skala 1.15 → 1. Variasikan arah antar-section.
4. **Pin & scrub**: bagian Empat Pilar (kartu bertumpuk bergantian), kisah founder (foto sticky), Program (horizontal scroll). Pakai `scrub: 0.6–1` agar terasa "berat" dan halus.
5. **Counter**: angka naik dengan `snap`, easing `power2.out`, mulai saat 70% terlihat; format ribuan Indonesia (`id-ID`).
6. **Visi kata-demi-kata**: kata redup (opacity .2) → menyala saat scroll melewatinya (scrubbed).
7. **A-K-S-A-R-A**: huruf besar emas; hover/tap membalik (flip 3D) menampilkan makna; di mobile berupa accordion.
8. **Hotspot logo (Makna Logo)**: titik berdenyut → klik: zoom ke elemen, sorot, tampil penjelasan; elemen lain meredup.
9. **Peta sebaran**: titik muncul berurutan per provinsi (stagger acak terkontrol), denyut cincin pada titik terbaru, garis lengkung dari titik pusat yayasan ke daerah penerima (MotionPath + DrawSVG). Hover titik → kartu mini (nama penerima, tanggal, mushaf ke-).
10. **Tabel**: baris masuk stagger; saat filter berubah → Flip; baris baru di-highlight emas yang memudar.
11. **Tombol magnetik** (CTA utama saja): bergerak ≤ 8 px mengikuti kursor; kilau emas menyapu saat hover.
12. **Kursor kustom** (desktop pointer fine saja): titik emas kecil + cincin; membesar & berubah label ("Lihat", "Putar") di atas elemen interaktif. Kursor asli tetap tersedia di form/tabel.
13. **Marquee**: mitra & nilai AKSARA; kecepatan terikat ke kecepatan scroll (skew sangat halus), pause saat hover.
14. **Transisi halaman**: layar hijau menyapu dari bawah dengan logo kecil emas di tengah; konten baru reveal ulang. Durasi total ≤ 0.9 dtk.
15. **Mikro-interaksi**: tombol "salin rekening" → ikon berubah centang Lottie + toast; tab dengan indikator geser; kartu dengan tilt halus; skeleton shimmer sage saat loading.
16. **Galeri/lightbox**: Flip dari thumbnail ke ukuran penuh, gesture swipe di mobile.
17. **Footer**: pola geometri bergerak lambat; logo besar tergambar saat mencapai dasar halaman.

### Lottie — daftar aset yang dibutuhkan
Cari dari LottieFiles (cek lisensi) atau buat sendiri di After Effects/Bodymovin; pastikan palet diselaraskan ke token (recolor ke hijau/emas):
`hands-globe-loop`, `sprout-grow`, `open-book`, `mosque-minaret`, `quran-stand` (opsional), `loader-ring`, `success-check`, `empty-state-box`, `map-pulse`, `scroll-hint`. Simpan di `public/lottie/`, ≤ 150 KB masing-masing.

### Aturan keras gerak
- **Reduced motion**: `gsap.matchMedia().add('(prefers-reduced-motion: reduce)', …)` → matikan pin/scrub/parallax/partikel/kursor kustom/preloader panjang; ganti dengan fade 0.3 dtk. Lottie dihentikan di frame poster.
- **Mobile**: matikan kursor kustom & tilt; kurangi partikel; horizontal scroll → vertikal; hindari pin berantai > 2 per halaman.
- **Performa**: hanya `transform/opacity/clip-path`; `will-change` dipasang sebelum animasi & dilepas sesudahnya; `ScrollTrigger.refresh()` setelah gambar/font termuat; semua animasi dibersihkan saat unmount (`useGSAP` + `scope`).
- **Tidak ada gerak yang menghalangi baca**: teks isi tidak boleh bergerak terus-menerus; autoplay loop hanya untuk ornamen non-teks.
- **Tidak ada flash > 3 kali/detik**. Hindari parallax berlebihan yang memicu mual.
- **SSR-aman**: konten terlihat tanpa JS; sembunyikan-lalu-animasikan hanya jika JS aktif (kelas `.js` pada `<html>`), supaya tidak ada "halaman kosong" bila skrip gagal.
- Anggaran: total waktu animasi kritis di atas lipatan pertama ≤ 2 dtk sebelum pengguna bisa berinteraksi.

---

## 9. Desain Data Sebaran (fitur utama)

- **Atas**: dua tab besar — *Infak 1 Jt Al-Qur'an* (latar hijau/emas) dan *Geber Masjid* (latar sage/teal) — berpindah dengan Flip + crossfade.
- **Tengah**: peta Indonesia (SVG stilasi titik/halftone atau MapLibre dengan style kustom hijau-krem). Titik = lokasi penerima; ukuran/ intensitas = jumlah. Legenda jelas, bisa diakses keyboard.
- **Statistik**: 3–4 angka (total, provinsi, penerima terbaru, tahun berjalan).
- **Bawah**: tabel dengan pencarian, filter, sort, paginasi; kolom contoh Infak → `Mushaf ke-`, Nama Donatur (atau "Hamba Allah"), Penerima, Jenis, Kota/Provinsi, Tanggal. Geber → Masjid, Lokasi, Tanggal, Peserta.
- Klik baris → panel samping (drawer) berisi foto & catatan penyaluran.
- Empty state: Lottie `empty-state-box` + teks yang menenangkan.

---

## 10. Referensi inspirasi (ambil **polanya**, bukan salinannya)

Pelajari web lembaga kemanusiaan/zakat/yatim yang matang untuk pola: struktur informasi, transparansi laporan, alur donasi, dan penempatan bukti dampak — mis. **Sahabat Yatim Indonesia** (disebut owner untuk gaya laporan), **Dompet Dhuafa**, **Rumah Zakat**, **ACT**, **BAZNAS**, **Kitabisa**, serta organisasi global seperti **charity: water**, **Islamic Relief**, **Penny Appeal**. Untuk bahasa gerak sinematik, rujuk situs-situs pemenang Awwwards/FWA kategori nonprofit/storytelling (scrollytelling, preloader bermerek, transisi halaman, peta data interaktif), serta galeri GSAP resmi (gsap.com/showcase) dan LottieFiles.
Catatan: situs-situs tersebut berubah; agent sebaiknya membukanya langsung sebagai riset, mencatat pola yang cocok di `docs/inspirasi.md`, lalu menerjemahkannya ke token & komponen di dokumen ini.

---

## 11. Aksesibilitas & inklusivitas

- Kontras AA, fokus keyboard terlihat, ukuran target sentuh ≥ 44 px.
- Semua informasi di peta/gerak punya padanan teks/tabel.
- Video/animasi dekoratif `aria-hidden`; Lottie bermakna diberi `aria-label`.
- Teks Arab ber-`lang="ar"`; ayat/doa tidak dipotong di tengah.
- Bahasa sederhana, tidak menghakimi; pilihan donasi jelas tanpa tekanan emosional berlebih.
- Nama donatur dan foto orang: hormati izin (lihat `AGENTS.md`).

---

## 12. Checklist sebelum merge UI

- [ ] Hanya memakai token warna/ruang/gerak dari dokumen ini
- [ ] Kontras diperiksa pada setiap kombinasi baru
- [ ] Reduced-motion & mobile sudah ditangani
- [ ] Tidak ada animasi yang menggeser layout (CLS)
- [ ] Lighthouse mobile memenuhi target di `AGENTS.md` §10
- [ ] Halaman terbaca dan berfungsi dengan JS dimatikan (konten tetap tampil)
- [ ] Tidak ada tautan ke `/admin` di UI publik
