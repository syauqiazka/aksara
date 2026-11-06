"use client";

import Image from "next/image";
import {
  HeartHandshake,
  MapPin,
} from "lucide-react";
import Button from "@/components/ui/Button";
import IslamicCornerOrnament from "@/components/ui/IslamicCornerOrnament";

interface HeroShowcaseProps {
  totalMushaf?: number;
  totalMasjid?: number;
}

export default function HeroShowcase(_props?: HeroShowcaseProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center bg-[var(--green-950)] text-[var(--cream-50)] pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 1. Authentic Islamic Geometric Pattern Background Texture (Girih 8-Star Tessellation) */}
      <div
        className="absolute inset-0 bg-islamic-pattern opacity-25 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 75%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 75%, transparent 100%)",
        }}
      />

      {/* 2. Ambient Gold & Emerald Glows */}
      <div className="absolute -top-40 -right-40 w-[36rem] h-[36rem] bg-[var(--green-800)]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[36rem] h-[36rem] bg-[var(--gold-500)]/15 rounded-full blur-3xl pointer-events-none" />

      {/* 3. Grand Islamic Star Mandala Medallion (Right Side Framing Mushaf Jinan) */}
      <div className="absolute -right-24 sm:-right-16 lg:right-4 top-1/2 -translate-y-1/2 w-[440px] h-[440px] sm:w-[560px] sm:h-[560px] lg:w-[680px] lg:h-[680px] opacity-40 lg:opacity-50 pointer-events-none select-none will-change-transform animate-spin-slow">
        <Image
          src="/images/ornaments/islamic-star-mandala.webp"
          alt=""
          fill
          className="object-contain drop-shadow-[0_0_50px_rgba(212,175,55,0.35)]"
          priority
        />
      </div>

      {/* 4. Subtle Ambient Watermark Mandala (Top Left Flank behind Headline) */}
      <div className="absolute -top-40 -left-40 w-[380px] h-[380px] lg:w-[500px] lg:h-[500px] opacity-10 lg:opacity-12 pointer-events-none select-none will-change-transform animate-spin-reverse-slow">
        <Image
          src="/images/ornaments/islamic-star-mandala.webp"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* 5. Corner Arabesque Accents */}
      <div className="absolute top-24 left-4 opacity-30 pointer-events-none select-none hidden sm:block">
        <IslamicCornerOrnament size={95} />
      </div>
      <div className="absolute top-24 right-4 opacity-30 pointer-events-none select-none -scale-x-100 hidden sm:block">
        <IslamicCornerOrnament size={95} />
      </div>

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

