import Image from "next/image";
import Link from "next/link";
import {
  HeartHandshake,
  ArrowRight,
  BookOpen,
  Building2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  FileText,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { db } from "@/lib/db/api";
import { formatTanggal } from "@/lib/format-date";
import { organizationContent } from "@/content/organization";
import Preloader from "@/components/motion/Preloader";
import StatCounter from "@/components/motion/StatCounter";
import AksaraMarquee from "@/components/motion/AksaraMarquee";
import HeroShowcase from "@/components/sections/HeroShowcase";
import IndonesiaMap from "@/components/sections/IndonesiaMap";
import Button from "@/components/ui/Button";

export default async function HomePage() {
  const stats = await db.getAggregatedStats();
  const jinanList = await db.getPublicInfakJinan();
  const reports = await db.getReports(true);
  const latestReport = reports[0];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Preloader />

      {/* 1. HERO SHOWCASE (Full Bleed Green-950, Asymmetric 7:5) */}
      <HeroShowcase totalMushaf={stats.totalMushaf} totalMasjid={stats.totalMasjid} />

      {/* 2. PROOF & MARQUEE STRIP (Integrated Metrics & Values) */}
      <section className="relative bg-[var(--green-950)] text-[var(--cream-50)] border-t border-b border-[var(--gold-500)]/20">
        {/* Metric Bar Monolitik */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[var(--gold-500)]/15">
            <div className="pt-4 lg:pt-0 lg:px-6 first:pt-0 first:px-0">
              <StatCounter
                end={stats.totalMushaf > 0 ? stats.totalMushaf : 100}
                label="Mushaf Al-Qur'an Tersalurkan"
                sublabel="Target Gerakan 1 Juta Mushaf Jinan"
              />
            </div>
            <div className="pt-4 lg:pt-0 lg:px-6">
              <StatCounter
                end={stats.totalMasjid > 0 ? stats.totalMasjid : 12}
                label="Masjid Dibersihkan"
                sublabel="Aksi Nyata Geber Masjid Pelosok"
              />
            </div>
            <div className="pt-4 lg:pt-0 lg:px-6">
              <StatCounter
                end={stats.totalProvinces > 0 ? stats.totalProvinces : 4}
                label="Provinsi Terjangkau"
                sublabel="Jejak Penyaluran Nusantara"
              />
            </div>
            <div className="pt-4 lg:pt-0 lg:px-6">
              <StatCounter
                end={stats.totalBeneficiaries > 0 ? stats.totalBeneficiaries : 1200}
                label="Penerima Manfaat"
                sublabel="Santri Tahfidz, Dhuafa & Jamaah"
              />
            </div>
          </div>
        </div>

        {/* Marquee Nilai Filosofis AKSARA */}
        <AksaraMarquee />
      </section>

      {/* 3. FONDASI KHIDMAT: EMPAT PILAR ASIMETRIS (Warm Cream-50, Editorial 7:5) */}
      <section className="py-24 sm:py-32 bg-[var(--cream-50)] text-[var(--ink-900)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Kolom Kiri 7: Narasi & Wawasan Editorial */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold-700)] font-semibold">
              Fondasi Khidmat Lembaga
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--ink-900)] leading-tight [text-wrap:balance]">
              Empat Pilar Membangun Peradaban Berbasis Al-Qur&apos;an
            </h2>
            <div className="w-20 h-1 bg-[var(--gold-600)] rounded-full" />

            <p className="text-base sm:text-lg text-[var(--ink-600)] leading-relaxed font-sans pt-2">
              Yayasan Sahabat Aksara mendedikasikan khidmat pada empat ranah kehidupan yang terpadu: menyucikan jiwa melalui <strong>Al-Qur&apos;an &amp; Rumah Allah</strong>, menegakkan kepedulian sosial, mendidik generasi berilmu, serta memanfaatkan teknologi sebagai sarana dakwah dan kemandirian umat.
            </p>

            {/* Kutipan Komitmen */}
            <div className="p-6 rounded-2xl bg-[var(--cream-100)] border-l-4 border-[var(--gold-600)] text-sm sm:text-base text-[var(--ink-600)] font-serif italic">
              &ldquo;Tidak ada kebaikan yang lebih abadi daripada mushaf yang terus dibaca dan ilmu yang terus diamalkan oleh generasi penerus.&rdquo;
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/tentang"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm"
              >
                <span>Pelajari Visi &amp; Filosofi Logo Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/portofolio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-[var(--green-800)] hover:text-[var(--gold-700)] transition-colors"
              >
                <span>Lihat Portofolio 6 Aplikasi Qu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Kolom Kanan 5: Susunan Editorial Pilar Terpadu */}
          <div className="lg:col-span-5 space-y-5">
            {/* 01. Pilar Spiritual (Dominan, Emerald Theme) */}
            <div className="p-7 rounded-3xl bg-[var(--green-950)] text-[var(--cream-50)] border-2 border-[var(--gold-500)]/40 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--gold-500)]/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-3xl font-extrabold text-gold-gradient">01</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold-400)]">
                  Pilar Inti
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[var(--cream-50)] mb-2">
                Pilar Spiritual
              </h3>
              <p className="text-xs text-[var(--gold-300)] font-semibold mb-3">
                Memuliakan Al-Qur&apos;an &amp; Memakmurkan Masjid
              </p>
              <p className="text-sm text-[var(--cream-200)]/90 leading-relaxed mb-4">
                Gerakan Infak 1 Jt Al-Qur&apos;an Jinan, Beasiswa BUSS Al-Qur&apos;an, Aksi Nyata Geber Bersih Masjid, serta Majlis Tasmi&apos; 30 Juz Bil-Ghoib.
              </p>
              <div className="text-xs font-bold text-[var(--gold-400)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pusat Gravitasi Khidmat Yayasan</span>
              </div>
            </div>

            {/* 02. Pilar Sosial & Kemanusiaan */}
            <div className="p-6 rounded-3xl bg-[var(--cream-100)] text-[var(--ink-900)] border border-[var(--cream-200)] hover:border-[var(--gold-500)]/60 shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif text-xl font-bold text-[var(--gold-700)]">02</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-400)]">
                  Kepedulian
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[var(--ink-900)] mb-1">
                Pilar Sosial
              </h3>
              <p className="text-xs text-[var(--ink-600)] leading-relaxed">
                Santunan Program Yatim Berdikari dan Bantuan Tanggap Darurat Bencana Nusantara.
              </p>
            </div>

            {/* 03 & 04. Pilar Pendidikan & Teknologi */}
            <div className="p-6 rounded-3xl bg-[var(--sage-100)] text-[var(--ink-900)] border border-[var(--sage-300)]/40 hover:border-[var(--green-700)]/50 shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif text-xl font-bold text-[var(--green-800)]">03 &amp; 04</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--green-700)]">
                  Pemberdayaan
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[var(--ink-900)] mb-1">
                Pendidikan &amp; Teknologi
              </h3>
              <p className="text-xs text-[var(--ink-600)] leading-relaxed">
                Beasiswa Pelatihan IT Santri, Pembinaan UMKM Umat, serta Ekosistem 6 Aplikasi Mobile Qu (KajianQu, Bank Saku Digital, DiaryQu, E-AbsensiQu, DKM MasjidQu, SapawargaQu).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROGRAM UNGGULAN: ASYMMETRIC FOCUS SHOWCASE (Warm Sage-100) */}
      <section className="py-24 sm:py-32 bg-[var(--sage-100)] text-[var(--ink-900)] px-4 sm:px-6 lg:px-8 border-y border-[var(--sage-300)]/40">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--green-700)] font-semibold">
                Program Aksi Lapangan Terverifikasi
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--ink-900)] mt-2 [text-wrap:balance]">
                Dua Gerakan Utama Khidmat Al-Qur&apos;an
              </h2>
            </div>
            <Link
              href="/program"
              className="inline-flex items-center gap-2 font-semibold text-[var(--green-800)] hover:text-[var(--gold-700)] text-sm group flex-shrink-0"
            >
              <span>Lihat Seluruh 8 Program Yayasan</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Split 2 Program Pahlawan (Asymmetric Focus) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Card 1: Infak 1 Jt Al-Qur'an Jinan (7 Kolom) */}
            <div className="lg:col-span-7 bg-[var(--cream-50)] rounded-3xl p-8 sm:p-10 border-2 border-[var(--gold-500)]/50 shadow-xl flex flex-col justify-between group">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold-700)]">
                    Target 1.000.000 Mushaf
                  </span>
                  <span className="bg-gold-gradient text-[var(--green-950)] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Rp 100.000 / Mushaf
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)] group-hover:text-[var(--green-800)] transition-colors">
                  Infak Al-Qur&apos;an Jinan (Custom Nama Donatur)
                </h3>

                <p className="text-sm sm:text-base text-[var(--ink-600)] leading-relaxed">
                  Jelajah langsung infak Al-Qur&apos;an sampai ke tangan santri pelosok. Nama donatur, keluarga, atau almarhum tercetak permanen di cover mushaf dengan pemantauan hafalan santri yang diperbarui secara bulanan.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--cream-200)] text-xs text-[var(--ink-600)]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--green-700)] flex-shrink-0 mt-0.5" />
                    <span>Cetak nama custom di cover</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--green-700)] flex-shrink-0 mt-0.5" />
                    <span>Monitoring hafalan bulanan</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--green-700)] flex-shrink-0 mt-0.5" />
                    <span>Data koordinat &amp; foto terbuka</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row items-center gap-4">
                <Button href="/donasi" variant="gold" size="md" className="w-full sm:w-auto">
                  <HeartHandshake className="w-4 h-4 text-[var(--green-950)]" />
                  <span>Infakkan Mushaf Sekarang</span>
                </Button>
                <Link
                  href="/program/infak-jinan"
                  className="text-xs font-bold text-[var(--green-800)] hover:text-[var(--gold-700)] flex items-center gap-1.5"
                >
                  <span>Baca Skema &amp; Prosedur Jinan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Program BUSS Al-Qur'an (5 Kolom) */}
            <div className="lg:col-span-5 bg-[var(--green-950)] text-[var(--cream-50)] rounded-3xl p-8 sm:p-10 border-2 border-[var(--green-800)] shadow-xl flex flex-col justify-between group">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold-400)]">
                    Beasiswa Uang Saku Santri
                  </span>
                  <span className="bg-[var(--green-900)] border border-[var(--gold-500)]/40 text-[var(--gold-300)] text-xs font-bold px-3 py-1 rounded-full">
                    Mulai Rp 150.000 / Bln
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--cream-50)] group-hover:text-[var(--gold-300)] transition-colors">
                  Program BUSS Al-Qur&apos;an
                </h3>

                <p className="text-sm text-[var(--cream-200)]/90 leading-relaxed">
                  Bantuan Uang Saku Santri penghafal Al-Qur&apos;an penerima mushaf Jinan agar fokus menghafal dan menuntaskan pendidikan tanpa terkendala biaya hidup.
                </p>

                <div className="space-y-2 pt-4 border-t border-[var(--green-900)] text-xs text-[var(--cream-200)]">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--green-900)]/60">
                    <span>BUSS Ekonomi</span>
                    <strong className="text-[var(--gold-400)]">Rp 150.000 / bln</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--green-900)]/60">
                    <span>BUSS Bisnis</span>
                    <strong className="text-[var(--gold-400)]">Rp 300.000 / bln</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--green-900)]/60">
                    <span>BUSS Eksekutif</span>
                    <strong className="text-[var(--gold-400)]">Rp 500.000 / bln</strong>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row items-center gap-4">
                <Button href="/donasi" variant="secondary" size="md" className="w-full sm:w-auto text-white border-[var(--gold-500)]/40 hover:bg-[var(--gold-500)]/15">
                  <span>Dukung Santri Tahfidz</span>
                </Button>
                <Link
                  href="/program/buss-quran"
                  className="text-xs font-bold text-[var(--gold-400)] hover:text-[var(--gold-300)] flex items-center gap-1.5"
                >
                  <span>Detail Beasiswa BUSS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Akses Cepat 6 Program Lainnya (Editorial Strip, Bebas Kotak Seragam) */}
          <div className="p-6 rounded-2xl bg-[var(--cream-50)] border border-[var(--cream-200)]">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-400)] mb-3">
              Program Khidmat Sahabat Aksara Lainnya:
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold">
              <Link
                href="/program/geber-masjid"
                className="px-4 py-2 rounded-full bg-[var(--cream-100)] border border-[var(--cream-200)] text-[var(--ink-900)] hover:border-[var(--green-700)] transition-colors flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-[var(--green-700)]" />
                <span>Geber Bersih Masjid</span>
              </Link>
              <Link
                href="/program/tasmi-30-juz"
                className="px-4 py-2 rounded-full bg-[var(--cream-100)] border border-[var(--cream-200)] text-[var(--ink-900)] hover:border-[var(--gold-600)] transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-[var(--gold-700)]" />
                <span>Majlis Tasmi&apos; 30 Juz Bil-Ghoib</span>
              </Link>
              <Link
                href="/program/yatim-berdikari"
                className="px-4 py-2 rounded-full bg-[var(--cream-100)] border border-[var(--cream-200)] text-[var(--ink-900)] hover:border-[var(--green-700)] transition-colors flex items-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[var(--green-700)]" />
                <span>Program Yatim Berdikari</span>
              </Link>
              <Link
                href="/program/pelatihan-it"
                className="px-4 py-2 rounded-full bg-[var(--cream-100)] border border-[var(--cream-200)] text-[var(--ink-900)] hover:border-[var(--green-700)] transition-colors"
              >
                Pelatihan IT Mitra Santri
              </Link>
              <Link
                href="/program/pembinaan-umkm"
                className="px-4 py-2 rounded-full bg-[var(--cream-100)] border border-[var(--cream-200)] text-[var(--ink-900)] hover:border-[var(--green-700)] transition-colors"
              >
                Pembinaan UMKM Umat
              </Link>
              <Link
                href="/program/bantuan-tematik"
                className="px-4 py-2 rounded-full bg-[var(--cream-100)] border border-[var(--cream-200)] text-[var(--ink-900)] hover:border-[var(--green-700)] transition-colors"
              >
                Bantuan Tematik Tanggap Bencana
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE BUKTI SEBARAN NASIONAL (Full-Bleed Dark Green-950) */}
      <section className="py-24 sm:py-32 bg-[var(--green-950)] text-[var(--cream-50)] px-4 sm:px-6 lg:px-8 border-b border-[var(--gold-500)]/20">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold-400)] font-semibold mb-2">
              Bukti Transparansi Penyaluran
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--cream-50)]">
              Jejak Titik Penyaluran Nusantara
            </h2>
            <p className="text-sm sm:text-base text-[var(--cream-200)]/80 mt-3 leading-relaxed">
              Setiap mushaf bernomor urut dan titik pesantren penerima dicatat secara terbuka dan dapat diverifikasi langsung di peta interaktif berikut.
            </p>
          </div>

          {/* Interactive Nusantara Map Stage */}
          <div className="rounded-3xl overflow-hidden border border-[var(--gold-500)]/30 bg-[var(--green-900)]/40 p-4 sm:p-6 shadow-2xl">
            <IndonesiaMap jinanData={jinanList} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button href="/data-sebaran" variant="gold" size="lg" className="shadow-lg">
              <MapPin className="w-5 h-5 text-[var(--green-950)]" />
              <span>Buka Seluruh Ledger Data Sebaran &amp; Detail Santri</span>
            </Button>
            <Link
              href="/data-sebaran"
              className="text-xs font-semibold text-[var(--gold-300)] hover:text-[var(--gold-200)] flex items-center gap-1.5"
            >
              <span>Verifikasi Progres Hafalan Santri</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. KISAH FOUNDER & AUDIT TRANSPARANSI (Warm Cream-100, 2-Column Split) */}
      <section className="py-24 sm:py-32 bg-[var(--cream-100)] text-[var(--ink-900)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Kolom Kiri 5: Foto Founder dalam Bingkai Mihrab */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] shape-mihrab overflow-hidden border-4 border-[var(--gold-500)] shadow-2xl bg-[var(--green-950)]">
              <Image
                src="/images/founder-ahmad-dahlan.jpg"
                alt="Ahmad Dahlan, Pendiri Yayasan Sahabat Aksara"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-950)]/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-[var(--cream-50)]">
                <div className="font-serif text-2xl font-bold text-gold-gradient">
                  {organizationContent.founder.name}
                </div>
                <div className="text-xs text-[var(--cream-200)] mt-0.5">
                  {organizationContent.founder.role}, Alumni MA Al-Huffazh 2 Cirebon &amp; Institut PTIQ Jakarta
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan 7: Narasi Otentik & Kartu Laporan Audit */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold-700)] font-semibold">
              Kisah &amp; Latar Belakang Lembaga
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] leading-tight">
              Dari Keterbatasan Menuju Gerakan Satu Juta Mushaf
            </h2>

            <blockquote className="border-l-4 border-[var(--gold-600)] pl-4 italic text-base sm:text-lg text-[var(--ink-600)] font-serif leading-relaxed">
              &ldquo;{organizationContent.founder.quote}&rdquo;
            </blockquote>

            <p className="text-sm sm:text-base text-[var(--ink-600)] leading-relaxed font-sans">
              {organizationContent.founder.story[0]}
            </p>
            <p className="text-sm sm:text-base text-[var(--ink-600)] leading-relaxed font-sans">
              {organizationContent.founder.story[1]}
            </p>

            {/* Kartu Audit Terbuka (Menggantikan 3 kartu repetitif) */}
            {latestReport && (
              <div className="mt-6 p-6 rounded-2xl bg-[var(--cream-50)] border border-[var(--cream-200)] shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs text-[var(--gold-700)] font-semibold">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[var(--green-800)]" />
                    <span>Laporan Penyaluran Terbaru</span>
                  </span>
                  <span>Periode: {formatTanggal(latestReport.period_start)} s/d {formatTanggal(latestReport.period_end)}</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-[var(--ink-900)]">
                  {latestReport.title}
                </h4>
                <p className="text-xs text-[var(--ink-600)] line-clamp-2">
                  {latestReport.summary}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs border-t border-[var(--cream-200)]">
                  <span className="font-semibold text-[var(--green-800)]">
                    {latestReport.beneficiaries.toLocaleString("id-ID")} Santri Penerima Manfaat
                  </span>
                  <Link
                    href={`/laporan/${latestReport.slug}`}
                    className="font-bold text-[var(--green-800)] hover:text-[var(--gold-700)] flex items-center gap-1"
                  >
                    <span>Baca Laporan Transparan</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/tentang"
                className="inline-flex items-center gap-2 font-semibold text-[var(--green-800)] hover:text-[var(--gold-700)] text-sm group"
              >
                <span>Baca Perjalanan Lengkap Pendiri</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <span className="text-[var(--cream-300)]">|</span>
              <Link
                href="/laporan"
                className="inline-flex items-center gap-2 font-semibold text-[var(--green-800)] hover:text-[var(--gold-700)] text-sm group"
              >
                <span>Seluruh Laporan &amp; Audit</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GRAND CALL TO ACTION (Full-Bleed Dark Green-950) */}
      <section className="py-24 sm:py-32 bg-[var(--green-950)] text-[var(--cream-50)] text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold-400)] font-semibold mb-4">
            Sedekah Jariyah Mengalir Tiada Putus
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold [text-wrap:balance] leading-tight">
            Mari Mengukir Nama di Lembar Al-Qur&apos;an Santri Pelosok
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--cream-200)]/90 leading-relaxed max-w-xl">
            Setiap huruf yang dibaca dan dihafal akan terus mengalirkan pahala jariyah. Salurkan donasi infak mushaf Anda hari ini melalui rekening resmi yayasan.
          </p>

          {/* Rekening Card Ringkas */}
          <div className="mt-8 p-6 rounded-2xl bg-[var(--green-900)]/70 border border-[var(--gold-500)]/40 max-w-md w-full text-center">
            <div className="text-xs uppercase tracking-wider text-[var(--gold-300)] font-bold mb-1">
              Rekening Resmi Yayasan
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-[var(--cream-50)]">
              Bank BCA
            </div>
            <div className="text-xs text-[var(--cream-200)] mt-1">
              a.n. Yayasan Ajirasa Aksara Semesta (Sahabat Aksara)
            </div>
            <div className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--gold-500)]/20 text-[var(--gold-300)] border border-[var(--gold-500)]/30">
              Konfirmasi &amp; Donasi Online Terbuka
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Button href="/donasi" variant="gold" size="lg" className="w-full sm:w-auto shadow-xl">
              <HeartHandshake className="w-5 h-5 text-[var(--green-950)]" />
              <span>Salurkan Donasi Sekarang</span>
            </Button>
            <Button
              href="/tentang"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-white border-[var(--gold-500)]/40 hover:bg-[var(--gold-500)]/15"
            >
              <span>Profil &amp; Visi Lembaga</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
