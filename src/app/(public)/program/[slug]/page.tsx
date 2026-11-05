import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { programsContent } from "@/content/programs";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { CheckCircle2, HeartHandshake, Target, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const program = programsContent.find((p) => p.slug === slug || p.aliases?.includes(slug));
  if (!program) return { title: "Program Tidak Ditemukan" };
  return {
    title: `${program.title} | Program Yayasan Sahabat Aksara`,
    description: program.shortDesc,
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = programsContent.find((p) => p.slug === slug || p.aliases?.includes(slug));

  if (!program) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)]">
      {/* 1. Page Header Terpadu */}
      <PageHeader
        eyebrow={`Pilar: ${program.pillar}`}
        title={program.title}
        subtitle={program.shortDesc}
        breadcrumbs={[
          { label: "Program", href: "/program" },
          { label: program.title },
        ]}
      />

      {/* 2. Main Content & Participation Sidebar (8:4 Layout) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Article (8 Kolom) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Visual Header Mihrab */}
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border-2 border-[var(--gold-500)]/40 shadow-xl bg-[var(--green-950)]">
              <Image
                src={program.heroImage}
                alt={program.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-950)]/70 via-transparent to-transparent" />
              {program.pricePerUnit && (
                <div className="absolute bottom-6 right-6 bg-gold-gradient text-[var(--green-950)] text-xs font-bold font-mono px-4 py-1.5 rounded-full shadow-lg">
                  {program.pricePerUnit}
                </div>
              )}
            </div>

            {program.quote && (
              <blockquote className="p-6 rounded-2xl bg-[var(--cream-100)] border-l-4 border-[var(--gold-600)] italic font-serif text-base sm:text-lg text-[var(--ink-600)] leading-relaxed">
                &ldquo;{program.quote}&rdquo;
              </blockquote>
            )}

            {/* Overview */}
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold-700)] font-semibold">
                Latar Belakang &amp; Sasaran
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
                Ikhtisar Khidmat Program
              </h2>
              <div className="w-16 h-1 bg-[var(--gold-600)] rounded-full mb-4" />
              <div className="space-y-4 text-sm sm:text-base text-[var(--ink-600)] leading-relaxed font-sans">
                {program.overview.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* Impact Highlights */}
            <div className="space-y-4 pt-6 border-t border-[var(--cream-200)]">
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--green-700)] font-semibold">
                Keunggulan &amp; Dampak Nyata
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
                Dampak Khidmat yang Dihadirkan
              </h2>
              <div className="space-y-3 pt-2">
                {program.impactPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-200)]">
                    <CheckCircle2 className="w-5 h-5 text-[var(--green-700)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-[var(--ink-900)]">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Participation Sidebar (4 Kolom) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--green-950)] text-[var(--cream-50)] border-2 border-[var(--gold-500)]/40 shadow-2xl space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold-400)] block mb-1">
                  Partisipasi Donasi
                </span>
                <h3 className="font-serif text-2xl font-bold text-[var(--cream-50)]">
                  Langkah Mengambil Bagian
                </h3>
              </div>

              {program.targetMushafOrGoal && (
                <div className="p-3.5 rounded-2xl bg-[var(--green-900)]/70 border border-[var(--gold-500)]/25 flex items-center gap-2.5 text-xs text-[var(--gold-300)]">
                  <Target className="w-4 h-4 text-[var(--gold-400)] flex-shrink-0" />
                  <span>Target: <strong>{program.targetMushafOrGoal}</strong></span>
                </div>
              )}

              <div className="space-y-3 pt-2">
                {program.howToJoin.map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-xs sm:text-sm text-[var(--cream-100)]">
                    <div className="w-6 h-6 rounded-full bg-[var(--gold-500)] text-[var(--green-950)] font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      {idx + 1}
                    </div>
                    <p className="leading-snug">{step}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[var(--gold-500)]/20 space-y-3">
                <Button href="/donasi" variant="gold" size="lg" className="w-full shadow-lg">
                  <HeartHandshake className="w-5 h-5 text-[var(--green-950)]" />
                  <span>Salurkan Donasi</span>
                </Button>
                <Link
                  href="/data-sebaran"
                  className="w-full py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--gold-300)] hover:text-white"
                >
                  <span>Pantau Penyaluran di Data Sebaran</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
