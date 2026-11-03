import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db/api";
import { ArrowLeft, Calendar, Users, DollarSign, Download, Share2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const report = await db.getReportBySlug(slug);
  if (!report) return { title: "Laporan Tidak Ditemukan" };
  return {
    title: report.title,
    description: report.summary,
  };
}

export default async function LaporanDetailPage({ params }: Props) {
  const { slug } = await params;
  const report = await db.getReportBySlug(slug);

  if (!report) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)] pt-20">
      {/* Detail Hero */}
      <section className="relative py-20 bg-[var(--green-950)] text-[var(--cream-50)] px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-islamic-stars opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <Link
            href="/laporan"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--gold-400)] hover:text-[var(--gold-300)] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Seluruh Laporan</span>
          </Link>

          <div className="flex items-center gap-3 text-xs text-[var(--gold-400)] uppercase tracking-wider mb-4 font-semibold">
            <span>Periode: {report.period_start} s/d {report.period_end}</span>
            <span>&bull;</span>
            <span>Program: {report.program.replace("_", " ")}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[var(--cream-50)]">
            {report.title}
          </h1>

          <div className="mt-8 pt-6 border-t border-[var(--gold-500)]/30 flex flex-wrap items-center gap-6 text-sm text-[var(--cream-100)]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--gold-400)]" />
              <span>{report.beneficiaries.toLocaleString("id-ID")} Penerima Manfaat</span>
            </div>
            {report.amount_idr && (
              <div className="flex items-center gap-2">
                <span className="font-serif text-[var(--gold-400)] font-bold">Rp</span>
                <span>{report.amount_idr.toLocaleString("id-ID")} Dana Tersalurkan</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Body */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {report.cover_url && (
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-12 shadow-xl border border-[var(--cream-200)] bg-[var(--green-950)]">
            <Image
              src={report.cover_url}
              alt={report.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        )}

        <article className="prose prose-lg max-w-none text-[var(--ink-900)] leading-relaxed space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-200)] text-base font-medium text-[var(--ink-600)] italic leading-relaxed">
            {report.summary}
          </div>

          <div className="whitespace-pre-line text-base text-[var(--ink-600)] pt-4 leading-loose">
            {report.body}
          </div>
        </article>

        {/* Gallery if present */}
        {report.gallery_urls && report.gallery_urls.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[var(--cream-200)]">
            <h3 className="font-serif text-2xl font-bold text-[var(--ink-900)] mb-6">
              Dokumentasi Foto Serah Terima
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.gallery_urls.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--cream-200)] bg-[var(--green-950)]">
                  <Image
                    src={img}
                    alt={`Dokumentasi ${report.title} #${idx + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="mt-16 pt-8 border-t border-[var(--cream-200)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/laporan"
            className="text-xs font-semibold text-[var(--green-800)] hover:text-[var(--gold-700)] flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lihat Laporan Lainnya</span>
          </Link>
          <Button href="/donasi" variant="gold" size="md">
            Ikut Berkontribusi di Program Berikutnya
          </Button>
        </div>
      </section>
    </div>
  );
}

