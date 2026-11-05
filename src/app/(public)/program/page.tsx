import Image from "next/image";
import Link from "next/link";
import { programsContent } from "@/content/programs";
import PageHeader from "@/components/ui/PageHeader";
import { ArrowRight, CheckCircle2, BookOpen, Heart, GraduationCap } from "lucide-react";

export const metadata = {
  title: "8 Program Aksi Lembaga | Yayasan Sahabat Aksara",
  description:
    "Jelajahi program unggulan Yayasan Sahabat Aksara: Infak Al-Qur'an Jinan, BUSS Al-Qur'an, Geber Masjid, Majlis Tasmi' 30 Juz Bil-Ghoib, Yatim Berdikari, Beasiswa Pelatihan IT Mitra Produktif, Pemberdayaan UMKM, dan Bantuan Tematik Nusantara.",
};

export default function ProgramPage() {
  // Kelompokkan 8 program berdasarkan pilar
  const spiritualPrograms = programsContent.filter((p) => p.pillar.includes("Spiritual"));
  const socialPrograms = programsContent.filter((p) => p.pillar.includes("Sosial") && !p.pillar.includes("Spiritual"));
  const eduTechPrograms = programsContent.filter(
    (p) => p.pillar.includes("Pendidikan") || p.pillar.includes("Teknologi")
  );

  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)]">
      {/* 1. PAGE HEADER RESMI */}
      <PageHeader
        eyebrow="Portofolio Pengabdian Umat"
        title="8 Program Aksi Nyata Berbasis Empat Pilar"
        subtitle="Dari wakaf mushaf Al-Qur'an dan pemakmuran rumah Allah hingga beasiswa santri tahfidz dan kemandirian ekonomi dhuafa."
        breadcrumbs={[{ label: "Program" }]}
      />

      {/* 2. PILAR 1: SPIRITUAL (Al-Qur'an & Pemakmuran Masjid - Dominan) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex items-center justify-between border-b border-[var(--gold-500)]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center font-serif text-lg font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--green-950)]">
                Pilar Spiritual: Al-Qur&apos;an &amp; Rumah Allah
              </h2>
              <p className="text-xs sm:text-sm text-[var(--ink-600)]">
                Gerakan utama menebar kalam Ilahi dan merawat pusat peradaban umat di pelosok.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--green-900)] text-[var(--gold-300)]">
            4 Program Utama
          </span>
        </div>

        {/* Asymmetric Showcase Grid (2 Program Besar di Atas, 2 Pendukung) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {spiritualPrograms.map((prog) => (
            <div
              key={prog.slug}
              className="bg-[var(--cream-100)] rounded-3xl overflow-hidden border border-[var(--cream-200)] hover:border-[var(--gold-500)]/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-64 w-full overflow-hidden shape-mihrab bg-[var(--green-950)]">
                  <Image
                    src={prog.heroImage}
                    alt={prog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-950)]/90 via-transparent to-transparent" />
                  {prog.pricePerUnit && (
                    <div className="absolute top-4 right-4 bg-gold-gradient text-[var(--green-950)] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md font-mono">
                      {prog.pricePerUnit}
                    </div>
                  )}
                  <div className="absolute bottom-4 left-5 right-5 text-[var(--cream-50)]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--gold-400)] block mb-1">
                      {prog.pillar}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug">
                      {prog.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-sm text-[var(--ink-600)] leading-relaxed font-sans line-clamp-3">
                    {prog.shortDesc}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[var(--cream-200)]">
                    {prog.impactPoints.slice(0, 2).map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-[var(--ink-600)]">
                        <CheckCircle2 className="w-4 h-4 text-[var(--green-700)] flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/program/${prog.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm"
                >
                  <span>Detail &amp; Cara Berpartisipasi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PILAR 2: SOSIAL & KEMANUSIAAN */}
      <section className="py-20 bg-[var(--cream-100)] border-y border-[var(--cream-200)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex items-center gap-3 border-b border-[var(--gold-500)]/30 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--gold-700)] text-[var(--cream-50)] flex items-center justify-center font-serif text-lg font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
                Pilar Sosial: Santunan Yatim &amp; Bencana Nusantara
              </h2>
              <p className="text-xs sm:text-sm text-[var(--ink-600)]">
                Membantu kemandirian anak yatim dan tanggap darurat musibah pelosok.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {socialPrograms.map((prog) => (
              <div
                key={prog.slug}
                className="bg-[var(--cream-50)] rounded-3xl p-6 sm:p-8 border border-[var(--cream-200)] hover:border-[var(--gold-500)]/60 shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold-700)]">
                      {prog.pillar}
                    </span>
                    {prog.pricePerUnit && (
                      <span className="text-xs font-mono font-bold text-[var(--green-800)]">
                        {prog.pricePerUnit}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink-900)]">
                    {prog.title}
                  </h3>
                  <p className="text-sm text-[var(--ink-600)] leading-relaxed font-sans">
                    {prog.shortDesc}
                  </p>
                  <div className="space-y-1.5 pt-2 border-t border-[var(--cream-200)] text-xs text-[var(--ink-600)]">
                    {prog.impactPoints.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--green-700)] flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href={`/program/${prog.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[var(--green-800)] hover:text-[var(--gold-700)]"
                  >
                    <span>Pelajari Skema Penyaluran</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PILAR 3 & 4: PENDIDIKAN & TEKNOLOGI */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex items-center gap-3 border-b border-[var(--gold-500)]/30 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--green-800)] text-[var(--cream-50)] flex items-center justify-center font-serif text-lg font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--green-950)]">
              Pilar Pendidikan &amp; Teknologi Pemberdayaan
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-600)]">
              Beasiswa keahlian IT bagi santri dan pembinaan UMKM berbasis ekosistem aplikasi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {eduTechPrograms.map((prog) => (
            <div
              key={prog.slug}
              className="bg-[var(--cream-100)] rounded-3xl p-6 sm:p-8 border border-[var(--cream-200)] hover:border-[var(--green-800)]/60 shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--green-800)] block">
                  {prog.pillar}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink-900)]">
                  {prog.title}
                </h3>
                <p className="text-sm text-[var(--ink-600)] leading-relaxed font-sans">
                  {prog.shortDesc}
                </p>
                <div className="space-y-1.5 pt-2 border-t border-[var(--cream-200)] text-xs text-[var(--ink-600)]">
                  {prog.impactPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--green-700)] flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={`/program/${prog.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[var(--green-800)] hover:text-[var(--gold-700)]"
                >
                  <span>Pelajari Kurikulum &amp; Sasaran</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
