"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, Mail, MapPin, ExternalLink } from "lucide-react";
import { organizationContent } from "@/content/organization";
import IslamicCornerOrnament from "@/components/ui/IslamicCornerOrnament";

export default function Footer() {
  const pathname = usePathname();

  // If on admin route, don't show public footer
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative bg-[var(--green-950)] text-[var(--cream-100)] pt-16 pb-12 overflow-hidden border-t-2 border-[var(--gold-500)]/40">
      {/* 1. Authentic Islamic Geometric Pattern Background Texture */}
      <div
        className="absolute inset-0 bg-islamic-pattern opacity-20 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 75%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 75%, transparent 100%)",
        }}
      />

      {/* 2. Islamic Star Mandala Watermark Silhouette */}
      <div className="absolute -right-28 -bottom-28 w-[480px] h-[480px] opacity-15 pointer-events-none select-none will-change-transform animate-spin-slow">
        <Image
          src="/images/ornaments/islamic-star-mandala.webp"
          alt=""
          fill
          className="object-contain drop-shadow-[0_0_35px_rgba(212,175,55,0.2)]"
        />
      </div>

      {/* 3. Corner Arabesque Accents */}
      <div className="absolute top-4 left-4 opacity-25 pointer-events-none select-none hidden sm:block">
        <IslamicCornerOrnament size={80} />
      </div>
      <div className="absolute top-4 right-4 opacity-25 pointer-events-none select-none -scale-x-100 hidden sm:block">
        <IslamicCornerOrnament size={80} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[var(--gold-500)]/20">
          {/* Col 1: Identity & Legal */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--gold-500)] bg-[var(--green-900)]">
                <Image
                  src="/images/logo-sahabat-aksara.jpg"
                  alt="Logo Sahabat Aksara"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[var(--cream-50)]">
                  Sahabat Aksara
                </h3>
                <p className="text-xs text-[var(--gold-400)]">
                  Lembaga Nirlaba Berdaya & Transparan
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--cream-200)]/80 leading-relaxed">
              Membangun peradaban mulia berbasis Al-Qur&apos;an dan teknologi melalui 4 pilar: Spiritual, Sosial, Pendidikan, dan Teknologi.
            </p>
            <div className="text-xs text-[var(--sage-300)] space-y-1 pt-2 border-t border-[var(--gold-500)]/15">
              <p>Badan Hukum: <span className="text-[var(--cream-100)]">{organizationContent.legalName}</span></p>
              <p>Berdiri: <span className="text-[var(--cream-100)]">{organizationContent.establishedDate}</span></p>
              <p>SK Kemenkumham: <span className="text-[var(--cream-100)] font-mono">{organizationContent.skKemenkumham}</span></p>
              <p>NPWP: <span className="text-[var(--cream-100)] font-mono">{organizationContent.npwp}</span></p>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-[var(--gold-400)] mb-4 font-sans">
              Jelajahi Program
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/program/infak-jinan" className="hover:text-[var(--gold-300)] transition-colors">
                  Infak Al-Qur&apos;an Jinan
                </Link>
              </li>
              <li>
                <Link href="/program/buss-quran" className="hover:text-[var(--gold-300)] transition-colors">
                  Program BUSS Al-Qur&apos;an
                </Link>
              </li>
              <li>
                <Link href="/program/geber-masjid" className="hover:text-[var(--gold-300)] transition-colors">
                  Geber Masjid (Bersih Masjid)
                </Link>
              </li>
              <li>
                <Link href="/program/tasmi-30-juz" className="hover:text-[var(--gold-300)] transition-colors">
                  Majlis Tasmi&apos; 30 Juz Bil-Ghoib
                </Link>
              </li>
              <li>
                <Link href="/program/yatim-berdikari" className="hover:text-[var(--gold-300)] transition-colors">
                  Program Yatim Berdikari
                </Link>
              </li>
              <li>
                <Link href="/data-sebaran" className="hover:text-[var(--gold-300)] transition-colors">
                  Peta &amp; Data Sebaran Real-Time
                </Link>
              </li>
              <li>
                <Link href="/portofolio" className="hover:text-[var(--gold-300)] transition-colors">
                  Portofolio Aplikasi Dakwah
                </Link>
              </li>
              <li>
                <Link href="/laporan" className="hover:text-[var(--gold-300)] transition-colors">
                  Laporan Akuntabilitas Terbuka
                </Link>
              </li>
              <li>
                <Link href="/dokumentasi" className="hover:text-[var(--gold-300)] transition-colors">
                  Galeri Dokumentasi Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Donation Accounts (1-click copy) */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-[var(--gold-400)] mb-4 font-sans">
              Rekening Resmi Infak
            </h4>
            <div className="p-4 rounded-xl bg-[var(--green-900)]/60 border border-[var(--gold-500)]/30 text-xs text-[var(--cream-200)]/90 leading-relaxed">
              <p className="font-semibold text-[var(--gold-300)] mb-1">Informasi rekening segera diumumkan</p>
              <p>Transfer donasi saat ini dapat dikonfirmasikan langsung melalui email pengurus yayasan.</p>
            </div>
          </div>

          {/* Col 4: Contact & Channels */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-[var(--gold-400)] mb-4 font-sans">
              Layanan Konfirmasi &amp; Kontak
            </h4>
            <ul className="space-y-3 text-sm text-[var(--cream-200)]/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--gold-400)] flex-shrink-0 mt-1" />
                <span>Bogor, Jawa Barat, Indonesia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--gold-400)] flex-shrink-0" />
                <a href="mailto:ajirasaaksarasemesta@gmail.com" className="hover:text-[var(--gold-300)]">
                  ajirasaaksarasemesta@gmail.com
                </a>
              </li>
              <li className="text-xs text-[var(--sage-300)]">
                Contact Person: <a href="https://wa.me/6282262170018" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--gold-400)] hover:underline">0822-6217-0018</a>
              </li>
            </ul>

            <div className="pt-4 mt-4 border-t border-[var(--gold-500)]/15">
              <div className="text-xs text-[var(--gold-300)] mb-2 font-medium">Kanal Media Sosial Resmi:</div>
              <div className="flex gap-3 text-xs">
                <a
                  href="https://www.instagram.com/sahabat_aksara_semesta?exln=enR1ZnBkZTA1enp6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--green-900)] border border-[var(--gold-500)]/20 hover:border-[var(--gold-400)] text-[var(--cream-100)] flex items-center gap-1 transition-colors"
                >
                  <span>@sahabat_aksara_semesta</span>
                  <ExternalLink className="w-3 h-3 text-[var(--gold-400)]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--sage-300)] gap-4">
          <p>
            &copy; {new Date().getFullYear()} Yayasan Sahabat Aksara. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-1 text-[var(--cream-200)]/80">
            <span>Berkhidmat dengan</span>
            <Heart className="w-3.5 h-3.5 text-[var(--terracotta-500)] fill-[var(--terracotta-500)]" />
            <span>untuk kemaslahatan umat</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

