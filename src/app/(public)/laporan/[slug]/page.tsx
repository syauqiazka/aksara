import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db/api";
import { ArrowLeft, Users, Download } from "lucide-react";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const report = await db.getReportBySlug(slug);
  if (!report) return { title: "Laporan Tidak Ditemukan" };
  return {
    title: `${report.title} | Laporan Sahabat Aksara`,
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
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)]">
      {/* 1. Page Header Terpadu */}
      <PageHeader
        eyebrow={`Periode: ${report.period_start} s/d ${report.period_end} &bull; Program ${report.program.replace("_", " ")}`}
        title={report.title}
        subtitle={report.summary}
        breadcrumbs={[
          { label: "Laporan", href: "/laporan" },
          { label: report.title },
        ]}
      />

      {/* 2. Key Audit Highlights Strip */}
      <section className="bg-[var(--green-950)] text-[var(--cream-50)] border-b border-[var(--gold-500)]/20 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--gold-400)]" />
            <span>
              <strong className="text-[var(--gold-300)]">{report.beneficiaries.toLocaleString("id-ID")}</strong> Penerima Manfaat
            </span>
          </div>
          {report.amount_idr && (
            <div className="flex items-center gap-2">
              <span className="font-serif text-[var(--gold-400)] font-bold">Rp</span>
              <span>
                Alokasi Dana: <strong className="text-[var(--gold-300)] font-mono">Rp {report.amount_idr.toLocaleString("id-ID")}</strong>
              </span>
            </div>
          )}
          {report.pdf_url && (
            <a
              href={report.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--green-900)] text-[var(--gold-300)] border border-[var(--gold-500)]/40 hover:bg-[var(--gold-500)]/20 transition-colors text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Berkas PDF Audit</span>
            </a>
          )}
        </div>
      </section>

      {/* 3. Main Report Body */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-12">
        {report.cover_url && (
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-xl border border-[var(--cream-200)] bg-[var(--green-950)]">
            <Image
              src={report.cover_url}
              alt={report.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>
        )}

        <article className="prose prose-lg max-w-none text-[var(--ink-900)] leading-relaxed space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] text-base font-medium text-[var(--ink-600)] italic leading-relaxed">
            {report.summary}
          </div>

          <div className="whitespace-pre-line text-base text-[var(--ink-600)] pt-4 leading-loose font-sans">
            {report.body}
          </div>
        </article>

        {/* Gallery if present */}
        {report.gallery_urls && report.gallery_urls.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[var(--cream-200)] space-y-6">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold-700)] font-semibold">
                Arsip Visual
              </div>
              <h3 className="font-serif text-2xl font-bold text-[var(--ink-900)] mt-1">
                Dokumentasi Serah Terima &amp; Kegiatan
              </h3>
            </div>
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
            <span>Kembali ke Seluruh Laporan</span>
          </Link>
          <Button href="/donasi" variant="gold" size="md">
            Ikut Berkontribusi di Program Berikutnya
          </Button>
        </div>
      </section>
    </div>
  );
}
