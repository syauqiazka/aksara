import { db } from "@/lib/db/api";
import DataSebaranView from "@/components/sections/DataSebaranView";

export const metadata = {
  title: "Data Sebaran Donasi: Infak Jinan, BUSS Al-Qur'an, & Yatim Berdikari",
  description:
    "Data sebaran transparan program Infak Al-Qur'an Jinan, Beasiswa BUSS Al-Qur'an, dan kegiatan Yatim Berdikari Yayasan Sahabat Aksara.",
};

export default async function DataSebaranPage() {
  const infakJinan = await db.getPublicInfakJinan();
  const bussData = await db.getPublicBussDistributions();
  const yatimData = await db.getYatimActivities(true);
  const geberData = await db.getGeberDistributions(true);
  const stats = await db.getAggregatedStats();

  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)] pt-20">
      {/* Hero Header */}
      <section className="relative py-20 bg-[var(--green-950)] text-[var(--cream-50)] px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-islamic-stars opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold-400)] font-semibold mb-4">
            Pusat Transparansi Penyaluran Donasi
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold [text-wrap:balance]">
            Data Sebaran & Peta Penyaluran Amanah
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[var(--cream-100)]/90 max-w-2xl mx-auto leading-relaxed">
            Setiap mushaf bernomor urut, penerima beasiswa santri, serta kegiatan pembinaan yatim diverifikasi transparan dan diperbarui secara berkala.
          </p>
        </div>
      </section>

      {/* Main Interactive Table & Map Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
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
