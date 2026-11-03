import Image from "next/image";
import Link from "next/link";
import { programsContent } from "@/content/programs";
import Button from "@/components/ui/Button";
import { ArrowRight, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Program Lembaga",
  description:
    "Jelajahi 6 program unggulan Yayasan Sahabat Aksara: Infak 1 Jt Al-Qur'an Custom Nama, Geber Masjid, Majlis Tasmi' 30 Juz, PENA Anak Yatim, Bela Berdikari, dan UMKM Berkah.",
};

export default function ProgramPage() {
  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)] pt-20">
      {/* Hero Header */}
      <section className="relative py-20 bg-[var(--green-950)] text-[var(--cream-50)] px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-islamic-stars opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--green-900)] border border-[var(--gold-500)]/40 text-[var(--gold-300)] text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-[var(--gold-400)]" />
            <span>Portofolio Pengabdian Umat</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold [text-wrap:balance]">
            Program Nyata Menjawab Kebutuhan Ummat
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[var(--cream-100)]/90 max-w-2xl mx-auto leading-relaxed">
            Dari mushaf tahfidz pelosok desa hingga pemakmuran rumah Allah dan kemandirian ekonomi dhuafa.
          </p>
        </div>
      </section>

      {/* Program Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programsContent.map((prog, idx) => (
            <div
              key={prog.slug}
              className="bg-[var(--cream-100)] rounded-3xl overflow-hidden border border-[var(--cream-200)] flex flex-col justify-between hover:border-[var(--gold-500)] hover:shadow-2xl transition-all duration-300 group"
            >
              <div>
                <div className="relative h-60 w-full overflow-hidden shape-mihrab bg-[var(--green-950)]">
                  <Image
                    src={prog.heroImage}
                    alt={prog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 bg-[var(--green-950)]/90 text-[var(--gold-300)] text-xs font-bold px-3 py-1 rounded-full border border-[var(--gold-500)]/40">
                    {prog.pillar}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-2xl font-bold text-[var(--ink-900)] mb-2 group-hover:text-[var(--green-800)] transition-colors">
                    {prog.title}
                  </h3>
                  <p className="text-sm text-[var(--ink-600)] leading-relaxed mb-4">
                    {prog.shortDesc}
                  </p>

                  {prog.pricePerUnit && (
                    <div className="inline-block px-3 py-1 rounded-lg bg-[var(--gold-500)]/15 text-[var(--gold-700)] text-xs font-bold mb-3">
                      {prog.pricePerUnit}
                    </div>
                  )}

                  <div className="space-y-1.5 pt-3 border-t border-[var(--cream-200)]">
                    {prog.impactPoints.slice(0, 2).map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-[var(--ink-600)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--green-700)] flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/program/${prog.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm"
                >
                  <span>Detail & Cara Ikut</span>
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

