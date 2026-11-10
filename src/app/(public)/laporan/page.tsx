import { Metadata } from "next";
import Link from "next/link";
import { formatTanggal } from "@/lib/format-date";
import { db } from "@/lib/db/api";
import { Calendar, Users, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import SafeImage from "@/components/ui/SafeImage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Laporan Penyaluran & Audit Terbuka | Yayasan Sahabat Aksara",
  description:
    "Laporan pertanggungjawaban terbuka dan transparan kegiatan penyaluran wakaf mushaf Al-Qur'an, Geber Masjid, dan program dakwah Yayasan Sahabat Aksara.",
  alternates: {
    canonical: "/laporan",
  },
  openGraph: {
    title: "Laporan Penyaluran & Akuntabilitas Publik | Sahabat Aksara",
    description:
      "Akses laporan audit program, jumlah penerima manfaat, dan alokasi dana amanah donasi Yayasan Sahabat Aksara.",
    url: "/laporan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laporan Penyaluran & Akuntabilitas Publik | Sahabat Aksara",
    description: "Akses laporan audit program, jumlah penerima manfaat, dan alokasi dana amanah donasi.",
    images: ["/images/logo-sahabat-aksara.jpg"],
  },
};

export default async function LaporanPage() {
  const reports = await db.getReports(true);

  // Kalkulasi total agregat akuntabilitas
  const totalBeneficiaries = reports.reduce((acc, r) => acc + (r.beneficiaries || 0), 0);
  const totalAmount = reports.reduce((acc, r) => acc + (r.amount_idr || 0), 0);

  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)]">
      {/* 1. PAGE HEADER RESMI */}
      <PageHeader
        eyebrow="Akuntabilitas &amp; Keterbukaan Publik"
        title="Laporan Penyaluran Program Terbuka"
        subtitle="Mencontoh standar yayasan profesional terkemuka, kami mempublikasikan data penerima manfaat, anggaran terserap, serta dokumentasi serah terima secara berkala."
        breadcrumbs={[{ label: "Laporan" }]}
      />

      {/* 2. AGGREGATE AUDIT BAR */}
      <section className="bg-[var(--green-950)] text-[var(--cream-50)] border-b border-[var(--gold-500)]/20 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[var(--gold-500)]/20">
          <div className="pt-2 md:pt-0 md:px-6 first:pt-0 first:px-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold-400)] mb-1">
              Total Dana Penyaluran
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient">
              Rp {totalAmount.toLocaleString("id-ID")}
            </div>
            <div className="text-xs text-[var(--cream-200)]/70 mt-0.5">
              Tercatat dalam rekam jejak program
            </div>
          </div>

          <div className="pt-4 md:pt-0 md:px-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold-400)] mb-1">
              Akumulasi Penerima Manfaat
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[var(--cream-50)]">
              {totalBeneficiaries.toLocaleString("id-ID")}+ Santri &amp; Jamaah
            </div>
            <div className="text-xs text-[var(--cream-200)]/70 mt-0.5">
              Di pelosok dan daerah binaan
            </div>
          </div>

          <div className="pt-4 md:pt-0 md:px-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold-400)] mb-1">
              Status Verifikasi Publik
            </div>
            <div className="flex items-center gap-2 font-serif text-xl sm:text-2xl font-bold text-[var(--cream-50)]">
              <ShieldCheck className="w-6 h-6 text-[var(--gold-400)]" />
              <span>100% Terbuka &amp; Tervalidasi</span>
            </div>
            <div className="text-xs text-[var(--cream-200)]/70 mt-0.5">
              Dilengkapi berita acara &amp; foto
            </div>
          </div>
        </div>
      </section>

      {/* 3. REPORTS LIST SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--cream-200)] pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
              Arsip Laporan Penyaluran Resmi
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-1">
              Menampilkan {reports.length} laporan kegiatan dan pertanggungjawaban amanah donasi.
            </p>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] text-center max-w-lg mx-auto space-y-3">
            <FileText className="w-12 h-12 text-[var(--ink-400)] opacity-40 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[var(--ink-900)]">
              Belum Ada Arsip Laporan
            </h3>
            <p className="text-sm text-[var(--ink-600)] leading-relaxed font-sans">
              Laporan pertanggungjawaban penyaluran dan audit program akan dipublikasikan secara berkala setelah proses verifikasi lapangan selesai.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((rep) => {
              const displayCover =
                rep.cover_url ||
                (rep.gallery_urls && rep.gallery_urls.length > 0 ? rep.gallery_urls[0] : null);

              return (
                <div
                  key={rep.id}
                  className="bg-[var(--cream-100)] rounded-3xl overflow-hidden border border-[var(--cream-200)] flex flex-col justify-between hover:border-[var(--gold-500)]/80 hover:shadow-xl transition-all duration-300 group"
                >
                  <div>
                    {displayCover && (
                      <div className="relative h-56 w-full overflow-hidden bg-[var(--green-950)]">
                        <SafeImage
                          src={displayCover}
                          alt={rep.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-950)]/70 via-transparent to-transparent" />
                      </div>
                    )}

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-[var(--gold-700)] font-semibold uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatTanggal(rep.period_start)} s/d {formatTanggal(rep.period_end)}</span>
                      </span>
                      <Badge variant="neutral">
                        {rep.program.replace("_", " ")}
                      </Badge>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink-900)] leading-snug group-hover:text-[var(--green-800)] transition-colors">
                      {rep.title}
                    </h3>

                    <p className="text-sm text-[var(--ink-600)] line-clamp-3 leading-relaxed font-sans">
                      {rep.summary}
                    </p>

                    <div className="flex items-center justify-between text-xs py-3 border-y border-[var(--cream-200)] text-[var(--ink-900)] font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[var(--green-700)]" />
                        <span>{rep.beneficiaries.toLocaleString("id-ID")} Penerima</span>
                      </div>
                      {rep.amount_idr && (
                        <div className="text-[var(--gold-700)] font-mono">
                          Rp {rep.amount_idr.toLocaleString("id-ID")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/laporan/${rep.slug}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Baca Laporan Transparan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </section>
    </div>
  );
}
