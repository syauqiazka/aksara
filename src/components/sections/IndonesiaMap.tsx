"use client";

import { useState } from "react";
import { MapPin, BookOpen, Calendar, CheckCircle2, X } from "lucide-react";
import { InfakDistribution, GeberMasjidDistribution } from "@/lib/db/types";

interface IndonesiaMapProps {
  infakData?: InfakDistribution[];
  geberData?: GeberMasjidDistribution[];
  activeTab?: "infak" | "geber";
  onSelectRecipient?: (name: string) => void;
}

// Map coordinates to 1000x480 viewBox matching the authentic Indonesia silhouette
function projectCoords(lng: number, lat: number) {
  const minLng = 95.0;
  const maxLng = 141.0;
  const minLat = -11.0;
  const maxLat = 6.0;

  const x = ((lng - minLng) / (maxLng - minLng)) * 880 + 55;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 340 + 65;

  return { x, y };
}

export default function IndonesiaMap({
  infakData = [],
  geberData = [],
  activeTab = "infak",
}: IndonesiaMapProps) {
  const [selectedPoint, setSelectedPoint] = useState<{
    id: string;
    title: string;
    subtitle: string;
    date: string;
    qtyOrParticipants: string;
    location: string;
    type: string;
  } | null>(null);

  const points =
    activeTab === "infak"
      ? infakData.map((d) => {
          const lat = d.lat || -6.69;
          const lng = d.lng || 106.85;
          const { x, y } = projectCoords(lng, lat);
          return {
            id: d.id,
            x,
            y,
            title: d.recipient_name.replace(/\s*\[CONTOH[^\]]*\]/gi, ""),
            subtitle: d.show_donor_name
              ? `Donatur: ${d.donor_name.replace(/\s*\[CONTOH[^\]]*\]/gi, "")}`
              : "Donatur: Hamba Allah",
            date: d.distributed_at,
            qtyOrParticipants: `${d.quantity} Mushaf Al-Qur'an (Mushaf ke-${d.mushaf_no})`,
            location: `${d.district}, ${d.city}, ${d.province}`,
            type: d.recipient_type,
          };
        })
      : geberData.map((g) => {
          const lat = g.lat || -6.24;
          const lng = g.lng || 106.99;
          const { x, y } = projectCoords(lng, lat);
          return {
            id: g.id,
            x,
            y,
            title: g.mosque_name.replace(/\s*\[CONTOH[^\]]*\]/gi, ""),
            subtitle: g.activity_notes || "Aksi pembersihan dan sanitasi masjid",
            date: g.activity_date,
            qtyOrParticipants: `${g.participants} Relawan Berpartisipasi`,
            location: `${g.address}, ${g.city}, ${g.province}`,
            type: "masjid",
          };
        });

  return (
    <div className="relative bg-[var(--green-950)] border-2 border-[var(--gold-500)]/30 rounded-3xl p-4 sm:p-8 overflow-hidden shadow-2xl">
      {/* Background stars */}
      <div className="absolute inset-0 bg-islamic-stars opacity-15 pointer-events-none" />

      {/* Map header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[var(--gold-500)]/20">
        <div>
          <div className="text-xs uppercase tracking-widest text-[var(--gold-400)] font-sans font-semibold">
            Peta Sebaran Nasional
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--cream-50)]">
            {activeTab === "infak"
              ? "Titik Penyaluran Mushaf Al-Qur'an Nusantara"
              : "Titik Aksi Geber Masjid Nusantara"}
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-[var(--cream-200)]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[var(--gold-400)] shadow-[0_0_8px_var(--gold-400)]" />
            <span>Titik Penyaluran</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--teal-600)]" />
            <span>Pusat Yayasan (Jakarta)</span>
          </div>
        </div>
      </div>

      {/* Authentic High-Fidelity Silhouette SVG of Indonesia Archipelago */}
      <div className="relative w-full aspect-[2.1/1] min-h-[320px] flex items-center justify-center">
        <svg
          viewBox="0 0 1000 480"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle grid latitude/longitude lines */}
          <g stroke="rgba(212, 175, 55, 0.08)" strokeWidth="0.75" strokeDasharray="3 4">
            <line x1="50" y1="120" x2="950" y2="120" />
            <line x1="50" y1="240" x2="950" y2="240" />
            <line x1="50" y1="360" x2="950" y2="360" />
            <line x1="280" y1="40" x2="280" y2="440" />
            <line x1="520" y1="40" x2="520" y2="440" />
            <line x1="760" y1="40" x2="760" y2="440" />
          </g>

          {/* Realistic Silhouette of Indonesian Major Islands */}
          <g fill="#0e431a" stroke="#d4af37" strokeWidth="0.85" opacity="0.85">
            {/* SUMATRA */}
            <path d="M 68 82 Q 78 70 88 80 L 105 102 Q 130 135 155 170 L 180 205 Q 210 240 235 280 L 255 315 Q 260 325 248 328 L 225 320 Q 195 295 170 255 L 140 210 Q 115 165 92 125 L 75 95 Z" />
            {/* Nias, Siberut & Mentawai */}
            <path d="M 72 150 Q 82 170 78 185 Q 70 170 72 150 Z" />
            <path d="M 105 210 Q 120 235 115 250 Q 102 235 105 210 Z" />
            {/* Bangka & Belitung */}
            <path d="M 235 240 Q 248 235 252 248 Q 246 260 235 252 Z" />
            <path d="M 268 255 Q 278 252 280 262 Q 274 270 266 265 Z" />

            {/* JAWA & MADURA */}
            <path d="M 245 352 Q 275 350 310 353 L 360 356 Q 405 358 440 365 L 458 375 Q 460 382 450 385 L 390 382 Q 340 378 290 375 L 246 368 Q 238 360 245 352 Z" />
            {/* Madura */}
            <path d="M 425 350 Q 452 350 458 358 Q 445 365 422 360 Z" />

            {/* BALI, LOMBOK, SUMBAWA, FLORES, TIMOR */}
            <path d="M 466 376 Q 478 375 480 382 Q 472 388 466 382 Z" />
            <path d="M 488 376 Q 498 375 500 384 Q 492 388 486 383 Z" />
            <path d="M 508 376 Q 532 375 540 384 Q 528 392 506 385 Z" />
            <path d="M 552 378 Q 590 376 605 385 Q 588 394 550 386 Z" />
            <path d="M 618 388 Q 648 384 660 398 Q 638 408 615 398 Z" />

            {/* KALIMANTAN */}
            <path d="M 335 150 Q 365 125 405 120 L 440 128 Q 470 145 475 175 L 472 215 Q 465 255 440 272 L 400 278 Q 360 272 340 250 L 330 210 Q 325 175 335 150 Z" />

            {/* SULAWESI (Signature 4-peninsula shape) */}
            <path d="M 520 180 Q 532 152 560 148 L 590 145 Q 600 148 595 158 L 565 162 Q 545 175 540 195 L 565 215 Q 585 220 595 235 L 568 242 Q 548 230 538 238 L 542 278 Q 538 290 528 288 L 522 250 Q 515 210 520 180 Z" />

            {/* MALUKU ARCHIPELAGO (Halmahera, Seram, Buru) */}
            <path d="M 648 155 Q 662 142 668 158 L 655 185 Q 642 175 648 155 Z" />
            <path d="M 645 225 Q 675 220 685 232 Q 668 240 642 235 Z" />
            <path d="M 618 228 Q 632 225 635 235 Q 628 242 616 238 Z" />

            {/* PAPUA & KEPALA BURUNG */}
            <path d="M 728 195 Q 745 175 765 188 L 782 205 Q 815 195 860 215 L 920 235 Q 940 252 935 290 L 890 318 Q 845 320 805 285 L 778 250 Q 755 240 735 230 Q 715 215 728 195 Z" />
          </g>

          {/* Jakarta Central Markaz Hub */}
          <circle cx="280" cy="360" r="5" fill="var(--teal-600)" />
          <circle cx="280" cy="360" r="10" fill="none" stroke="var(--teal-600)" strokeWidth="1" strokeDasharray="2 2" />

          {/* Arching Delivery Connection Lines */}
          {points.map((p, idx) => (
            <path
              key={`line-${p.id}-${idx}`}
              d={`M 280 360 Q ${(280 + p.x) / 2} ${(360 + p.y) / 2 - 30} ${p.x} ${p.y}`}
              fill="none"
              stroke="rgba(212, 175, 55, 0.3)"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          ))}

          {/* Distribution Pins (Clean, Stable, Non-jittery) */}
          {points.map((p) => {
            const isSelected = selectedPoint?.id === p.id;
            return (
              <g
                key={p.id}
                onClick={() => setSelectedPoint(p)}
                className="cursor-pointer"
              >
                {/* Outer luminous glow ring */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? "11" : "8"}
                  fill="rgba(212, 175, 55, 0.2)"
                  stroke="var(--gold-400)"
                  strokeWidth={isSelected ? "2" : "1"}
                  className="transition-all duration-200"
                />
                {/* Core dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? "5" : "3.8"}
                  fill={isSelected ? "#FFF" : "var(--gold-300)"}
                  stroke="#06210F"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Selected Location Card */}
        {selectedPoint && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm bg-[var(--green-950)]/98 border-2 border-[var(--gold-500)] p-5 rounded-2xl shadow-2xl text-[var(--cream-50)] z-20">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--gold-300)] bg-[var(--green-900)] px-2.5 py-0.5 rounded-full border border-[var(--gold-500)]/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                Terverifikasi
              </span>
              <button
                onClick={() => setSelectedPoint(null)}
                className="p-1 text-[var(--sage-300)] hover:text-white"
                aria-label="Tutup Detail"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h4 className="font-serif font-bold text-base text-[var(--cream-50)] leading-snug">
              {selectedPoint.title}
            </h4>
            <p className="text-xs text-[var(--gold-300)] font-medium mt-0.5">
              {selectedPoint.subtitle}
            </p>
            <div className="mt-3 pt-2.5 border-t border-[var(--gold-500)]/20 space-y-1.5 text-xs text-[var(--cream-200)]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[var(--gold-400)] flex-shrink-0" />
                <span className="truncate">{selectedPoint.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[var(--gold-400)] flex-shrink-0" />
                <span>{selectedPoint.qtyOrParticipants}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[var(--gold-400)] flex-shrink-0" />
                <span>Tanggal: {selectedPoint.date}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="text-center text-xs text-[var(--sage-300)] mt-2">
        Klik titik lingkaran emas untuk melihat berita acara serah terima di wilayah tersebut.
      </p>
    </div>
  );
}
