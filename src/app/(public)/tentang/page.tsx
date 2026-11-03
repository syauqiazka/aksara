import Image from "next/image";
import Link from "next/link";
import { organizationContent } from "@/content/organization";
import InteractiveLogoHotspots from "@/components/sections/InteractiveLogoHotspots";
import Button from "@/components/ui/Button";
import { Sparkles, Quote, Award, Heart, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Tentang Kami & Makna Filosofis Logo",
  description:
    "Profil Yayasan Sahabat Aksara, kisah inspiratif founder Ahmad Dahlan, visi-misi, pilar peradaban, serta bedah filosofi nama dan logo yayasan.",
};

export default function TentangPage() {
  const { founder, pillars, acronymMeaning, vision, missions } = organizationContent;

  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)] pt-20">
      {/* 1. HERO TENTANG KAMI (Emerald Sacral Intro) */}
      <section className="relative py-20 bg-[var(--green-950)] text-[var(--cream-50)] px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-islamic-stars opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--green-900)] border border-[var(--gold-500)]/40 text-[var(--gold-300)] text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-[var(--gold-400)]" />
            <span>Profil & Rekam Jejak Lembaga</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold [text-wrap:balance]">
            Berkhidmat Menghidupkan Nur Al-Qur&apos;an di Seluruh Penjuru Semesta
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[var(--cream-100)]/90 max-w-2xl mx-auto leading-relaxed">
            Yayasan Sahabat Aksara lahir dari tekad untuk memastikan tidak ada santri pelosok yang tertinggal dalam mempelajari kalam ilahi dan tidak ada masjid yang terbengkalai.
          </p>
        </div>
      </section>

      {/* 2. KISAH & LATAR BELAKANG FOUNDER (Scrollytelling Layout) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Sticky Left: Founder Portrait */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative aspect-[3/4] shape-mihrab overflow-hidden border-4 border-[var(--gold-500)] shadow-2xl bg-[var(--green-950)]">
              <Image
                src={founder.image}
                alt={founder.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-950)]/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-[var(--cream-50)]">
                <div className="font-serif text-2xl font-bold text-gold-gradient">
                  {founder.name}
                </div>
                <div className="text-xs text-[var(--cream-200)] mt-0.5">
                  {founder.role}
                </div>
              </div>
            </div>

            {/* Founder Quote Card */}
            <div className="mt-6 p-6 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-200)]">
              <Quote className="w-6 h-6 text-[var(--gold-700)] mb-2" />
              <p className="text-sm italic font-serif text-[var(--ink-600)] leading-relaxed">
                &ldquo;{founder.quote}&rdquo;
              </p>
            </div>
          </div>

          {/* Right: Founder Story & Milestones Timeline */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-700)]">
                Kisah & Latar Belakang Perjuangan
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] mt-1">
                Menempa Asa Dari Bilik Pesantren Hingga Lahirnya Sahabat Aksara
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[var(--ink-600)] leading-relaxed">
              {founder.story.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Milestones timeline */}
            <div className="pt-8 border-t border-[var(--cream-200)]">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink-900)] mb-6">
                Tonggak Perjalanan Hidup
              </h3>
              <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--gold-500)]/30">
                {founder.timeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Node Dot */}
                    <div className="absolute -left-[19px] top-1.5 w-3.5 h-3.5 rounded-full bg-[var(--gold-500)] border-2 border-[var(--cream-50)] shadow-sm group-hover:scale-125 transition-transform" />
                    
                    <div className="bg-[var(--cream-100)] p-4 sm:p-5 rounded-2xl border border-[var(--cream-200)] hover:border-[var(--gold-500)]/60 shadow-sm transition-all">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--green-900)] text-[var(--gold-300)] font-bold text-xs mb-2">
                        <span>{step.year}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-[var(--ink-900)] leading-snug">
                        {step.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISI & MISI (Contrasting Sacred Dark Section) */}
      <section className="py-24 bg-[var(--green-950)] text-[var(--cream-50)] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto space-y-16">
          {/* Vision Statement */}
          <div className="text-center space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--gold-400)] font-sans">
              Visi Luhur Lembaga
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-snug [text-wrap:balance] text-gold-gradient">
              &ldquo;{vision}&rdquo;
            </h2>
          </div>

          {/* Missions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-[var(--gold-500)]/30">
            {missions.map((m, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[var(--green-900)]/60 border border-[var(--gold-500)]/30 space-y-3"
              >
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[var(--gold-500)] text-[var(--green-950)]">
                  {m.title}
                </div>
                <p className="text-sm text-[var(--cream-100)] leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MAKNA FILOSOFIS NAMA: A-K-S-A-R-A */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-700)]">
            Nilai Peradaban
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] mt-2">
            Makna Filosofis Nama A-K-S-A-R-A
          </h2>
          <p className="text-sm text-[var(--ink-600)] mt-3">
            Setiap huruf dalam kata &quot;AKSARA&quot; merangkum janji suci dan prinsip moral yang kami pegang dalam melayani umat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {acronymMeaning.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] hover:border-[var(--gold-500)] transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[var(--green-800)] text-gold-gradient flex items-center justify-center font-serif text-3xl font-extrabold mb-6 shadow-md">
                  {item.letter}
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--ink-900)] mb-2">
                  {item.word}
                </h3>
                <p className="text-sm text-[var(--ink-600)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MAKNA FILOSOFIS LOGO (Hotspot Explorer) */}
      <section className="py-20 bg-[var(--sage-100)] px-4 sm:px-6 lg:px-8 border-t border-[var(--sage-300)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
              Anatomi Visual
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] mt-2">
              Makna Filosofis Logo Sahabat Aksara
            </h2>
            <p className="text-sm text-[var(--ink-600)] mt-3">
              Cincin ganda, sepasang tangan, bola dunia, tunas bertumbuh, dan lembaran terbuka — sebuah ikrar pengabdian tanpa henti.
            </p>
          </div>

          <InteractiveLogoHotspots />
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-20 bg-[var(--green-950)] text-[var(--cream-50)] text-center px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Ingin Mengambil Bagian dalam Perjalanan Ini?
          </h2>
          <p className="text-sm text-[var(--cream-200)] leading-relaxed">
            Jadilah bagian dari keluarga besar Sahabat Aksara sebagai donatur, relawan Geber Masjid, atau mitra sinergi dakwah.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/donasi" variant="gold" size="lg">
              Salurkan Donasi
            </Button>
            <Button href="/program" variant="secondary" size="lg" className="text-[var(--cream-50)]">
              Pelajari Program
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

