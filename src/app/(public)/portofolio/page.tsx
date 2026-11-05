import { portfolioContent } from "@/content/portfolio";
import PageHeader from "@/components/ui/PageHeader";
import {
  Smartphone,
  Radio,
  Wallet,
  BookCheck,
  ScanFace,
  Building2,
  UsersRound,
  CheckCircle2,
  Layers,
  Clock,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Portofolio Produk Teknologi Dakwah | Yayasan Sahabat Aksara",
  description:
    "Ekosistem 6 aplikasi digital: KajianQu, Bank Saku Digital, DiaryQu, E-AbsensiQu, DKM MasjidQu, dan SapawargaQu yang dikembangkan oleh Yayasan Sahabat Aksara.",
};

const iconMap: Record<string, React.ElementType> = {
  Radio,
  Wallet,
  BookCheck,
  ScanFace,
  Building2,
  UsersRound,
};

export default function PortofolioPage() {
  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)]">
      {/* 1. PAGE HEADER RESMI */}
      <PageHeader
        eyebrow="Pilar Teknologi &amp; Kemandirian Digital"
        title="Ekosistem 6 Piranti Lunak Dakwah Sahabat Aksara"
        subtitle="Inovasi teknologi nirlaba untuk transparansi kas masjid, monitoring santri tahfidz, edukasi finansial syariah, dan keharmonisan sosial masyarakat."
        breadcrumbs={[{ label: "Portofolio" }]}
      />

      {/* 2. PILLAR INTRO BANNER */}
      <section className="bg-[var(--green-950)] text-[var(--cream-50)] border-b border-[var(--gold-500)]/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-[var(--gold-400)] font-semibold">
            <Sparkles className="w-4 h-4 text-[var(--gold-400)] flex-shrink-0" />
            <span>Karakter Produk Teknologi:</span>
            <span className="text-[var(--cream-50)]">Bebas Iklan &bull; Terbuka untuk Kemaslahatan Ummat</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[var(--cream-200)]/80">
            <span>6 Modul Terintegrasi</span>
            <span>&bull;</span>
            <span>Dukungan Mobile Android &amp; Web</span>
          </div>
        </div>
      </section>

      {/* 3. APPS SHOWCASE GRID */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {portfolioContent.map((app) => {
            const IconComponent = iconMap[app.mockupIcon] || Layers;
            return (
              <div
                key={app.id}
                className="bg-[var(--cream-100)] rounded-3xl p-8 border border-[var(--cream-200)] hover:border-[var(--gold-500)] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top status bar & category */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--green-700)]">
                      {app.category}
                    </span>
                    <span className="text-xs px-3.5 py-1 rounded-full font-bold bg-[var(--gold-500)]/20 text-[var(--gold-700)] border border-[var(--gold-500)]/40 flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[var(--gold-700)]" />
                      <span>Dalam Pengembangan</span>
                    </span>
                  </div>

                  {/* App Title & Identity */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--green-950)] text-gold-gradient flex items-center justify-center flex-shrink-0 shadow-lg border border-[var(--gold-500)]/40 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-8 h-8 text-[var(--gold-400)]" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
                        {app.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-[var(--gold-700)] font-medium mt-0.5">
                        {app.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--ink-600)] leading-relaxed mb-6 font-sans">
                    {app.description}
                  </p>

                  {/* Device UI Abstract Wireframe Illustration */}
                  <div className="p-5 rounded-2xl bg-[var(--green-950)] text-[var(--cream-100)] border border-[var(--gold-500)]/30 mb-6 space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--gold-500)]/20 text-xs text-[var(--sage-300)]">
                      <div className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                        <span className="font-mono">Pratinjau Antarmuka &bull; {app.name}</span>
                      </div>
                      <span className="text-[10px] text-[var(--gold-400)] font-semibold uppercase tracking-wider">
                        Versi Beta
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--green-900)]/80 border border-[var(--cream-100)]/10 text-xs text-[var(--cream-200)] flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--gold-400)] animate-pulse" />
                      <span>{app.tagline}</span>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-2 pt-2 border-t border-[var(--cream-200)]">
                    <div className="text-[11px] uppercase tracking-wider text-[var(--ink-400)] font-bold mb-2">
                      Fitur Unggulan:
                    </div>
                    {app.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[var(--ink-800)]">
                        <CheckCircle2 className="w-4 h-4 text-[var(--green-700)] flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <div className="w-full py-3 rounded-full text-center text-xs font-semibold bg-[var(--cream-200)] text-[var(--ink-600)] cursor-not-allowed">
                    Tautan Unduh Play Store Segera Dirilis
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
