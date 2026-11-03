import { portfolioContent } from "@/content/portfolio";
import {
  Smartphone,
  Sparkles,
  Radio,
  Wallet,
  BookCheck,
  ScanFace,
  Building2,
  UsersRound,
  CheckCircle2,
  Layers,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Portofolio Produk Teknologi",
  description:
    "Ekosistem piranti lunak dakwah, tata kelola masjid, pendidikan santri, dan literasi finansial syariah yang dikembangkan oleh Yayasan Sahabat Aksara.",
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
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)] pt-20">
      {/* Hero Header */}
      <section className="relative py-20 bg-[var(--green-950)] text-[var(--cream-50)] px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-islamic-stars opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--green-900)] border border-[var(--gold-500)]/40 text-[var(--gold-300)] text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-[var(--gold-400)]" />
            <span>Pilar Teknologi & Kemandirian Digital Umat</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold [text-wrap:balance]">
            Produk Teknologi Mandiri untuk Peradaban Berdaya
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[var(--cream-100)]/90 max-w-2xl mx-auto leading-relaxed">
            Menjawab tantangan era digital dengan piranti lunak dakwah, transparansi kas masjid, monitoring santri, dan keharmonisan sosial warga.
          </p>
        </div>
      </section>

      {/* Apps Showcase */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {portfolioContent.map((app) => {
            const IconComponent = iconMap[app.mockupIcon] || Layers;
            return (
              <div
                key={app.id}
                className="bg-[var(--cream-100)] rounded-3xl p-8 border border-[var(--cream-200)] hover:border-[var(--gold-500)] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top status bar & badge */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--green-700)]">
                      {app.category}
                    </span>
                    <span className="text-xs px-3.5 py-1 rounded-full font-bold bg-[var(--gold-500)]/20 text-[var(--gold-700)] border border-[var(--gold-500)]/40 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[var(--gold-700)]" />
                      <span>Coming Soon</span>
                    </span>
                  </div>

                  {/* App Title & Identity */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--green-950)] text-gold-gradient flex items-center justify-center flex-shrink-0 shadow-lg border border-[var(--gold-500)]/40 group-hover:scale-110 transition-transform">
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

                  <p className="text-sm text-[var(--ink-600)] leading-relaxed mb-6">
                    {app.description}
                  </p>

                  {/* Device UI Abstract Wireframe Illustration */}
                  <div className="p-4 rounded-2xl bg-[var(--green-950)] text-[var(--cream-100)] border border-[var(--gold-500)]/30 mb-6">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--gold-500)]/20 text-xs text-[var(--sage-300)]">
                      <div className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                        <span>Pratinjau Fitur Utama &bull; {app.name}</span>
                      </div>
                      <span className="text-[10px] text-[var(--gold-400)] font-semibold uppercase tracking-wider">
                        Tahap Finalisasi
                      </span>
                    </div>

                    <div className="space-y-2">
                      {app.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-[var(--cream-100)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold-400)] flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Download / Play Store Action */}
                <div className="pt-4 border-t border-[var(--cream-200)] flex items-center justify-between gap-4">
                  <div className="text-xs text-[var(--ink-400)] font-medium">
                    Akan dirilis di Android Play Store & Web
                  </div>
                  <button
                    disabled
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[var(--cream-200)] text-[var(--ink-600)] cursor-not-allowed opacity-80"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Segera Hadir</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
