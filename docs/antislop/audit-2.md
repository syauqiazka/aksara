# AUDIT SLOP — antislop-layoutmobile (Audit-2)

> **Tanggal Audit**: 2026-11-03  
> **Ruang Lingkup**: Seluruh rute publik dan admin di 5 viewport uji:  
> - `mobile-small` (360×740 px)  
> - `mobile-standard` (390×844 px)  
> - `tablet` (768×1024 px)  
> - `laptop-small` (1024×768 px)  
> - `desktop` (1440×900 px)  
> **Instrumen Uji**: Script Puppeteer headless DOM geometry evaluator (`scripts/audit-layoutmobile.mjs`)

---

## 1. Ringkasan Eksekutif

| Pengujian | Status | Catatan |
|---|---|---|
| **Horizontal Overflow** (Scroll Leak) | **PASS (0 temuan)** | Tidak ada elemen yang bocor melebihi lebar viewport di 360px s/d 1440px. |
| **Tap Targets ≥ 44×44 px** | **FAIL (4 area temuan)** | Tombol menu navbar, sort tabel, button portofolio, dan nav admin di bawah 44px. |
| **Teks Terpotong / Clipping** | **PASS** | Teks reflow dengan benar ke kartu tumpuk mobile. |

---

## 2. Temuan Baru antislop-layoutmobile (Audit-2)

### #LM-01 | Hard Gate | R-03, R-39 (Tombol Hamburger Menu Navbar Ukuran 40×40 px)
- **Lokasi**: `src/components/ui/Navbar.tsx:105`
- **Bukti Uji**: `BUTTON 'Buka Menu' berdimensi [40x40px]` di semua rute mobile (360px & 390px).
- **Mengapa ini slop**: Syarat aksesibilitas mobile WCAG & antislop R-03 mewajibkan target sentuh interaktif berukuran minimal 44×44 px agar nyaman disentuh ibu jari.
- **Usulan perbaikan**: Tambahkan `min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5` pada tombol toggle menu mobile.

### #LM-02 | Hard Gate | R-03, R-39 (Tombol Pengurutan Tabel Data Sebaran Terlalu Tipis)
- **Lokasi**: `src/components/sections/DataSebaranView.tsx:244, 255`
- **Bukti Uji**: `BUTTON 'Tanggal' [83x26px]` dan `BUTTON 'No. Mushaf' [103x26px]` pada viewport mobile (360px & 390px).
- **Mengapa ini slop**: Tinggi tombol 26px sangat tipis untuk layar sentuh ponsel, menyulitkan pengguna menyortir data.
- **Usulan perbaikan**: Ubah padding menjadi `py-2.5 px-3 min-h-[44px] flex items-center` agar mencapai batas aman 44px.

### #LM-03 | Hard Gate | R-03, R-39 (Tombol 'Segera Hadir' Portofolio Tinggi < 44 px)
- **Lokasi**: `src/app/(public)/portofolio/page.tsx:122`
- **Bukti Uji**: `BUTTON 'Segera Hadir' [137x36px]`.
- **Mengapa ini slop**: Tinggi tombol 36px berada di bawah standar tap target 44px.
- **Usulan perbaikan**: Sesuaikan padding ke `py-3 px-5 min-h-[44px]`.

### #LM-04 | Hard Gate | R-03, R-39 (Sidebar Link Navigasi Admin Tinggi < 44 px pada Mobile & Tablet)
- **Lokasi**: `src/components/admin/AdminNav.tsx`
- **Bukti Uji**: Link menu navigasi admin berdimensi tinggi antara 36px s/d 42px di layar mobile/tablet.
- **Mengapa ini slop**: Mengoperasikan dashboard admin di tablet atau ponsel menjadi rawan salah sentuh.
- **Usulan perbaikan**: Berikan `min-h-[44px] py-3 flex items-center` pada setiap tautan navigasi admin.

