import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db/api";
import { Sparkles, Calendar, Users, FileText, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";

export const metadata = {
  title: "Laporan Penyaluran Program",
  description:
    "Laporan pertanggungjawaban terbuka dan transparan kegiatan penyaluran wakaf mushaf Al-Qur'an, Geber Masjid, dan program dakwah Yayasan Sahabat Aksara.",
};

export default async function LaporanPage() {
  const reports = await db.getReports(true);

  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)] pt-20">
      {/* Hero Header */}
      <section className="relative py-20 bg-[var(--green-950)] text-[var(--cream-50)] px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-islamic-stars opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--green-900)] border border-[var(--gold-500)]/40 text-[var(--gold-300)] text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-[var(--gold-400)]" />
            <span>Akuntabilitas & Keterbukaan Publik</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold [text-wrap:balance]">
            Laporan Penyaluran Program Terbuka
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[var(--cream-100)]/90 max-w-2xl mx-auto leading-relaxed">
            Mencontoh standar yayasan profesional terkemuka, kami mempublikasikan laporan penerima manfaat, anggaran terserap, dan dokumentasi lapangan secara berkala.
          </p>
        </div>
      </section>

      {/* Reports List */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-[var(--cream-100)] rounded-3xl overflow-hidden border border-[var(--cream-200)] flex flex-col justify-between hover:border-[var(--gold-500)] hover:shadow-xl transition-all group"
            >
              <div>
                {rep.cover_url && (
                  <div className="relative h-52 w-full overflow-hidden bg-[var(--green-950)]">
                    <Image
                      src={rep.cover_url}
                      alt={rep.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs text-[var(--gold-700)] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{rep.period_start} s/d {rep.period_end}</span>
                    </span>
                    <Badge variant="neutral">
                      {rep.program.replace("_", " ")}
                    </Badge>
                  </div>

                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink-900)] mb-3 leading-snug group-hover:text-[var(--green-800)] transition-colors">
                    {rep.title}
                  </h2>

                  <p className="text-sm text-[var(--ink-600)] line-clamp-3 mb-6 leading-relaxed">
                    {rep.summary}
                  </p>

                  <div className="flex items-center justify-between text-xs py-3 border-y border-[var(--cream-200)] text-[var(--ink-900)] font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[var(--green-700)]" />
                      <span>{rep.beneficiaries.toLocaleString("id-ID")} Penerima</span>
                    </div>
                    {rep.amount_idr && (
                      <div className="text-[var(--gold-700)]">
                        Rp {rep.amount_idr.toLocaleString("id-ID")}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/laporan/${rep.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

