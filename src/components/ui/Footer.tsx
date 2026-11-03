"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Copy, Check, Heart, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { organizationContent } from "@/content/organization";

export default function Footer() {
  const pathname = usePathname();
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // If on admin route, don't show public footer
  if (pathname.startsWith("/admin")) return null;

  const copyToClipboard = (accountNo: string, bank: string) => {
    navigator.clipboard.writeText(accountNo);
    setCopiedBank(bank);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  return (
    <footer className="relative bg-[var(--green-950)] text-[var(--cream-100)] pt-16 pb-12 overflow-hidden border-t-2 border-[var(--gold-500)]/40">
      {/* Background Islamic star geometry watermark */}
      <div className="absolute inset-0 bg-islamic-stars opacity-40 pointer-events-none" />

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
              <p>SK Kemenkumham: <span className="text-[var(--cream-100)]">{organizationContent.skKemenkumham}</span></p>
              <p>NPWP: <span className="text-[var(--cream-100)]">{organizationContent.npwp}</span></p>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-[var(--gold-400)] mb-4 font-sans">
              Jelajahi Program
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/program/infak-alquran" className="hover:text-[var(--gold-300)] transition-colors">
                  Infak 1 Jt Al-Qur&apos;an Custom Nama
                </Link>
              </li>
              <li>
                <Link href="/program/geber-masjid" className="hover:text-[var(--gold-300)] transition-colors">
                  Geber Masjid (Bersih-Bersih)
                </Link>
              </li>
              <li>
                <Link href="/program/tasmi-30-juz" className="hover:text-[var(--gold-300)] transition-colors">
                  Majlis Tasmi&apos; 30 Juz Bil Ghaib
                </Link>
              </li>
              <li>
                <Link href="/data-sebaran" className="hover:text-[var(--gold-300)] transition-colors">
                  Peta & Data Sebaran Real-Time
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
            </ul>
          </div>

          {/* Col 3: Direct Donation Accounts (1-click copy) */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-[var(--gold-400)] mb-4 font-sans">
              Rekening Resmi Infaq
            </h4>
            <p className="text-xs text-[var(--cream-200)]/70 mb-3">
              Klik nomor rekening untuk menyalin secara instan:
            </p>
            <div className="space-y-3">
              <div
                onClick={() => copyToClipboard("7283829102", "BSI")}
                className="group cursor-pointer p-3 rounded-xl bg-[var(--green-900)]/60 border border-[var(--gold-500)]/30 hover:border-[var(--gold-400)] transition-all"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && copyToClipboard("7283829102", "BSI")}
              >
                <div className="flex items-center justify-between text-xs text-[var(--gold-300)] font-medium mb-1">
                  <span>Bank Syariah Indonesia (BSI)</span>
                  {copiedBank === "BSI" ? (
                    <span className="flex items-center gap-1 text-[var(--gold-400)] text-[11px] font-bold">
                      <Check className="w-3.5 h-3.5" /> Tersalin!
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <div className="font-mono text-base font-bold tracking-wider text-[var(--cream-50)]">
                  7283 829 102
                </div>
                <div className="text-[11px] text-[var(--sage-300)] truncate">
                  a.n [KONFIRMASI] Yayasan Ajirasa Aksara Semesta
                </div>
              </div>

              <div
                onClick={() => copyToClipboard("1370029384721", "Mandiri")}
                className="group cursor-pointer p-3 rounded-xl bg-[var(--green-900)]/60 border border-[var(--gold-500)]/30 hover:border-[var(--gold-400)] transition-all"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && copyToClipboard("1370029384721", "Mandiri")}
              >
                <div className="flex items-center justify-between text-xs text-[var(--gold-300)] font-medium mb-1">
                  <span>Bank Mandiri</span>
                  {copiedBank === "Mandiri" ? (
                    <span className="flex items-center gap-1 text-[var(--gold-400)] text-[11px] font-bold">
                      <Check className="w-3.5 h-3.5" /> Tersalin!
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <div className="font-mono text-base font-bold tracking-wider text-[var(--cream-50)]">
                  137 002 938 4721
                </div>
                <div className="text-[11px] text-[var(--sage-300)] truncate">
                  a.n [KONFIRMASI] Yayasan Sahabat Aksara
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Channels */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-[var(--gold-400)] mb-4 font-sans">
              Layanan Konfirmasi & Kontak
            </h4>
            <ul className="space-y-3 text-sm text-[var(--cream-200)]/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--gold-400)] flex-shrink-0 mt-1" />
                <span>[KONFIRMASI] Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[var(--gold-400)] flex-shrink-0" />
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold-300)]">
                  +62 812-3456-7890 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--gold-400)] flex-shrink-0" />
                <a href="mailto:kontak@sahabataksara.id" className="hover:text-[var(--gold-300)]">
                  kontak@sahabataksara.id
                </a>
              </li>
            </ul>

            <div className="pt-4 mt-4 border-t border-[var(--gold-500)]/15">
              <div className="text-xs text-[var(--gold-300)] mb-2 font-medium">Kanal Media Sosial Resmi:</div>
              <div className="flex gap-3 text-xs">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--green-900)] border border-[var(--gold-500)]/20 hover:border-[var(--gold-400)] text-[var(--cream-100)] flex items-center gap-1 transition-colors"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 text-[var(--gold-400)]" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--green-900)] border border-[var(--gold-500)]/20 hover:border-[var(--gold-400)] text-[var(--cream-100)] flex items-center gap-1 transition-colors"
                >
                  <span>YouTube</span>
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

