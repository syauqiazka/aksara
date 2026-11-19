import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { portfolioContent } from "@/content/portfolio";
import {
  ArrowLeft,
  CheckCircle2,
  Building,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import PrintButton from "./PrintButton";

interface GuidebookPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: GuidebookPageProps): Promise<Metadata> {
  const { id } = await params;
  const app = portfolioContent.find((p) => p.id === id);
  if (!app) return { title: "Guidebook Tidak Ditemukan" };

  return {
    title: `Guidebook ${app.name} | Yayasan Sahabat Aksara`,
    description: `Buku Panduan Teknis & Implementasi Resmi ${app.name} - Yayasan Sahabat Aksara.`,
  };
}

export default async function GuidebookPage({ params }: GuidebookPageProps) {
  const { id } = await params;
  const app = portfolioContent.find((p) => p.id === id);

  if (!app || !app.hasGuidebook) {
    notFound();
  }

  const chapters = app.guidebookChapters || [];

  return (
    <div className="min-h-screen bg-[#1c211e] text-[var(--ink-900)] py-8 px-4 print:p-0 print:bg-white">
      {/* FLOATING TOP ACTION BAR (HIDDEN IN PRINT) */}
      <header aria-label="Aksi Dokumen Guidebook" className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-[var(--green-950)] text-white border border-[var(--gold-500)]/30 shadow-lg print:hidden">
        <Link
          href="/portofolio"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--cream-100)] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Portofolio</span>
        </Link>

        <div className="flex items-center gap-2">
          <PrintButton />
        </div>
      </header>

      {/* A4 PRINTABLE DOCUMENT CONTAINER */}
      <main className="max-w-4xl mx-auto space-y-8 print:space-y-0">
        
        {/* ================= PAGE 1 ================= */}
        <div className="bg-white rounded-2xl p-8 sm:p-14 shadow-2xl border border-gray-200 min-h-[1050px] flex flex-col justify-between print:rounded-none print:shadow-none print:border-none print:min-h-screen print:page-break-after">
          <div>
            {/* Header Letterhead */}
            <div className="flex items-center justify-between pb-6 border-b-2 border-[var(--green-900)] mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[var(--green-950)] relative overflow-hidden flex items-center justify-center border border-[var(--gold-500)]/40 shadow-sm">
                  <Image
                    src="/images/logo-sahabat-aksara.jpg"
                    alt="Logo Sahabat Aksara"
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-[var(--green-950)] leading-tight">
                    YAYASAN SAHABAT AKSARA
                  </h2>
                  <p className="text-xs text-[var(--ink-600)] uppercase tracking-wider font-semibold">
                    Yayasan Ajirasa Aksara Semesta &mdash; AHU-0002692.AH.01.04.2026
                  </p>
                  <p className="text-xs text-[var(--gold-700)] font-medium">
                    Pilar IV: Teknologi &amp; Kemandirian Digital Ummat
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-[var(--cream-100)] text-[var(--green-900)] border border-[var(--cream-200)]">
                  Dokumen Resmi
                </span>
                <p className="text-[11px] text-[var(--ink-500)] mt-1 font-mono">
                  GB-{app.id.toUpperCase()}-2026
                </p>
              </div>
            </div>

            {/* Document Hero */}
            <div className="text-center py-6 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold-700)]">
                Buku Panduan Teknis &amp; Implementasi
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--green-950)]">
                {app.name}
              </h1>
              <p className="text-sm font-medium text-[var(--ink-700)] max-w-lg mx-auto">
                {app.tagline}
              </p>
            </div>

            {/* THE REQUESTED PROMINENT CALLOUT BOX */}
            <div className="p-5 rounded-2xl bg-[var(--gold-400)]/15 border-2 border-[var(--gold-500)]/40 text-[var(--ink-900)] space-y-2 mb-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gold-800)]">
                <Sparkles className="w-4 h-4 text-[var(--gold-600)]" />
                <span>Ketentuan Kemitraan &amp; Hak Penggunaan</span>
              </div>
              <p className="text-base font-bold text-[var(--green-950)] leading-snug">
                &ldquo;Dapatkan dengan berinfak Al-Qur&apos;an (Rp. 200.000,-) + Donasi Seikhlasnya&rdquo;
              </p>
              <p className="text-xs text-[var(--ink-700)] leading-relaxed">
                Setiap paket implementasi piranti lunak ini dialokasikan langsung untuk pencetakan dan penyaluran 
                mushaf Al-Qur&apos;an Jinan bagi santri penghafal Al-Qur&apos;an serta lembaga pendidikan Islam di pelosok nusantara.
              </p>
            </div>

            {/* Ringkasan & Bab 1 */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-[var(--green-900)] flex items-center gap-2">
                <Building className="w-5 h-5 text-[var(--green-700)]" />
                1. Deskripsi &amp; Sasaran Pengguna
              </h3>
              <p className="text-sm text-[var(--ink-700)] leading-relaxed text-justify">
                {app.description}
              </p>
            </div>

            {chapters[0] && (
              <div className="space-y-3 pt-6">
                <h3 className="font-serif font-bold text-lg text-[var(--green-900)]">
                  2. {chapters[0].title}
                </h3>
                <p className="text-xs text-[var(--ink-600)] italic">
                  {chapters[0].subtitle}
                </p>
                <div className="grid grid-cols-1 gap-2.5 pt-2">
                  {chapters[0].bullets.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[var(--ink-800)]">
                      <CheckCircle2 className="w-4 h-4 text-[var(--green-700)] flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[var(--green-700)]" />
              <span>Dokumen Sahabat Aksara Semesta &mdash; Hak Cipta Dilindungi</span>
            </div>
            <div className="font-mono">Halaman 1 dari 3</div>
          </div>
        </div>

        {/* ================= PAGE 2 ================= */}
        <div className="bg-white rounded-2xl p-8 sm:p-14 shadow-2xl border border-gray-200 min-h-[1050px] flex flex-col justify-between print:rounded-none print:shadow-none print:border-none print:min-h-screen print:page-break-after">
          <div>
            {/* Header Mini */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-8">
              <span className="font-serif font-bold text-sm text-[var(--green-950)]">
                {app.name} &mdash; Panduan Teknis
              </span>
              <span className="text-xs text-[var(--ink-500)] font-mono">
                Bagian II: Modul Fungsional
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold-700)]">
                  Fitur &amp; Kemampuan Sistem
                </span>
                <h2 className="font-serif text-2xl font-bold text-[var(--green-950)] mt-1">
                  {chapters[1] ? chapters[1].title : "Rincian Fitur Unggulan"}
                </h2>
                <p className="text-xs text-[var(--ink-600)] italic mt-1">
                  {chapters[1]?.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {(chapters[1]?.bullets || app.features).map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] flex items-start gap-3.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[var(--green-900)] text-[var(--gold-400)] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--ink-900)]">
                        Modul #{idx + 1}
                      </div>
                      <p className="text-xs text-[var(--ink-700)] mt-0.5 leading-relaxed">
                        {feat}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4">
                <h3 className="font-serif font-bold text-base text-[var(--green-900)]">
                  Spesifikasi Lingkungan &amp; Perangkat
                </h3>
                <table className="w-full text-left text-xs border border-[var(--cream-200)] rounded-xl overflow-hidden">
                  <tbody className="divide-y divide-[var(--cream-200)]">
                    <tr className="bg-[var(--cream-50)]">
                      <td className="py-2.5 px-4 font-semibold text-[var(--ink-800)] w-1/3">
                        Platform Pengguna
                      </td>
                      <td className="py-2.5 px-4 text-[var(--ink-700)]">
                        Android OS 8.0 (Oreo) ke atas &amp; Akses Web Browser
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-[var(--ink-800)]">
                        Konsol Manajemen
                      </td>
                      <td className="py-2.5 px-4 text-[var(--ink-700)]">
                        Web Admin Dashboard Responsif (PC / Laptop / Tablet)
                      </td>
                    </tr>
                    <tr className="bg-[var(--cream-50)]">
                      <td className="py-2.5 px-4 font-semibold text-[var(--ink-800)]">
                        Penyimpanan &amp; Database
                      </td>
                      <td className="py-2.5 px-4 text-[var(--ink-700)]">
                        Cloud Database Terenkripsi SSL dengan Backup Otomatis
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[var(--green-700)]" />
              <span>Dokumen Sahabat Aksara Semesta &mdash; Hak Cipta Dilindungi</span>
            </div>
            <div className="font-mono">Halaman 2 dari 3</div>
          </div>
        </div>

        {/* ================= PAGE 3 ================= */}
        <div className="bg-white rounded-2xl p-8 sm:p-14 shadow-2xl border border-gray-200 min-h-[1050px] flex flex-col justify-between print:rounded-none print:shadow-none print:border-none print:min-h-screen">
          <div>
            {/* Header Mini */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-8">
              <span className="font-serif font-bold text-sm text-[var(--green-950)]">
                {app.name} &mdash; Panduan Teknis
              </span>
              <span className="text-xs text-[var(--ink-500)] font-mono">
                Bagian III: SOP Implementasi
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold-700)]">
                  Tata Kelola Kemitraan
                </span>
                <h2 className="font-serif text-2xl font-bold text-[var(--green-950)] mt-1">
                  {chapters[2] ? chapters[2].title : "SOP Penerapan & Kontak Bantuan"}
                </h2>
                <p className="text-xs text-[var(--ink-600)] italic mt-1">
                  Empat tahapan pengaktifan sistem di sekolah, lembaga, atau pemukiman warga
                </p>
              </div>

              {/* 4 STEPS */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--ink-900)]">
                      Konfirmasi Kemitraan &amp; Penyaluran Infak Al-Qur&apos;an
                    </h4>
                    <p className="text-xs text-[var(--ink-600)] mt-1 leading-relaxed">
                      Lembaga mitra menghubungi pengurus yayasan dan menyalurkan paket infak mushaf Rp 200.000,- + donasi seikhlasnya untuk santri pelosok nusantara.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--ink-900)]">
                      Pembuatan Database Instansi &amp; Akun Administrator
                    </h4>
                    <p className="text-xs text-[var(--ink-600)] mt-1 leading-relaxed">
                      Tim IT Yayasan Sahabat Aksara menyiapkan server instansi khusus dan memberikan akun login master pengelola.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--ink-900)]">
                      Sosialisasi Poster &amp; Distribusi Akun Pengguna
                    </h4>
                    <p className="text-xs text-[var(--ink-600)] mt-1 leading-relaxed">
                      Pengurus mencetak materi poster untuk sosialisasi ke wali murid/warga dan mendistribusikan akun pengguna.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--ink-900)]">
                      Layanan Pemeliharaan &amp; Konsultasi Berkelanjutan
                    </h4>
                    <p className="text-xs text-[var(--ink-600)] mt-1 leading-relaxed">
                      Dukungan konsultasi teknis via WhatsApp tanpa adanya biaya lisensi bulanan yang memberatkan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pengesahan Lembaga */}
              <div className="p-6 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-200)] flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
                <div>
                  <h4 className="font-serif font-bold text-[var(--green-950)] text-base">
                    Layanan Kemitraan Sahabat Aksara
                  </h4>
                  <p className="text-xs text-[var(--ink-600)] mt-1">
                    Hotline WhatsApp: <strong>0822-6217-0018</strong>
                  </p>
                  <p className="text-xs text-[var(--ink-600)]">
                    Website: sahabataksarasemesta.org
                  </p>
                </div>

                <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-[var(--cream-300)] pt-4 sm:pt-0 sm:pl-6">
                  <div className="text-xs text-[var(--ink-500)] uppercase font-semibold">
                    Pengurus Yayasan
                  </div>
                  <div className="font-serif font-bold text-sm text-[var(--ink-900)] mt-3">
                    Ahmad Dahlan, S.Ag.
                  </div>
                  <div className="text-xs text-[var(--green-800)] font-medium">
                    Ketua Pembina Yayasan
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[var(--green-700)]" />
              <span>Dokumen Sahabat Aksara Semesta &mdash; Hak Cipta Dilindungi</span>
            </div>
            <div className="font-mono">Halaman 3 dari 3</div>
          </div>
        </div>

      </main>
    </div>
  );
}
