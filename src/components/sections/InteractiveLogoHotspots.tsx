"use client";

import { useState } from "react";
import Image from "next/image";
import { organizationContent } from "@/content/organization";

export default function InteractiveLogoHotspots() {
  const [activeHotspot, setActiveHotspot] = useState<string>("hands");

  const hotspots = organizationContent.logoMeaning;
  const current = hotspots.find((h) => h.id === activeHotspot) || hotspots[0];

  return (
    <div className="bg-[var(--green-950)] text-[var(--cream-50)] p-6 sm:p-10 rounded-3xl border border-[var(--gold-500)]/30 relative overflow-hidden shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Interactive Logo Container */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-full p-3 border-2 border-[var(--gold-500)]/40 bg-[var(--green-900)]/80 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src="/images/logo-sahabat-aksara.jpg"
                alt="Logo Resmi Yayasan Sahabat Aksara"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 288px, 350px"
              />
            </div>

            {/* Hotspot buttons */}
            {hotspots.map((spot) => {
              const isSelected = spot.id === activeHotspot;
              return (
                <button
                  key={spot.id}
                  onClick={() => setActiveHotspot(spot.id)}
                  style={{ top: spot.coord.y, left: spot.coord.x }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition-transform focus:outline-none ${
                    isSelected ? "scale-125 z-20" : "hover:scale-110 z-10"
                  }`}
                  aria-label={`Sorot makna ${spot.title}`}
                >
                  <span className="relative flex h-5 w-5">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isSelected ? "bg-[var(--gold-300)]" : "bg-[var(--gold-500)]"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-5 w-5 border-2 border-white shadow-md ${
                        isSelected ? "bg-[var(--gold-400)]" : "bg-[var(--green-700)]"
                      }`}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-[var(--gold-400)] mt-4 text-center font-medium">
            Pilih titik hotspot pada logo untuk membaca filosofinya
          </p>
        </div>

        {/* Hotspot Details & Meaning Tab */}
        <div className="lg:col-span-6">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--gold-500)]/20 text-[var(--gold-400)] border border-[var(--gold-500)]/40">
              Bedah Filosofi Lambang
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--cream-50)]">
              {current.title}
            </h3>

            <div className="w-16 h-1 bg-[var(--gold-500)] rounded-full" />

            <p className="text-base text-[var(--cream-100)] leading-relaxed pt-2">
              {current.desc}
            </p>

            {/* Quick list of elements */}
            <div className="pt-6 grid grid-cols-2 gap-2 border-t border-[var(--gold-500)]/20">
              {hotspots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setActiveHotspot(spot.id)}
                  className={`text-left text-xs p-2.5 rounded-xl border transition-all ${
                    spot.id === activeHotspot
                      ? "bg-[var(--gold-500)]/20 border-[var(--gold-400)] text-[var(--gold-300)] font-semibold"
                      : "bg-[var(--green-900)]/40 border-[var(--gold-500)]/15 text-[var(--cream-200)]/80 hover:bg-[var(--green-900)]"
                  }`}
                >
                  {spot.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

