"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Phone } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error secara aman
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <main className="min-h-[85vh] flex items-center justify-center bg-[var(--cream-50)] px-4 py-16">
      <div className="w-full max-w-lg mx-auto text-center">
        <div className="bg-white border border-rose-200/80 rounded-2xl p-8 sm:p-10 shadow-[0_12px_32px_rgba(6,33,15,0.06)] relative overflow-hidden">
          {/* Ikon Kendala */}
          <div className="mx-auto w-14 h-14 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mb-5 border border-rose-200">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="font-arabic text-xl text-[var(--green-950)] mb-2" dir="rtl" lang="ar">
            لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ
          </div>
          <p className="text-xs text-[var(--ink-500)] italic mb-5">
            &ldquo;Tiada daya dan kekuatan kecuali dengan pertolongan Allah.&rdquo;
          </p>

          <h1 className="font-fraunces text-2xl font-semibold text-[var(--ink-900)] mb-3">
            Kendala Teknis Sementara
          </h1>

          <p className="text-sm text-[var(--ink-700)] leading-relaxed max-w-sm mx-auto mb-6">
            Mohon maaf atas ketidaknyamanan ini. Sistem mendeteksi anomali pada koneksi atau pemrosesan data. Silakan coba muat ulang atau kembali ke beranda.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button
              onClick={() => reset()}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--green-950)] text-white hover:bg-[var(--green-900)] transition-colors text-sm font-medium shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[var(--gold-400)]" />
              Coba Muat Ulang
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-[var(--ink-800)] hover:bg-slate-50 transition-colors text-sm font-medium cursor-pointer"
            >
              <Home className="w-4 h-4 text-slate-500" />
              Ke Beranda
            </Link>
          </div>

          <div className="pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-[var(--ink-500)]">
            <Phone className="w-3.5 h-3.5 text-[var(--green-700)]" />
            <span>Kendala berlanjut? Hubungi kami di 0822-6217-0018</span>
          </div>
        </div>
      </div>
    </main>
  );
}

