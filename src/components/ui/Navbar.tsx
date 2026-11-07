"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, HeartHandshake, ChevronRight } from "lucide-react";

const navLinks = [
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/program", label: "Program" },
  { href: "/portofolio", label: "Portofolio" },
  { href: "/data-sebaran", label: "Data Sebaran" },
  { href: "/laporan", label: "Laporan" },
  { href: "/donasi", label: "Donasi & Dokumentasi" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll saat mobile menu terbuka
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Otomatis tutup drawer jika rute berpindah
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 sm:h-[68px] flex items-center ${
          mobileMenuOpen
            ? "bg-[var(--green-950)] border-b border-[var(--gold-500)]/30 shadow-lg"
            : scrolled
            ? "bg-[var(--green-950)]/95 backdrop-blur-md shadow-md border-b border-[var(--gold-500)]/20"
            : "bg-gradient-to-b from-[var(--green-950)]/90 via-[var(--green-950)]/50 to-transparent"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group rounded-lg p-1 select-none focus-visible:ring-2 focus-visible:ring-[var(--gold-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--green-950)] focus-visible:outline-none"
          >
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[var(--gold-500)] shadow-sm bg-[var(--green-900)] flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo-sahabat-aksara.jpg"
                alt="Logo Yayasan Sahabat Aksara"
                fill
                className="object-cover"
                sizes="44px"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg leading-tight text-[var(--cream-50)] tracking-wide group-hover:text-[var(--gold-300)] transition-colors">
                Sahabat Aksara
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[var(--gold-400)] font-sans">
                Yayasan Nirlaba
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Navigasi Utama">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all relative py-1 px-1.5 rounded-md cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-[var(--gold-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--green-950)] focus-visible:outline-none ${
                    isActive
                      ? "text-[var(--gold-400)] font-semibold"
                      : "text-[var(--cream-100)] hover:text-[var(--gold-300)]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-[var(--gold-400)] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/donasi"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-200 transform active:scale-[0.98] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--green-950)]"
            >
              <HeartHandshake className="w-4 h-4 text-[var(--green-950)]" />
              <span>Donasi</span>
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 text-[var(--cream-50)] hover:text-[var(--gold-300)] rounded-lg focus-visible:ring-2 focus-visible:ring-[var(--gold-500)] focus-visible:outline-none"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer via Portal agar terbebas dari batasan containing block / backdrop-filter header */}
      {mounted &&
        mobileMenuOpen &&
        createPortal(
          <div
            id="mobile-nav-drawer"
            className="lg:hidden fixed inset-x-0 top-16 sm:top-[68px] bottom-0 z-[100] bg-[var(--green-950)] border-t border-[var(--gold-500)]/20 p-6 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Menu Navigasi Mobile"
          >
            <nav className="flex flex-col gap-3 py-4" aria-label="Navigasi Seluler">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3.5 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--green-900)] text-[var(--gold-400)] border border-[var(--gold-500)]/30 font-semibold"
                        : "text-[var(--cream-100)] hover:bg-[var(--green-900)]/50 hover:text-[var(--gold-300)]"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-[var(--gold-500)]/60" />
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-[var(--gold-500)]/20 flex flex-col gap-3 pb-8">
              <Link
                href="/donasi"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-base font-semibold bg-gold-gradient text-[var(--green-950)] shadow-[var(--shadow-md)] active:scale-[0.98] cursor-pointer transition-all duration-200"
              >
                <HeartHandshake className="w-5 h-5 text-[var(--green-950)]" />
                <span>Salurkan Donasi</span>
              </Link>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
