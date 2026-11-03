import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { programsContent } from "@/content/programs";
import Button from "@/components/ui/Button";
import { CheckCircle2, ArrowLeft, HeartHandshake, HelpCircle, Target } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const program = programsContent.find((p) => p.slug === slug);
  if (!program) return { title: "Program Tidak Ditemukan" };
  return {
    title: program.title,
    description: program.shortDesc,
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = programsContent.find((p) => p.slug === slug);

  if (!program) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)] pt-20">
      {/* Detail Hero */}
      <section className="relative py-20 bg-[var(--green-950)] text-[var(--cream-50)] px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-islamic-stars opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <Link
            href="/program"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--gold-400)] hover:text-[var(--gold-300)] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Program</span>
          </Link>

          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--green-900)] text-[var(--gold-300)] border border-[var(--gold-500)]/30 mb-4">
            Pilar: {program.pillar}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold [text-wrap:balance] text-[var(--cream-50)]">
            {program.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[var(--cream-100)]/90 max-w-3xl leading-relaxed">
            {program.shortDesc}
          </p>

          {program.targetMushafOrGoal && (
            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--gold-500)] text-[var(--green-950)] text-xs font-bold">
                <Target className="w-4 h-4" />
                Target: {program.targetMushafOrGoal}
              </span>
              {program.pricePerUnit && (
                <span className="px-4 py-1.5 rounded-full bg-[var(--green-900)] text-[var(--gold-300)] border border-[var(--gold-500)]/40 text-xs font-bold">
                  {program.pricePerUnit}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main article */}
          <div className="lg:col-span-8 space-y-12">
            {/* Visual Header */}
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border-2 border-[var(--gold-500)]/40 shadow-xl bg-[var(--green-950)]">
              <Image
                src={program.heroImage}
                alt={program.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>

            {program.quote && (
              <blockquote className="p-6 rounded-2xl bg-[var(--cream-100)] border-l-4 border-[var(--gold-600)] italic font-serif text-base sm:text-lg text-[var(--ink-600)]">
                &ldquo;{program.quote}&rdquo;
              </blockquote>
            )}

            {/* Overview */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)] mb-4">
                Latar Belakang & Urgensi Program
              </h2>
              <div className="space-y-4 text-base text-[var(--ink-600)] leading-relaxed">
                {program.overview.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* Impact Highlights */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)] mb-4">
                Dampak & Keunggulan Khidmat
              </h2>
              <div className="space-y-3">
                {program.impactPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-200)]">
                    <CheckCircle2 className="w-5 h-5 text-[var(--green-700)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-[var(--ink-900)]">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Participation Sidebar */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 p-6 sm:p-8 rounded-3xl bg-[var(--green-950)] text-[var(--cream-50)] border-2 border-[var(--gold-500)]/40 shadow-2xl space-y-6">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--gold-500)] text-[var(--green-950)]">
                Cara Berpartisipasi
              </div>

              <h3 className="font-serif text-2xl font-bold text-[var(--cream-50)]">
                Langkah Bergabung dalam Amal Jariyah Ini
              </h3>

              <div className="space-y-4">
                {program.howToJoin.map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-xs sm:text-sm text-[var(--cream-100)]">
                    <div className="w-6 h-6 rounded-full bg-[var(--gold-500)] text-[var(--green-950)] font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="leading-snug">{step}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[var(--gold-500)]/30 space-y-3">
                <Button href="/donasi" variant="gold" size="lg" className="w-full">
                  <HeartHandshake className="w-5 h-5 text-[var(--green-950)]" />
                  <span>Donasi untuk Program Ini</span>
                </Button>
                <Link
                  href="/data-sebaran"
                  className="w-full py-3 flex items-center justify-center text-xs font-semibold text-[var(--gold-300)] hover:text-white"
                >
                  Lihat Peta Penyaluran &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

