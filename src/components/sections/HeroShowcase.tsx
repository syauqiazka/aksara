"use client";

import Image from "next/image";
import Link from "next/link";
import {
  HeartHandshake,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Award,
  Users,
  Building,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface HeroShowcaseProps {
  totalMushaf: number;
  totalMasjid: number;
}

export default function HeroShowcase({ totalMushaf, totalMasjid }: HeroShowcaseProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center bg-[var(--green-950)] text-[var(--cream-50)] pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Islamic star geometry & gradient highlight */}
      <div className="absolute inset-0 bg-islamic-stars opacity-30 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--green-800)]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--gold-500)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline & Value Proposition */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Institution Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--green-900)] border border-[var(--gold-500)]/40 text-[var(--gold-300)] text-xs font-semibold shadow-md">
            <span className="w-2 h-2 rounded-full bg-[var(--gold-400)] animate-pulse" />
            <span>Yayasan Sahabat Aksara &bull; Badan Nirlaba Terdaftar</span>
          </div>

          {/* Main Title with Fraunces Display Font */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--cream-50)] leading-[1.15] [text-wrap:balance]">
            Menebar Cahaya Al-Qur&apos;an,{" "}
            <span className="text-gold-gradient">Memakmurkan Rumah Allah</span> di Pelosok Negeri
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[var(--cream-100)]/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
            Menghubungkan niat jariyah para muhsinin dengan santri tahfidz dan masjid pedalaman melalui program <strong>Infak 1 Juta Mushaf Custom Nama</strong>, <strong>Geber Bersih Masjid</strong>, serta beasiswa huffazh bersanad.
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
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-[var(--cream-50)] border-[var(--gold-500)]/50 hover:bg-[var(--gold-500)]/15"
            >
              <MapPin className="w-5 h-5 text-[var(--gold-400)]" />
              <span>Lihat Peta Sebaran</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Layered Card Composition (Like SMK TI Bazma / Bazma) */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-md">
            {/* Main Featured Photo Card */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-[var(--gold-500)]/40 shadow-2xl bg-[var(--green-900)] group">
              <Image
                src="/images/infak-mushaf-custom.jpg"
                alt="Mockup Mushaf Infak Custom Nama Donatur"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 450px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-950)]/90 via-transparent to-transparent" />

              {/* Tag pill at bottom of photo */}
              <div className="absolute bottom-5 left-5 right-5 text-[var(--cream-50)]">
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--gold-500)] text-[var(--green-950)] mb-1">
                  Program Utama
                </div>
                <div className="font-serif font-bold text-lg text-[var(--cream-50)] leading-snug">
                  Infak 1 Jt Al-Qur&apos;an Custom Nama
                </div>
                <p className="text-xs text-[var(--cream-200)] mt-0.5">
                  Menerangi jalan para santri tahfidz di berbagai pelosok kepulauan Indonesia.
                </p>
              </div>
            </div>

            {/* Floating Live Badge 1: Mushaf Tersalurkan */}
            <div className="absolute -top-4 -left-4 sm:-left-6 bg-[var(--green-900)] border-2 border-[var(--gold-500)] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-[float_4s_ease-in-out_infinite]">
              <div className="w-10 h-10 rounded-xl bg-[var(--green-800)] text-[var(--gold-400)] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-lg font-extrabold text-gold-gradient">
                  {totalMushaf > 0 ? `${totalMushaf.toLocaleString("id-ID")}+` : "0"}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--cream-200)] font-semibold">
                  Mushaf Tersalurkan
                </div>
              </div>
            </div>

            {/* Floating Live Badge 2: Geber Masjid */}
            <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-[var(--green-900)] border-2 border-[var(--gold-500)] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-[float_5s_ease-in-out_infinite_reverse]">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold-500)] text-[var(--green-950)] flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-lg font-extrabold text-[var(--cream-50)]">
                  {totalMasjid} Masjid
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--gold-300)] font-semibold">
                  Aksi Geber Kebersihan
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.animate-\[float_4s_ease-in-out_infinite\]),
          :global(.animate-\[float_5s_ease-in-out_infinite_reverse\]) {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

