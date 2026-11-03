import Image from "next/image";
import Link from "next/link";
import {
  HeartHandshake,
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Award,
  Users2,
  Building,
  Calculator,
} from "lucide-react";
import { db } from "@/lib/db/api";
import { organizationContent } from "@/content/organization";
import Preloader from "@/components/motion/Preloader";
import StatCounter from "@/components/motion/StatCounter";
import AksaraMarquee from "@/components/motion/AksaraMarquee";
import AnnouncementTicker from "@/components/sections/AnnouncementTicker";
import HeroShowcase from "@/components/sections/HeroShowcase";
import InfaqCalculator from "@/components/sections/InfaqCalculator";
import HomeProgramsTab from "@/components/sections/HomeProgramsTab";
import IndonesiaMap from "@/components/sections/IndonesiaMap";
import HomeFAQ from "@/components/sections/HomeFAQ";
import Button from "@/components/ui/Button";

export default async function HomePage() {
  const stats = await db.getAggregatedStats();
  const infakList = await db.getInfakDistributions(true);
  const reports = await db.getReports(true);
  const recentReports = reports.slice(0, 3);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Preloader />

      {/* 1. TOP ANNOUNCEMENT TICKER (Bazma / SMK TI Bazma Style) */}
      <AnnouncementTicker />

      {/* 2. SPLIT HERO SHOWCASE WITH FLOATING LIVE BADGES */}
      <HeroShowcase totalMushaf={stats.totalMushaf} totalMasjid={stats.totalMasjid} />

      {/* 3. INTERACTIVE IMPACT CALCULATOR (Kalkulator Kebaikan Langsung di Beranda) */}
      <section className="py-16 bg-[var(--green-900)] text-[var(--cream-50)] px-4 sm:px-6 lg:px-8 border-y border-[var(--gold-500)]/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-300)]">
              Simulasi Jariyah
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--cream-50)] mt-2">
              Kalkulator Kebaikan Mushaf
            </h2>
            <p className="text-xs sm:text-sm text-[var(--cream-200)]/80 mt-2">
              Pilih jumlah mushaf atau tentukan nama custom yang ingin diabadikan di lembar Al-Qur&apos;an santri pelosok.
            </p>
          </div>

          <InfaqCalculator />
        </div>
      </section>

      {/* 4. MARQUEE NILAI (A-K-S-A-R-A) */}
      <AksaraMarquee />

      {/* 5. DYNAMIC STATS COUNTER GRID */}
      <section className="relative py-20 bg-[var(--green-950)] text-[var(--cream-50)] border-b border-[var(--gold-500)]/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-400)]">
              Capaian Khidmat Keumatan
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--cream-50)] mt-2">
              Amanah Terhimpun & Disalurkan
            </h2>
            <div className="w-16 h-1 bg-[var(--gold-500)] rounded-full mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCounter
              end={stats.totalMushaf}
              label="Mushaf Al-Qur'an Tersalurkan"
              sublabel="Cetak nama donatur di cover"
            />
            <StatCounter
              end={stats.totalMasjid}
              label="Masjid Dibersihkan"
              sublabel="Aksi Geber Masjid pelosok"
            />
            <StatCounter
              end={stats.totalProvinces}
              label="Provinsi Terjangkau"
              sublabel="Dari barat hingga timur"
            />
            <StatCounter
              end={stats.totalBeneficiaries}
              label="Penerima Manfaat"
              sublabel="Santri, dhuafa & jamaah"
            />
          </div>
        </div>
      </section>

      {/* 6. EMPAT PILAR UTAMA (Warm Cream Background) */}
      <section className="py-24 bg-[var(--cream-50)] text-[var(--ink-900)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-700)]">
              Fondasi Khidmat
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--ink-900)] mt-2 leading-tight [text-wrap:balance]">
              Empat Pilar Utama Khidmat Sahabat Aksara
            </h2>
            <div className="w-20 h-1 bg-[var(--gold-600)] rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {organizationContent.pillars.map((pilar, idx) => (
              <div
                key={pilar.id}
                className="group relative p-8 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] hover:border-[var(--gold-500)]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--green-800)] text-[var(--gold-400)] flex items-center justify-center font-serif text-xl font-bold mb-6 shadow-md group-hover:scale-110 transition-transform">
                    0{idx + 1}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[var(--ink-900)] mb-1">
                    {pilar.title}
                  </h3>
                  <p className="text-xs font-semibold text-[var(--gold-700)] uppercase tracking-wider mb-4">
                    {pilar.tagline}
                  </p>
                  <p className="text-sm text-[var(--ink-600)] leading-relaxed">
                    {pilar.description}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[var(--cream-200)] flex items-center justify-between text-xs font-bold text-[var(--green-800)]">
                  <span>Pilar Terpadu</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PROGRAM UNGGULAN DENGAN TAB PILAR (Bazma Style) */}
      <section className="py-24 bg-[var(--sage-100)] text-[var(--ink-900)] px-4 sm:px-6 lg:px-8 border-y border-[var(--sage-300)]/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
                Program Aksi Lapangan
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--ink-900)] mt-2 [text-wrap:balance]">
                Program Unggulan Sahabat Aksara
              </h2>
            </div>
            <Link
              href="/program"
              className="inline-flex items-center gap-2 font-semibold text-[var(--green-800)] hover:text-[var(--gold-700)] text-sm group"
            >
              <span>Lihat Seluruh 6 Program</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <HomeProgramsTab />
        </div>
      </section>

      {/* 8. PETA SEBARAN NASIONAL INTERAKTIF */}
      <section className="py-24 bg-[var(--green-950)] text-[var(--cream-50)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-400)]">
              Transparansi Geografis Real-Time
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--cream-50)] mt-2">
              Jejak Titik Penyaluran Nusantara
            </h2>
            <p className="text-sm text-[var(--cream-200)]/80 mt-3">
              Setiap mushaf Al-Qur&apos;an yang disalurkan dan masjid yang dibersihkan tercatat presisi di peta nasional ini.
            </p>
          </div>

          <IndonesiaMap infakData={infakList} activeTab="infak" />

          <div className="mt-8 text-center">
            <Button href="/data-sebaran" variant="gold" size="md">
              Buka Tabel & Detail Lengkap Data Sebaran &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* 9. KISAH FOUNDER & BIOGRAFI */}
      <section className="py-24 bg-[var(--cream-100)] text-[var(--ink-900)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Founder Portrait in Mihrab Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] shape-mihrab overflow-hidden border-4 border-[var(--gold-500)] shadow-2xl bg-[var(--green-950)]">
              <Image
                src="/images/founder-ahmad-dahlan.jpg"
                alt="Ahmad Dahlan, Founder Yayasan Sahabat Aksara"
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
                  {organizationContent.founder.role}
                </div>
              </div>
            </div>
          </div>

          {/* Founder Quote & Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-700)]">
              Kisah & Latar Belakang Perjuangan
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] leading-tight">
              Dari Keterbatasan Menuju Gerakan Satu Juta Mushaf
            </h2>

            <blockquote className="border-l-4 border-[var(--gold-600)] pl-4 italic text-base sm:text-lg text-[var(--ink-600)] font-serif leading-relaxed">
              &ldquo;{organizationContent.founder.quote}&rdquo;
            </blockquote>

            <p className="text-sm sm:text-base text-[var(--ink-600)] leading-relaxed">
              {organizationContent.founder.story[0]}
            </p>
            <p className="text-sm sm:text-base text-[var(--ink-600)] leading-relaxed">
              {organizationContent.founder.story[2]}
            </p>

            <div className="pt-4">
              <Link
                href="/tentang"
                className="inline-flex items-center gap-2 font-semibold text-[var(--green-800)] hover:text-[var(--gold-700)] text-sm group"
              >
                <span>Baca Kisah Lengkap & Makna Filosofis Logo</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. LAPORAN PENYALURAN TERBARU (Transparansi) */}
      <section className="py-24 bg-[var(--cream-50)] text-[var(--ink-900)] px-4 sm:px-6 lg:px-8 border-t border-[var(--cream-200)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-700)]">
                Akuntabilitas Publik
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--ink-900)] mt-2">
                Laporan Penyaluran Program
              </h2>
            </div>
            <Link
              href="/laporan"
              className="inline-flex items-center gap-2 font-semibold text-[var(--green-800)] hover:text-[var(--gold-700)] text-sm group"
            >
              <span>Semua Laporan & Audit</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentReports.map((rep) => (
              <div
                key={rep.id}
                className="bg-[var(--cream-100)] rounded-3xl p-6 border border-[var(--cream-200)] flex flex-col justify-between hover:border-[var(--gold-500)]/60 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="text-xs text-[var(--gold-700)] font-semibold uppercase tracking-wider mb-2">
                    Periode: {rep.period_start} s/d {rep.period_end}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[var(--ink-900)] mb-3 leading-snug">
                    {rep.title}
                  </h3>
                  <p className="text-sm text-[var(--ink-600)] line-clamp-3 mb-4">
                    {rep.summary}
                  </p>
                  <div className="text-xs text-[var(--green-800)] font-semibold">
                    &bull; {rep.beneficiaries.toLocaleString("id-ID")} Penerima Manfaat
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--cream-200)]">
                  <Link
                    href={`/laporan/${rep.slug}`}
                    className="text-xs font-bold text-[var(--green-800)] hover:text-[var(--gold-700)] flex items-center justify-between"
                  >
                    <span>Baca Laporan Transparan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ SECTION (Pertanyaan Umum Donatur) */}
      <section className="py-24 bg-[var(--cream-100)] text-[var(--ink-900)] px-4 sm:px-6 lg:px-8 border-t border-[var(--cream-200)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-700)]">
              Tanya Jawab Donatur
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] mt-2">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-sm text-[var(--ink-600)] mt-3">
              Informasi lengkap seputar mekanisme pencetakan nama donatur, legalitas yayasan, dan tata kelola penyaluran.
            </p>
          </div>

          <HomeFAQ />
        </div>
      </section>

      {/* 12. GRAND CALL TO ACTION */}
      <section className="py-24 bg-[var(--green-950)] text-[var(--cream-50)] text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--green-900)] border border-[var(--gold-500)]/40 text-[var(--gold-300)] text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-[var(--gold-400)]" />
            <span>Sedekah Jariyah Mengalir Tiada Putus</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold [text-wrap:balance]">
            Mari Mengukir Nama di Lembar Al-Qur&apos;an Santri Pelosok
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--cream-200)]/90 leading-relaxed max-w-xl">
            Setiap huruf yang dibaca dan dihafal akan terus mengalirkan pahala tanpa henti. Salurkan infak terbaik Anda hari ini.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Button href="/donasi" variant="gold" size="lg">
              <HeartHandshake className="w-5 h-5 text-[var(--green-950)]" />
              <span>Salurkan Donasi Sekarang</span>
            </Button>
            <Button href="/tentang" variant="secondary" size="lg" className="text-[var(--cream-50)]">
              Profil & Visi Lembaga
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
