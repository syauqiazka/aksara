"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { UploadCloud, CheckCircle2, Clock } from "lucide-react";
import { UploadProgressInfo } from "@/lib/upload-helper";

interface UploadProgressModalProps {
  isOpen: boolean;
  progress: UploadProgressInfo | null;
  title?: string;
}

export default function UploadProgressModal({
  isOpen,
  progress,
  title = "Menyimpan & Mengunggah Berkas",
}: UploadProgressModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!mounted || !isOpen || !progress) return null;

  const { current, total, percentage, etaSeconds, currentFileName } = progress;
  const isFinished = percentage >= 100;

  // Format time remaining text
  const getTimeRemainingText = () => {
    if (isFinished) return "Menyelesaikan proses penyimpanan...";
    if (etaSeconds === null || etaSeconds === undefined) return "Menghitung sisa waktu...";
    if (etaSeconds <= 1) return "Tersisa sekitar 1 detik";
    if (etaSeconds < 60) return `Tersisa sekitar ${etaSeconds} detik`;
    const mins = Math.floor(etaSeconds / 60);
    const secs = etaSeconds % 60;
    return `Tersisa sekitar ${mins} mnt ${secs > 0 ? `${secs} dtk` : ""}`;
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-[var(--green-950)] border-2 border-[var(--gold-500)]/40 p-6 sm:p-7 text-[var(--cream-50)] shadow-2xl flex flex-col space-y-5">
        {/* Header Icon & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[var(--gold-500)]/20 border border-[var(--gold-500)]/40 flex items-center justify-center text-[var(--gold-400)] flex-shrink-0">
            {isFinished ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-in zoom-in-75 duration-200" />
            ) : (
              <UploadCloud className="w-6 h-6 animate-pulse" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif font-bold text-base text-[var(--cream-50)] leading-tight">
              {title}
            </h3>
            <p className="text-xs text-[var(--gold-400)] font-medium mt-0.5">
              Mohon tunggu, berkas sedang diproses
            </p>
          </div>
        </div>

        {/* Counter Card - As shown in user reference ("Uploading 3 of 8") */}
        <div className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm sm:text-base text-white">
              Mengunggah {current} dari {total} foto
            </span>
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--gold-500)]/20 text-[var(--gold-300)] border border-[var(--gold-500)]/30">
              {percentage}%
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[var(--gold-500)] via-[var(--gold-400)] to-emerald-400 rounded-full transition-all duration-300 ease-out shadow-xs"
              style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
            />
          </div>

          {/* Subtext: File name & Estimated time left ("About 20 s left") */}
          <div className="flex items-center justify-between text-xs text-[var(--cream-200)]/80 pt-0.5">
            <span className="truncate max-w-[180px] text-[11px] font-mono text-[var(--cream-300)]/70">
              {currentFileName}
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[var(--gold-300)] flex-shrink-0">
              <Clock className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              <span>{getTimeRemainingText()}</span>
            </span>
          </div>
        </div>

        {/* Safety Note */}
        <p className="text-[11px] text-[var(--cream-200)]/60 text-center leading-relaxed">
          Jangan menutup atau me-refresh halaman sebelum proses unggah selesai agar integritas data tetap terjaga.
        </p>
      </div>
    </div>,
    document.body
  );
}
