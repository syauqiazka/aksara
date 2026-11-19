import { Metadata } from "next";
import { portfolioContent } from "@/content/portfolio";
import PageHeader from "@/components/ui/PageHeader";
import PortfolioClient from "@/components/portfolio/PortfolioClient";

export const metadata: Metadata = {
  title: "Portofolio Produk Teknologi Dakwah | Yayasan Sahabat Aksara",
  description:
    "Ekosistem 6 aplikasi digital: KajianQu, Bank Saku Digital, DiaryQu, E-AbsensiQu, DKM MasjidQu, dan SapawargaQu yang dikembangkan oleh Yayasan Sahabat Aksara.",
  alternates: {
    canonical: "/portofolio",
  },
  openGraph: {
    title: "Ekosistem 6 Piranti Lunak Dakwah Sahabat Aksara",
    description:
      "Inovasi teknologi nirlaba untuk transparansi kas masjid, monitoring santri tahfidz, dan edukasi finansial syariah.",
    url: "/portofolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portofolio Produk Teknologi Dakwah | Yayasan Sahabat Aksara",
    description: "Ekosistem 6 aplikasi digital nirlaba dikembangkan oleh Yayasan Sahabat Aksara.",
    images: ["/images/logo-sahabat-aksara.jpg"],
  },
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
      <section className="bg-[var(--green-950)] text-[var(--cream-50)] border-b border-[var(--gold-500)]/20 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-[var(--gold-400)] font-semibold">
            <span>Karakter Produk Teknologi:</span>
            <span className="text-[var(--cream-50)]">Terbuka untuk Kemaslahatan Ummat</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[var(--cream-200)]/80">
            <span>6 Modul Terintegrasi</span>
            <span className="text-[var(--gold-500)]/40">|</span>
            <span>Dukungan Mobile Android &amp; Web</span>
          </div>
        </div>
      </section>

      {/* 3. APPS SHOWCASE GRID WITH GUIDEBOOK & POSTER ACTIONS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <PortfolioClient apps={portfolioContent} />
      </section>
    </div>
  );
}
