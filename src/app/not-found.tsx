import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";

export const metadata = {
  title: "404 — Halaman Tidak Ditemukan | Yayasan Sahabat Aksara",
  description: "Halaman yang Anda tuju tidak ditemukan atau telah dipindahkan.",
};

export default function NotFound() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center bg-[var(--cream-50)] px-4 py-16">
      <div className="w-full max-w-xl mx-auto text-center">
        {/* Frame Mihrab Halus */}
        <div className="bg-white border border-[var(--gold-300)]/40 rounded-t-[5rem] rounded-b-2xl p-8 sm:p-12 shadow-[0_12px_32px_rgba(6,33,15,0.06)] relative overflow-hidden">
          {/* Aksen Latar Lembut */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[var(--gold-100)]/40 blur-2xl rounded-full pointer-events-none" />

          {/* Ikon Kompas / Pencarian Arah */}
          <div className="relative mx-auto w-16 h-16 rounded-full bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center mb-6 shadow-inner border border-[var(--gold-500)]/30">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>

          {/* Teks Arab Doa Petunjuk */}
          <div className="font-arabic text-xl sm:text-2xl text-[var(--green-900)] mb-3" dir="rtl" lang="ar">
            رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا
          </div>
          <p className="text-xs text-[var(--ink-500)] italic mb-6">
            &ldquo;Ya Tuhan kami, berikanlah rahmat kepada kami dari sisi-Mu dan sempurnakanlah petunjuk bagi kami dalam urusan kami.&rdquo; (QS. Al-Kahfi: 10)
          </p>

          {/* Angka Status 404 */}
          <span className="font-fraunces text-6xl sm:text-7xl font-bold tracking-tight text-[var(--gold-700)] block mb-2">
            404
          </span>

          <h1 className="font-fraunces text-2xl sm:text-3xl font-semibold text-[var(--ink-900)] mb-3">
            Halaman Tidak Ditemukan
          </h1>

          <p className="text-sm text-[var(--ink-700)] leading-relaxed max-w-md mx-auto mb-8">
            Tautan yang Anda tuju mungkin salah ketik, telah kami arsipkan, atau sedang dalam tahap pemutakhiran oleh pengurus yayasan.
          </p>

          {/* Tombol Aksi Pemulihan */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--green-950)] text-white hover:bg-[var(--green-900)] transition-colors text-sm font-medium shadow-sm cursor-pointer"
            >
              <Home className="w-4 h-4 text-[var(--gold-400)]" />
              Kembali ke Beranda
            </Link>
            <Link
              href="/data-sebaran"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[var(--gold-300)] bg-[var(--cream-100)] text-[var(--green-950)] hover:bg-[var(--cream-200)] transition-colors text-sm font-medium cursor-pointer"
            >
              <Search className="w-4 h-4 text-[var(--green-800)]" />
              Lihat Data Sebaran
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-[var(--ink-500)]">
            <Link href="/program" className="hover:text-[var(--green-800)] transition-colors underline underline-offset-2">
              Daftar Program
            </Link>
            <span className="text-[var(--cream-300)]">|</span>
            <Link href="/laporan" className="hover:text-[var(--green-800)] transition-colors underline underline-offset-2">
              Laporan Akuntabilitas
            </Link>
            <span className="text-[var(--cream-300)]">|</span>
            <Link href="/donasi" className="hover:text-[var(--green-800)] transition-colors underline underline-offset-2">
              Rekening Resmi
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
