"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, HeartHandshake, CheckCircle2, ShieldCheck } from "lucide-react";

export default function InfaqCalculator() {
  const [mushafCount, setMushafCount] = useState<number>(3);
  const [customName, setCustomName] = useState<string>("Keluarga Hamba Allah");
  const pricePerUnit = 200000;

  const totalAmount = mushafCount * pricePerUnit;

  const getImpactDescription = (count: number) => {
    if (count <= 1) {
      return "Membekali 1 santri tahfidz dhuafa dengan mushaf cetak custom nama yang dibaca setiap hari.";
    }
    if (count <= 3) {
      return "Menghidupkan 1 kelompok halaqah tilawah santri penghafal Al-Qur'an di pelosok desa.";
    }
    if (count <= 5) {
      return "Memenuhi kebutuhan Al-Qur'an layak untuk satu asrama santri tahfidz di pedalaman nusantara.";
    }
    if (count <= 15) {
      return "Menjangkau satu kelas madrasah diniyah lengkap dengan berita acara dokumentasi penyaluran.";
    }
    return "Menyokong kebutuhan literasi Al-Qur'an satu pondok pesantren rakyat yang membutuhkan.";
  };

  const presets = [1, 3, 5, 10, 25];

  return (
    <div className="bg-[var(--green-950)] text-[var(--cream-50)] rounded-3xl p-6 sm:p-10 border-2 border-[var(--gold-500)]/40 shadow-2xl relative overflow-hidden">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Side: Interactive Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--green-900)] border border-[var(--gold-500)]/40 text-[var(--gold-300)] text-xs font-semibold">
            <span>Kalkulator Dampak Wakaf Mushaf</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--cream-50)]">
            Hitung Berapa Santri yang Ingin Anda Bahagiakan
          </h3>

          <p className="text-xs sm:text-sm text-[var(--cream-200)]/90 leading-relaxed">
            Setiap Rp 200.000 sudah mencakup biaya cetak mushaf QPP rasm Utsmani standar Kemenag RI, custom nama pewakaf di cover, kemasan rapi, dan ongkos distribusi ke pesantren pelosok.
          </p>

          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-[var(--gold-400)] uppercase tracking-wider mb-2">
              Pilih Paket Wakaf Mushaf:
            </label>
            <div className="flex flex-wrap gap-2.5">
              {presets.map((num) => (
                <button
                  key={num}
                  onClick={() => setMushafCount(num)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    mushafCount === num
                      ? "bg-gold-gradient text-[var(--green-950)] shadow-lg scale-105"
                      : "bg-[var(--green-900)] text-[var(--cream-100)] border border-[var(--gold-500)]/30 hover:border-[var(--gold-400)]"
                  }`}
                >
                  {num} Mushaf ({`Rp ${(num * pricePerUnit).toLocaleString("id-ID")}`})
                </button>
              ))}
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-[var(--cream-200)]">
              <span>Geser Jumlah Mushaf:</span>
              <span className="font-mono font-bold text-[var(--gold-300)] text-sm">
                {mushafCount} Mushaf
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={mushafCount}
              onChange={(e) => setMushafCount(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-[var(--green-900)] rounded-lg appearance-none cursor-pointer accent-[var(--gold-400)]"
            />
          </div>

          {/* Custom Name Simulation */}
          <div>
            <label className="block text-xs font-semibold text-[var(--gold-400)] uppercase tracking-wider mb-1.5">
              Simulasi Nama Custom di Cover:
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Contoh: Bpk. H. Ahmad & Keluarga"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--green-900)] border border-[var(--gold-500)]/30 text-xs sm:text-sm text-[var(--cream-50)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-400)]"
            />
          </div>
        </div>

        {/* Right Side: Animated Result & Action Card */}
        <div className="lg:col-span-5 bg-[var(--green-900)]/90 border-2 border-[var(--gold-500)]/50 rounded-3xl p-6 sm:p-8 text-center flex flex-col justify-between shadow-xl">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[var(--green-950)] text-[var(--gold-400)] border border-[var(--gold-500)]/40 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6" />
            </div>

            <div className="text-xs uppercase tracking-widest text-[var(--gold-400)] font-semibold">
              Total Nilai Infak Wakaf
            </div>

            <div className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-gradient my-2 tabular-nums">
              Rp {totalAmount.toLocaleString("id-ID")}
            </div>

            <div className="text-xs text-[var(--cream-100)] bg-[var(--green-950)]/80 p-3.5 rounded-xl border border-[var(--gold-500)]/20 mt-3 text-left">
              <div className="font-semibold text-[var(--gold-300)] mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                <span>Dampak Penyaluran Nyata:</span>
              </div>
              <p className="text-[11px] text-[var(--cream-200)]/90 leading-relaxed">
                {getImpactDescription(mushafCount)}
              </p>
            </div>

            {/* Simulated Cover Preview */}
            <div className="mt-4 p-3 rounded-xl bg-[var(--green-950)] border border-[var(--gold-500)]/30 text-[11px] text-[var(--sage-300)]">
              <span>Preview Cover: </span>
              <strong className="text-[var(--gold-300)] font-serif italic">
                &ldquo;Donasi Infak dari: {customName || "Hamba Allah"}&rdquo;
              </strong>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--gold-500)]/20 space-y-3">
            <Link
              href="/donasi"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-lg transition-transform active:scale-95"
            >
              <HeartHandshake className="w-4 h-4 text-[var(--green-950)]" />
              <span>Salurkan Donasi Rp {totalAmount.toLocaleString("id-ID")}</span>
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--sage-300)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              <span>Penyaluran 100% Tercatat Transparan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

