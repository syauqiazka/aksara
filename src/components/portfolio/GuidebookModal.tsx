"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileText,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building,
} from "lucide-react";
import { PortfolioApp } from "@/content/portfolio";

interface GuidebookModalProps {
  app: PortfolioApp | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GuidebookModal({ app, isOpen, onClose }: GuidebookModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [mounted, setMounted] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      document.body.style.overflow = "hidden";
      // Pause Lenis smooth scroll while modal is active so inner mouse wheel scrolls correctly
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

  // Always reset scroll to top whenever modal opens or page changes
  useEffect(() => {
    if (isOpen && viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
  }, [isOpen, currentPage]);

  if (!mounted || !isOpen || !app) return null;

  const totalPages = app.guidebookChapters ? app.guidebookChapters.length : 3;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (app.pdfUrl) {
      const a = document.createElement("a");
      a.href = app.pdfUrl;
      a.download = `Guidebook_${app.name.replace(/\s+/g, "_")}.pdf`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
    // Open printable guidebook in new window which triggers download/print dialog
    const printWindow = window.open(`/portofolio/guidebook/${app.id}`, "_blank");
    if (printWindow) {
      printWindow.focus();
    }
  };

  return createPortal(
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden"
    >
      <div className="relative w-full max-w-4xl h-[90vh] max-h-[920px] flex flex-col rounded-3xl bg-[var(--green-950)] border border-[var(--gold-500)]/40 shadow-2xl overflow-hidden text-[var(--cream-50)]">
        
        {/* Tombol Tutup (X) — Posisi Kanan Atas */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-4 sm:top-4 sm:right-5 z-30 p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white/80 hover:text-white border border-white/10 transition-colors shadow-md cursor-pointer"
          title="Tutup Pratinjau (Esc)"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* PDF TOP BAR (READER TOOLBAR) */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 pr-14 sm:pr-16 bg-[var(--green-950)] border-b border-[var(--gold-500)]/30 text-xs flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-[var(--gold-500)]/20 text-[var(--gold-400)] flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm text-[var(--cream-50)] truncate">
                Guidebook_{app.id}.pdf
              </div>
              <p className="text-[11px] text-[var(--cream-200)]/70 truncate">
                {app.guidebookSubtitle || app.tagline}
              </p>
            </div>
          </div>

          {/* Controls: Pagination, Zoom & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {!app.pdfUrl && (
              <>
                {/* Pagination */}
                <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-xl border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="p-1 rounded-md hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Halaman Sebelumnya"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] px-1 text-[var(--cream-100)]">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1 rounded-md hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Halaman Berikutnya"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="hidden md:flex items-center gap-1 bg-black/40 px-2 py-1 rounded-xl border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                    className="p-1 rounded-md hover:bg-white/10 transition-colors"
                    title="Perkecil"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] px-1 text-[var(--cream-200)]">
                    {zoomLevel}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                    className="p-1 rounded-md hover:bg-white/10 transition-colors"
                    title="Perbesar"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}

            {/* Print / Save PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--cream-50)] transition-colors border border-white/10"
              title="Cetak atau Simpan PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              <span className="text-xs font-medium">Cetak</span>
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--gold-500)] text-[var(--green-950)] font-semibold hover:brightness-110 transition-all shadow-sm"
              title="Unduh Dokumen PDF Lengkap"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-xs">Unduh PDF</span>
            </button>
          </div>
        </div>

        {/* PDF VIEWPORT (SCROLLABLE CANVAS) */}
        <div
          ref={viewportRef}
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#1f2421]/90 flex justify-center overscroll-contain"
        >
          {app.pdfUrl ? (
            <div className="w-full h-full flex flex-col items-center max-w-5xl">
              <iframe
                src={`${app.pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                title={`Guidebook ${app.name}`}
                className="w-full h-[76vh] rounded-2xl border border-[var(--gold-500)]/30 shadow-2xl bg-white"
              />
              <div className="mt-2.5 flex items-center justify-end w-full px-2 text-xs text-[var(--cream-200)]/80">
                <a
                  href={app.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--gold-300)] hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di tab penuh</span>
                </a>
              </div>
            </div>
          ) : (
            /* A4 PAPER SHEET CONTAINER */
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
              className="w-full max-w-[760px] min-h-[960px] bg-white text-[var(--ink-900)] rounded-xl shadow-2xl p-8 sm:p-12 transition-transform duration-150 flex flex-col justify-between border border-gray-200"
            >
            {/* SHEET CONTENT DEPENDING ON CURRENT PAGE */}
            <div>
              {/* Document Header (Letterhead on every page) */}
              <div className="flex items-center justify-between pb-5 border-b-2 border-[var(--green-900)] mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--green-950)] relative overflow-hidden flex items-center justify-center text-[var(--gold-400)] font-bold text-lg border border-[var(--gold-500)]/40">
                    <Image
                      src="/images/logo-sahabat-aksara.jpg"
                      alt="Logo Sahabat Aksara"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[var(--green-950)] leading-tight">
                      YAYASAN SAHABAT AKSARA
                    </h3>
                    <p className="text-[10px] text-[var(--ink-600)] uppercase tracking-wider font-semibold">
                      Yayasan Ajirasa Aksara Semesta &mdash; AHU-0002692.AH.01.04.2026
                    </p>
                    <p className="text-[10px] text-[var(--gold-700)]">
                      Pilar IV: Teknologi &amp; Kemandirian Digital Ummat
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[var(--cream-100)] text-[var(--green-900)] border border-[var(--cream-200)]">
                    Official Guidebook
                  </span>
                  <p className="text-[10px] text-[var(--ink-400)] mt-1 font-mono">
                    Dokumen ID: GB-{app.id.toUpperCase()}-2026
                  </p>
                </div>
              </div>

              {/* ================= PAGE 1 ================= */}
              {currentPage === 1 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="text-center py-4 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--gold-700)]">
                      Buku Panduan Teknis &amp; Implementasi
                    </span>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--green-950)]">
                      {app.name}
                    </h1>
                    <p className="text-sm font-medium text-[var(--ink-700)] max-w-lg mx-auto">
                      {app.tagline}
                    </p>
                  </div>

                  {/* HIGHLIGHT BOX REDAKSI KEMITRAAN */}
                  <div className="p-4 rounded-2xl bg-[var(--gold-400)]/15 border-2 border-[var(--gold-500)]/40 text-[var(--ink-900)] space-y-2 shadow-xs">
                    <p className="text-sm sm:text-base font-bold text-[var(--green-950)] leading-snug">
                      &ldquo;Dapatkan dengan berinfak Al-Qur&apos;an (Rp. 200.000,-) + Donasi Seikhlasnya&rdquo;
                    </p>
                    <p className="text-xs text-[var(--ink-700)] leading-relaxed">
                      Setiap paket implementasi piranti lunak ini dialokasikan langsung untuk pencetakan dan penyaluran 
                      mushaf Al-Qur&apos;an Jinan bagi santri penghafal Al-Qur&apos;an serta lembaga pendidikan Islam di pelosok nusantara.
                    </p>
                  </div>

                  {/* RINGKASAN EKSEKUTIF */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-serif font-bold text-base text-[var(--green-900)] flex items-center gap-2">
                      <Building className="w-4 h-4 text-[var(--green-700)]" />
                      1. Deskripsi &amp; Sasaran Pengguna
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--ink-700)] leading-relaxed text-justify">
                      {app.description}
                    </p>
                  </div>

                  {/* BAB 1 DETAILS */}
                  {app.guidebookChapters && app.guidebookChapters[0] && (
                    <div className="space-y-3 pt-2">
                      <h4 className="font-serif font-bold text-base text-[var(--green-900)]">
                        2. {app.guidebookChapters[0].title}
                      </h4>
                      <p className="text-xs text-[var(--ink-600)] italic">
                        {app.guidebookChapters[0].subtitle}
                      </p>
                      <div className="grid grid-cols-1 gap-2.5 pt-1">
                        {app.guidebookChapters[0].bullets.map((b, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-[var(--ink-800)]">
                            <CheckCircle2 className="w-4 h-4 text-[var(--green-700)] flex-shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ================= PAGE 2 ================= */}
              {currentPage === 2 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--gold-700)]">
                      Bagian II: Modul Fungsional
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--green-950)] mt-1">
                      {app.guidebookChapters && app.guidebookChapters[1]
                        ? app.guidebookChapters[1].title
                        : "Fitur Unggulan & Spesifikasi Teknis"}
                    </h2>
                    <p className="text-xs text-[var(--ink-600)] italic mt-0.5">
                      {app.guidebookChapters && app.guidebookChapters[1]?.subtitle}
                    </p>
                  </div>

                  {/* DAFTAR FITUR LENGKAP */}
                  <div className="grid grid-cols-1 gap-3">
                    {(app.guidebookChapters && app.guidebookChapters[1]?.bullets
                      ? app.guidebookChapters[1].bullets
                      : app.features
                    ).map((f, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-lg bg-[var(--green-900)] text-[var(--gold-400)] flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[var(--ink-900)]">
                            Fitur Modul #{idx + 1}
                          </div>
                          <p className="text-xs text-[var(--ink-700)] mt-0.5 leading-relaxed">
                            {f}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SPESIFIKASI SISTEM TABLE */}
                  <div className="space-y-2 pt-3">
                    <h4 className="font-serif font-bold text-sm text-[var(--green-900)]">
                      Spesifikasi Lingkungan &amp; Perangkat
                    </h4>
                    <table className="w-full text-left text-xs border border-[var(--cream-200)] rounded-xl overflow-hidden">
                      <tbody className="divide-y divide-[var(--cream-200)]">
                        <tr className="bg-[var(--cream-50)]">
                          <td className="py-2 px-3 font-semibold text-[var(--ink-800)] w-1/3">
                            Platform Pengguna
                          </td>
                          <td className="py-2 px-3 text-[var(--ink-700)]">
                            Android OS 8.0 (Oreo) ke atas &amp; Akses Web Browser
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[var(--ink-800)]">
                            Konsol Manajemen
                          </td>
                          <td className="py-2 px-3 text-[var(--ink-700)]">
                            Web Admin Dashboard Responsif (PC / Laptop / Tablet)
                          </td>
                        </tr>
                        <tr className="bg-[var(--cream-50)]">
                          <td className="py-2 px-3 font-semibold text-[var(--ink-800)]">
                            Penyimpanan &amp; Database
                          </td>
                          <td className="py-2 px-3 text-[var(--ink-700)]">
                            Cloud Database Terenkripsi SSL dengan Backup Otomatis
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ================= PAGE 3 ================= */}
              {currentPage === 3 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--gold-700)]">
                      Bagian III: Prosedur Operasional
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--green-950)] mt-1">
                      {app.guidebookChapters && app.guidebookChapters[2]
                        ? app.guidebookChapters[2].title
                        : "SOP Implementasi & Narahubung"}
                    </h2>
                    <p className="text-xs text-[var(--ink-600)] italic mt-0.5">
                      Tata cara pengaktifan sistem bagi sekolah, instansi, atau pengurus lingkungan
                    </p>
                  </div>

                  {/* 4 LANGKAH IMPLEMENTASI */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)]">
                      <div className="w-7 h-7 rounded-full bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        1
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-[var(--ink-900)]">
                          Konfirmasi Kemitraan &amp; Penyaluran Infak Al-Qur&apos;an
                        </span>
                        <p className="text-[var(--ink-600)] mt-0.5 leading-relaxed">
                          Menghubungi layanan kemitraan Sahabat Aksara dengan komitmen infak mushaf Rp 200.000,- + donasi seikhlasnya.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)]">
                      <div className="w-7 h-7 rounded-full bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        2
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-[var(--ink-900)]">
                          Pembuatan Database Instansi &amp; Akun Administrator
                        </span>
                        <p className="text-[var(--ink-600)] mt-0.5 leading-relaxed">
                          Tim IT yayasan melakukan konfigurasi server instansi dan menyerahkan kredensial akun master admin.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)]">
                      <div className="w-7 h-7 rounded-full bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        3
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-[var(--ink-900)]">
                          Sosialisasi Poster &amp; Distribusi Akun Pengguna
                        </span>
                        <p className="text-[var(--ink-600)] mt-0.5 leading-relaxed">
                          Mencetak materi poster untuk sosialisasi wali santri/warga dan membagikan panduan instalasi aplikasi.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)]">
                      <div className="w-7 h-7 rounded-full bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        4
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-[var(--ink-900)]">
                          Layanan Pemeliharaan &amp; Konsultasi Berkelanjutan
                        </span>
                        <p className="text-[var(--ink-600)] mt-0.5 leading-relaxed">
                          Dukungan teknis berkala dan update fitur tanpa biaya lisensi bulanan yang membebani lembaga.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* LEMBAR PENGESAHAN / KONTAK RESMI */}
                  <div className="p-4 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-200)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs mt-6">
                    <div>
                      <div className="font-serif font-bold text-[var(--green-950)] text-sm">
                        Layanan Kemitraan Sahabat Aksara
                      </div>
                      <p className="text-[var(--ink-600)] mt-0.5">
                        WhatsApp Hotline: <strong>0822-6217-0018</strong>
                      </p>
                      <p className="text-[var(--ink-600)]">
                        Website: sahabataksarasemesta.org
                      </p>
                    </div>

                    <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-[var(--cream-300)] pt-3 sm:pt-0 sm:pl-4">
                      <div className="text-[10px] text-[var(--ink-500)] uppercase font-semibold">
                        Pengurus Yayasan
                      </div>
                      <div className="font-serif font-bold text-xs text-[var(--ink-900)] mt-2">
                        Ahmad Dahlan, S.Ag.
                      </div>
                      <div className="text-[10px] text-[var(--green-800)] font-medium">
                        Ketua Pembina Yayasan
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Document Footer (Page number & security notice) */}
            <div className="pt-6 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500 mt-8">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--green-700)]" />
                <span>Dokumen Sahabat Aksara Semesta &mdash; Hak Cipta Dilindungi</span>
              </div>
              <div className="font-mono">
                Halaman {currentPage} dari {totalPages}
              </div>
            </div>
          </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="px-4 sm:px-6 py-3 bg-[var(--green-950)] border-t border-[var(--gold-500)]/30 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="text-[11px] text-[var(--cream-200)]/80 flex items-center gap-2">
            <span className="font-semibold text-[var(--gold-400)]">Redaksi Kemitraan:</span>
            <span>&ldquo;{app.partnershipNote || "Dapatkan dengan berinfak Al-Qur'an (Rp. 200.000,-) + Donasi Seikhlasnya"}&rdquo;</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/6282262170018?text=${encodeURIComponent(
                `Assalamu'alaikum Admin Sahabat Aksara, saya tertarik dengan ${app.name} dan ingin mengajukan kemitraan infak Al-Qur'an Rp 200.000,-.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Ajukan via WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-[var(--gold-500)] hover:bg-[var(--gold-400)] text-[var(--green-950)] font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Berkas</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
