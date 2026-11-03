"use client";

import { Sparkles, ArrowRight, BookOpen, Building2 } from "lucide-react";
import Link from "next/link";

export default function AnnouncementTicker() {
  const announcements = [
    { text: "Penyaluran 50 Mushaf Custom Nama ke Ponpes Al-Hikmah Bogor telah selesai diverifikasi", link: "/data-sebaran", tag: "Update" },
    { text: "Aksi Geber Masjid ke-14 di Masjid Baiturrahim Pamulang berhasil dilaksanakan bersama 28 relawan", link: "/program/geber-masjid", tag: "Geber Masjid" },
    { text: "Pendaftaran Kafalah Santri Tahfidz Majlis Tasmi' 30 Juz telah dibuka", link: "/program/tasmi-30-juz", tag: "Tasmi'" },
  ];

  return (
    <div className="bg-[var(--green-950)] text-[var(--gold-300)] text-xs border-b border-[var(--gold-500)]/20 py-2 px-4 relative z-40 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--gold-500)] text-[var(--green-950)] font-bold text-[10px] uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Berita Terkini
          </span>
        </div>

        <div className="overflow-hidden whitespace-nowrap flex-1 relative">
          <div className="inline-flex animate-[ticker_25s_linear_infinite] gap-8">
            {announcements.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className="inline-flex items-center gap-2 hover:text-[var(--cream-50)] transition-colors"
              >
                <span className="font-medium text-[var(--cream-100)]">{item.text}</span>
                <span className="text-[10px] text-[var(--gold-400)] underline flex items-center gap-0.5">
                  Lihat <ArrowRight className="w-2.5 h-2.5" />
                </span>
                <span className="text-[var(--gold-500)]/40 ml-4">&bull;</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[11px] text-[var(--cream-200)] flex-shrink-0">
          <span>Layanan Donatur: <strong>+62 812-3456-7890</strong></span>
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

