import { db } from "@/lib/db/api";
import DataSebaranView from "@/components/sections/DataSebaranView";
import PageHeader from "@/components/ui/PageHeader";
import StatCounter from "@/components/motion/StatCounter";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Data Sebaran Donasi: Infak Jinan, BUSS Al-Qur'an, & Geber Masjid",
  description:
    "Transparansi penyaluran mushaf Al-Qur'an Jinan bernomor urut unik, penerima beasiswa BUSS, serta aksi Geber Masjid pedalaman Yayasan Sahabat Aksara.",
  alternates: {
    canonical: "/data-sebaran",
  },
  openGraph: {
    title: "Data Sebaran Donasi & Peta Penyaluran Amanah | Sahabat Aksara",
    description:
      "Pantau sebaran wakaf Al-Qur'an dan pemakmuran masjid di seluruh pelosok nusantara secara real-time dan akuntabel.",
    url: "/data-sebaran",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Sebaran Donasi & Peta Penyaluran Amanah | Sahabat Aksara",
    description: "Pantau sebaran wakaf Al-Qur'an dan pemakmuran masjid di pelosok nusantara secara transparan.",
    images: ["/images/infak-mushaf-custom.jpg"],
  },
};

export default async function DataSebaranPage() {
  const [infakJinan, bussData, yatimData, geberData, stats] = await Promise.all([
    db.getPublicInfakJinan(),
    db.getPublicBussDistributions(),
    db.getYatimActivities(true),
    db.getGeberDistributions(true),
    db.getAggregatedStats(),
  ]);

  // Hitung total santri dari seluruh record donasi jinan
  const totalSantriJinan = infakJinan.reduce((acc, curr) => acc + (curr.santri_count || 0), 0);

  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)]">
      {/* 1. PAGE HEADER RESMI */}
      <PageHeader
        eyebrow="Pusat Transparansi Penyaluran Donasi"
        title="Data Sebaran & Peta Penyaluran Amanah"
        subtitle="Setiap mushaf bernomor urut, santri penerima beasiswa, serta kegiatan pembinaan yatim diverifikasi transparan dan dapat dipantau langsung di peta nusantara."
        breadcrumbs={[{ label: "Data Sebaran" }]}
      />

      {/* 2. TOP METRIC STRIP (Full-Width Command Bar) */}
      <section className="bg-[var(--green-950)] text-[var(--cream-50)] border-b border-[var(--gold-500)]/20 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-15 pointer-events-none" />
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[var(--gold-500)]/15">
          <div className="pt-2 lg:pt-0 lg:px-6 first:pt-0 first:px-0">
            <StatCounter
              end={infakJinan.length}
              label="Mushaf Al-Qur'an"
              sublabel="Tercatat Nomor Urut Unik"
            />
          </div>
          <div className="pt-2 lg:pt-0 lg:px-6">
            <StatCounter
              end={totalSantriJinan}
              label="Santri Penerima"
              sublabel="Progres Hafalan Bulanan"
            />
          </div>
          <div className="pt-2 lg:pt-0 lg:px-6">
            <StatCounter
              end={stats.totalProvinces}
              label="Wilayah Nusantara"
              sublabel="Pesantren & Madrasah"
            />
          </div>
          <div className="pt-2 lg:pt-0 lg:px-6">
            <StatCounter
              end={bussData.length + yatimData.length + infakJinan.length + geberData.length}
              label="Aksi Penyaluran"
              sublabel="100% Terverifikasi Terbuka"
            />
          </div>
        </div>
      </section>

      {/* 3. MAIN COMMAND CENTER (1400px Layout) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
        <DataSebaranView
          initialInfakJinan={infakJinan}
          initialBuss={bussData}
          initialYatim={yatimData}
          initialGeber={geberData}
          stats={stats}
        />
      </section>
    </div>
  );
}
