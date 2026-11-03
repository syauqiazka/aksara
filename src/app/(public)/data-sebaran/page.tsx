import { db } from "@/lib/db/api";
import DataSebaranView from "@/components/sections/DataSebaranView";

export const metadata = {
  title: "Data Sebaran Donasi: Al-Qur'an & Geber Masjid",
  description:
    "Peta dan tabel sebaran transparan infak Al-Qur'an custom nama dan aksi Geber Masjid di seluruh Indonesia.",
};

export default async function DataSebaranPage() {
  const infakData = await db.getInfakDistributions(true);
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
            Setiap mushaf bernomor urut dan aksi bersih-bersih masjid diverifikasi secara berkala untuk menjamin amanah para donatur tersampaikan tepat sasaran.
          </p>
        </div>
      </section>

      {/* Main Interactive Table & Map Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <DataSebaranView
          initialInfak={infakData}
          initialGeber={geberData}
          stats={stats}
        />
      </section>
    </div>
  );
}

