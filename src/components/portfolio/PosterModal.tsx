"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
} from "lucide-react";
import { PortfolioApp } from "@/content/portfolio";

interface PosterModalProps {
  app: PortfolioApp | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PosterModal({ app, isOpen, onClose }: PosterModalProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Pause Lenis smooth scroll while modal is active
      const globalLenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
      globalLenis?.stop?.();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        globalLenis?.start?.();
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !app) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloading(true);
    // Simple & reliable client download: Render SVG / Image or trigger browser save
    const posterEl = posterRef.current;
    if (!posterEl) {
      setDownloading(false);
      return;
    }

    try {
      const clone = posterEl.cloneNode(true) as HTMLElement;
      
      // Inline printable HTML page for immediate high-res download
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Poster_${app.id}_Sahabat_Aksara</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
            body { margin: 0; padding: 20px; background: #0c1410; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
            .poster-card { width: 560px; min-height: 800px; }
            @media print {
              body { background: white; padding: 0; }
              .poster-card { width: 100%; height: 100%; box-shadow: none; border-radius: 0; }
            }
          </style>
        </head>
        <body>
          <div class="poster-card">${clone.outerHTML}</div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Poster_${app.id}_Sahabat_Aksara.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return createPortal(
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[var(--green-950)] border border-[var(--gold-500)]/30 shadow-2xl overflow-hidden text-[var(--cream-50)]">
        
        {/* HEADER TOOLBAR */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-black/40 border-b border-[var(--gold-500)]/20 text-xs flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[var(--gold-500)]/20 text-[var(--gold-400)]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="font-bold text-sm text-[var(--cream-50)]">
                Pratinjau Poster Promosi
              </span>
              <p className="text-[10px] text-[var(--cream-200)]/70">
                Format Cetak A4 / Sosialisasi Lembaga
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-medium border border-white/10"
              title="Cetak Poster"
            >
              <Printer className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              <span>Cetak</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--gold-500)] hover:bg-[var(--gold-400)] text-[var(--green-950)] font-bold transition-colors text-xs shadow-sm"
              title="Unduh Berkas Poster"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? "Memproses..." : "Unduh Poster"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Tutup (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* POSTER VIEWPORT */}
        <div
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center bg-[#0d1410] overscroll-contain"
        >
          
          {/* THE OFFICIAL HIGH-RES POSTER CARD */}
          <div
            ref={posterRef}
            className="w-full max-w-[500px] rounded-3xl bg-gradient-to-b from-[#0a2318] via-[#081a12] to-[#040e0a] border-2 border-[var(--gold-500)]/40 p-6 sm:p-8 text-[var(--cream-50)] shadow-2xl relative overflow-hidden flex flex-col justify-between"
          >
            {/* Islamic geometric watermarks */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[var(--gold-500)]/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[var(--green-700)]/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              {/* Top Banner: Yayasan Logo & Identity */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--gold-500)]/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--green-950)] relative overflow-hidden border border-[var(--gold-500)]/50 shadow-md">
                    <Image
                      src="/images/logo-sahabat-aksara.jpg"
                      alt="Logo Sahabat Aksara"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[var(--cream-50)] leading-tight">
                      YAYASAN SAHABAT AKSARA
                    </h4>
                    <p className="text-[9px] text-[var(--gold-400)] uppercase tracking-wider font-semibold">
                      Pilar Teknologi Dakwah Digital
                    </p>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-[var(--gold-500)]/20 border border-[var(--gold-500)]/40 text-[9px] font-bold text-[var(--gold-300)] uppercase tracking-wider">
                  Program Kemitraan
                </div>
              </div>

              {/* Poster Hero & Visual */}
              <div className="text-center space-y-3 pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-500)]/15 border border-[var(--gold-500)]/30 text-[10px] font-bold text-[var(--gold-400)] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Solusi Digital Mandiri Ummat</span>
                </div>

                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-[var(--green-900)] border-2 border-[var(--gold-500)] p-2 shadow-xl flex items-center justify-center relative overflow-hidden group">
                  {app.logoImage ? (
                    <Image
                      src={app.logoImage}
                      alt={app.name}
                      width={96}
                      height={96}
                      className="object-cover rounded-2xl"
                    />
                  ) : (
                    <Layers className="w-10 h-10 text-[var(--gold-400)]" />
                  )}
                </div>

                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--cream-50)] leading-tight">
                    {app.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--gold-400)] font-medium mt-1">
                    {app.posterHeadline || app.tagline}
                  </p>
                </div>
              </div>

              {/* FITUR UNGGULAN CHECKLIST */}
              <div className="bg-black/40 rounded-2xl p-4 border border-[var(--gold-500)]/20 space-y-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-400)] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Keunggulan &amp; Manfaat Sistem:</span>
                </div>
                <div className="space-y-2">
                  {app.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[var(--cream-100)]">
                      <CheckCircle2 className="w-4 h-4 text-[var(--gold-400)] flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* THE REQUESTED PROMINENT CALLOUT BOX */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--gold-500)]/20 via-[var(--gold-400)]/30 to-[var(--gold-500)]/20 border-2 border-[var(--gold-400)] text-center shadow-lg space-y-1">
                <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--gold-300)]">
                  Paket Kemitraan Dakwah
                </div>
                <div className="font-serif text-sm sm:text-base font-extrabold text-[#ffd700] leading-snug">
                  &ldquo;Dapatkan dengan berinfak Al-Qur&apos;an (Rp. 200.000,-) + Donasi Seikhlasnya&rdquo;
                </div>
                <p className="text-[10px] text-[var(--cream-200)]/90 leading-relaxed pt-1">
                  Seluruh infak dialokasikan untuk mushaf Al-Qur&apos;an Jinan bagi santri pelosok nusantara.
                </p>
              </div>

            </div>

            {/* Poster Footer: Contact & Website */}
            <div className="relative z-10 pt-6 mt-6 border-t border-[var(--gold-500)]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-[var(--cream-200)]/80">
              <div>
                <span className="font-semibold text-[var(--gold-400)]">Hotline Kemitraan:</span>{" "}
                <strong className="text-white">0822-6217-0018</strong>
              </div>
              <div className="flex items-center gap-2">
                <span>sahabataksarasemesta.org</span>
                <span>|</span>
                <span>@Sahabat Aksara</span>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM FOOTER BAR */}
        <div className="px-5 py-3 bg-black/50 border-t border-[var(--gold-500)]/20 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
          <p className="text-[11px] text-[var(--cream-200)]/80">
            Poster siap dibagikan ke wali santri, dewan guru, atau grup warga.
          </p>

          <a
            href={`https://wa.me/6282262170018?text=${encodeURIComponent(
              `Assalamu'alaikum Admin Sahabat Aksara, saya ingin menanyakan implementasi poster & aplikasi ${app.name} (Infak Al-Qur'an Rp 200.000,-).`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <span>Hubungi via WhatsApp</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>,
    document.body
  );
}
