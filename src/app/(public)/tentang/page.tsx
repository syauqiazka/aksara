import { Metadata } from "next";
import Image from "next/image";
import { organizationContent } from "@/content/organization";
import InteractiveLogoHotspots from "@/components/sections/InteractiveLogoHotspots";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { Quote, HeartHandshake } from "lucide-react";
import IslamicCornerOrnament from "@/components/ui/IslamicCornerOrnament";

export const metadata: Metadata = {
  title: "Tentang Kami & Makna Filosofis Logo",
  description:
    "Profil Yayasan Sahabat Aksara, kisah inspiratif founder Ahmad Dahlan, visi-misi, pilar peradaban, serta bedah filosofi nama dan logo yayasan.",
  alternates: {
    canonical: "/tentang",
  },
  openGraph: {
    title: "Tentang Kami & Makna Filosofis Logo | Yayasan Sahabat Aksara",
    description:
      "Profil Yayasan Sahabat Aksara, visi-misi 4 pilar dakwah, serta bedah filosofi nama dan logo yayasan.",
    url: "/tentang",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang Kami & Makna Filosofis Logo | Yayasan Sahabat Aksara",
    description: "Profil Yayasan Sahabat Aksara, visi-misi 4 pilar dakwah, serta bedah filosofi nama dan logo yayasan.",
    images: ["/images/founder-ahmad-dahlan.jpg"],
  },
};

export default function TentangPage() {
  const { founder, acronymMeaning, vision, missions, legalName, skKemenkumham, npwp } = organizationContent;

  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)]">
      {/* 1. PAGE HEADER DENGAN BREADCRUMB RESMI & PROFIL LEGALITAS LEMBAGA */}
      <PageHeader
        eyebrow="Profil &amp; Rekam Jejak Lembaga"
        title="Berkhidmat Menghidupkan Nur Al-Qur'an di Seluruh Penjuru Semesta"
        subtitle={`Yayasan Sahabat Aksara (Yayasan Ajirasa Aksara Semesta) mendedikasikan ikhtiar dakwah, pendidikan, sosial, dan teknologi untuk kemandirian umat. Resmi berdiri pada ${organizationContent.establishedDate} berkedudukan di ${organizationContent.address}, dengan badan hukum ${legalName} yang disahkan melalui ${organizationContent.aktaPendirian}, SK Kemenkumham Nomor ${skKemenkumham}, NPWP Resmi ${npwp}, serta email resmi ${organizationContent.email}.`}
        breadcrumbs={[{ label: "Tentang Kami" }]}
      />

      {/* 2. KISAH & LATAR BELAKANG LEMBAGA (Scrollytelling Editorial) */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Sticky Left: Founder Portrait & Quote */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="relative aspect-[3/4] shape-mihrab overflow-hidden border-4 border-[var(--gold-500)] shadow-2xl bg-[var(--green-950)]">
              <Image
                src={founder.image}
                alt={founder.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
                priority
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
            <div className="p-6 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-200)] shadow-sm">
              <Quote className="w-6 h-6 text-[var(--gold-700)] mb-2" />
              <p className="text-sm italic font-serif text-[var(--ink-600)] leading-relaxed">
                &ldquo;{founder.quote}&rdquo;
              </p>
            </div>
          </div>

          {/* Right: Founder Story & Milestones Timeline */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold-700)] font-semibold">
                Kisah &amp; Latar Belakang Lembaga
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] mt-2 leading-tight">
                Menempa Asa Dari Bilik Pesantren Hingga Lahirnya Gerakan Satu Juta Mushaf
              </h2>
              <div className="w-20 h-1 bg-[var(--gold-600)] rounded-full mt-4" />
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[var(--ink-600)] leading-relaxed font-sans">
              {founder.story.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Milestones timeline */}
            <div className="pt-8 border-t border-[var(--cream-200)] space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[var(--ink-900)]">
                Tonggak Linimasa Perjuangan
              </h3>
              <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--gold-500)]/40">
                {founder.timeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Node Dot */}
                    <div className="absolute -left-[19px] top-1.5 w-3.5 h-3.5 rounded-full bg-[var(--gold-500)] border-2 border-[var(--cream-50)] shadow-sm group-hover:scale-125 transition-transform" />

                    <div className="bg-[var(--cream-100)] p-5 rounded-2xl border border-[var(--cream-200)] hover:border-[var(--gold-500)]/60 shadow-sm transition-all">
                      <div className="text-xs font-bold font-mono text-[var(--gold-700)] uppercase tracking-wider mb-1">
                        Tahun {step.year}
                      </div>
                      <h4 className="font-serif font-bold text-lg text-[var(--ink-900)] leading-snug">
                        {step.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-2 leading-relaxed">
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

      {/* 4. VISI & MISI (Sacral Dark Emerald Section) */}
      <section className="py-24 sm:py-32 bg-[var(--green-950)] text-[var(--cream-50)] px-4 sm:px-6 lg:px-8 relative overflow-hidden border-y border-[var(--gold-500)]/20">
        <div className="absolute inset-0 bg-islamic-pattern opacity-25 pointer-events-none" />
        {/* Islamic Star Mandala Watermark Silhouette */}
        <div className="absolute -right-24 top-10 w-[500px] h-[500px] opacity-15 pointer-events-none select-none will-change-transform animate-spin-slow">
          <Image
            src="/images/ornaments/islamic-star-mandala.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-6 left-6 opacity-25 pointer-events-none select-none hidden sm:block">
          <IslamicCornerOrnament size={80} />
        </div>
        <div className="absolute top-6 right-6 opacity-25 pointer-events-none select-none -scale-x-100 hidden sm:block">
          <IslamicCornerOrnament size={80} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto space-y-16">
          {/* Vision Statement */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold-400)] font-sans font-semibold">
              Visi Luhur Yayasan
            </div>
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold leading-relaxed [text-wrap:balance] text-gold-gradient">
              &ldquo;{vision}&rdquo;
            </h2>
          </div>

          {/* Missions Heading & Grid */}
          <div className="space-y-8 pt-10 border-t border-[var(--gold-500)]/20">
            <div className="text-center space-y-2">
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold-400)] font-sans font-semibold">
                Misi Aksi Lembaga
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--cream-50)]">
                4 Pilar Misi Pengabdian &amp; Peradaban
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {missions.map((m, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-3xl bg-[var(--green-900)]/60 border border-[var(--gold-500)]/30 space-y-3 hover:border-[var(--gold-400)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl font-bold text-gold-gradient">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold-300)]">
                      {m.title}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--cream-100)] leading-relaxed font-sans pt-1">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. MAKNA FILOSOFIS NAMA: A-K-S-A-R-A */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-700)]">
            Nilai Peradaban
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] mt-2">
            Makna Filosofis Nama A-K-S-A-R-A
          </h2>
          <div className="w-16 h-1 bg-[var(--gold-600)] rounded-full mx-auto mt-4" />
          <p className="text-sm sm:text-base text-[var(--ink-600)] mt-4 leading-relaxed">
            Setiap huruf dalam kata &quot;AKSARA&quot; merangkum janji suci dan prinsip moral yang kami pegang teguh dalam melayani umat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {acronymMeaning.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] hover:border-[var(--gold-500)] transition-all shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[var(--green-800)] text-gold-gradient flex items-center justify-center font-serif text-3xl font-extrabold mb-6 shadow-md group-hover:scale-105 transition-transform">
                  {item.letter}
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--ink-900)] mb-2 group-hover:text-[var(--green-800)] transition-colors">
                  {item.word}
                </h3>
                <p className="text-sm text-[var(--ink-600)] leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. MAKNA FILOSOFIS LOGO (Hotspot Explorer) */}
      <section className="py-24 bg-[var(--sage-100)] px-4 sm:px-6 lg:px-8 border-t border-[var(--sage-300)]/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
              Anatomi Visual
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] mt-2">
              Makna Filosofis Logo Sahabat Aksara
            </h2>
            <div className="w-16 h-1 bg-[var(--green-700)] rounded-full mx-auto mt-4" />
            <p className="text-sm text-[var(--ink-600)] mt-4 leading-relaxed">
              Cincin ganda, sepasang tangan, bola dunia, tunas bertumbuh, dan lembaran Al-Qur&apos;an terbuka: sebuah ikrar pengabdian tanpa henti. Klik titik hotspot pada logo untuk membaca penjelasannya.
            </p>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl bg-[var(--green-950)] border-2 border-[var(--gold-500)]/40 shadow-2xl">
            <InteractiveLogoHotspots />
          </div>
        </div>
      </section>

      {/* 7. GRAND CALL TO ACTION */}
      <section className="py-24 bg-[var(--green-950)] text-[var(--cream-50)] text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-25 pointer-events-none" />
        {/* Islamic Star Mandala Watermark Silhouette */}
        <div className="absolute -left-24 -bottom-24 w-[480px] h-[480px] opacity-15 pointer-events-none select-none will-change-transform animate-spin-slow">
          <Image
            src="/images/ornaments/islamic-star-mandala.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-6 left-6 opacity-25 pointer-events-none select-none hidden sm:block">
          <IslamicCornerOrnament size={80} />
        </div>
        <div className="absolute top-6 right-6 opacity-25 pointer-events-none select-none -scale-x-100 hidden sm:block">
          <IslamicCornerOrnament size={80} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
            Ingin Mengambil Bagian dalam Perjalanan Ini?
          </h2>
          <p className="text-sm sm:text-base text-[var(--cream-200)] leading-relaxed">
            Jadilah bagian dari keluarga besar Sahabat Aksara sebagai donatur, relawan Geber Masjid, atau mitra sinergi dakwah peradaban.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/donasi" variant="gold" size="lg" className="w-full sm:w-auto shadow-xl">
              <HeartHandshake className="w-5 h-5 text-[var(--green-950)]" />
              <span>Salurkan Donasi</span>
            </Button>
            <Button href="/program" variant="secondary" size="lg" className="w-full sm:w-auto text-white border-[var(--gold-500)]/40 hover:bg-[var(--gold-500)]/15">
              <span>Pelajari 8 Program Lembaga</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
