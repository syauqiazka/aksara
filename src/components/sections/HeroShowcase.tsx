"use client";

import Image from "next/image";
import {
  HeartHandshake,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Award,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface HeroShowcaseProps {
  totalMushaf?: number;
  totalMasjid?: number;
}

export default function HeroShowcase(_props?: HeroShowcaseProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center bg-[var(--green-950)] text-[var(--cream-50)] pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--green-800)]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--gold-500)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline & Value Proposition */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Eyebrow Label (Text without pill container per R-24 / antislop) */}
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold-400)] font-semibold">
            Yayasan Sahabat Aksara / Badan Nirlaba Terdaftar
          </div>

          {/* Main Title with Fraunces Display Font */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--cream-50)] leading-[1.15] [text-wrap:balance]">
            Menebar Cahaya Al-Qur&apos;an,{" "}
            <span className="text-gold-gradient">Memakmurkan Rumah Allah</span> di Pelosok Negeri
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[var(--cream-100)]/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
            Menghubungkan niat jariyah para muhsinin dengan santri tahfidz dan masjid pedalaman melalui program <strong>Infak Al-Qur&apos;an Jinan</strong> (Rp 100.000 / mushaf custom nama), <strong>Program BUSS Al-Qur&apos;an</strong>, <strong>Geber Bersih Masjid</strong>, serta beasiswa tahfidz bersanad.
          </p>

          {/* Trust points list */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs text-[var(--cream-200)] pt-1">
            <div className="flex items-center gap-1.5 bg-[var(--green-900)]/60 px-3 py-1.5 rounded-lg border border-[var(--gold-500)]/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              <span>Cetak Nama Pewakaf di Cover</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[var(--green-900)]/60 px-3 py-1.5 rounded-lg border border-[var(--gold-500)]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              <span>Standar Kemenag RI (QPP)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[var(--green-900)]/60 px-3 py-1.5 rounded-lg border border-[var(--gold-500)]/20">
              <Award className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              <span>Berita Acara & GPS Terbuka</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button
              href="/donasi"
              variant="gold"
              size="lg"
              className="w-full sm:w-auto shadow-[0_4px_24px_rgba(212,175,55,0.4)]"
            >
              <HeartHandshake className="w-5 h-5 text-[var(--green-950)]" />
              <span>Salurkan Donasi Sekarang</span>
            </Button>

            <Button
              href="/data-sebaran"
              variant="secondary-dark"
              size="lg"
              className="w-full sm:w-auto"
            >
              <MapPin className="w-5 h-5 text-[var(--gold-400)]" />
              <span>Lihat Peta Sebaran</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Layered Card Composition */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-md">
            {/* Main Featured Photo Card in Arch / Mihrab Frame */}
            <div className="relative aspect-[4/5] shape-mihrab overflow-hidden border-2 border-[var(--gold-500)]/60 shadow-2xl bg-[var(--green-900)] group">
              <Image
                src="/images/infak-mushaf-custom.jpg"
                alt="Mockup Mushaf Infak Custom Nama Donatur"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 450px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-950)]/90 via-transparent to-transparent" />

              {/* Editorial Caption at bottom of photo */}
              <div className="absolute bottom-5 left-5 right-5 text-[var(--cream-50)]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold-400)] mb-1">
                  Mushaf Custom Nama: Program Jinan
                </div>
                <div className="font-serif font-bold text-lg text-[var(--cream-50)] leading-snug">
                  Rp 100.000 / Mushaf Santri
                </div>
                <p className="text-xs text-[var(--cream-200)]/90 mt-1">
                  Nama donatur tercetak abadi di cover mushaf para penghafal Al-Qur&apos;an.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

