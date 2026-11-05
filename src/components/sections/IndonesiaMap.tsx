"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { MapPin, X, Layers } from "lucide-react";
import { INDONESIA_ISLANDS, IslandId, IslandInfo } from "./indonesiaMapData";
import { PublicInfakJinanRecord } from "@/lib/db/types";
import { getIslandByProvince } from "@/lib/provinces-38";
import { formatTanggal } from "@/lib/format-date";

export interface MapPinPoint {
  id: string;
  islandId: IslandId;
  label: string;
  detail: string;
  x: number;
  y: number;
  quantity?: string;
  date?: string;
  recipient?: string;
}

export interface IndonesiaMapProps {
  /** Real published Infak Jinan data */
  jinanData?: PublicInfakJinanRecord[];
  /** Callback when island is clicked to filter table below */
  onSelectIsland?: (islandId: IslandId | null, provinceName?: string | null) => void;
  /** Extra CSS classes */
  className?: string;
}

// Koordinat acuan per pulau untuk penempatan visual pin saat lat/lng kosong
const ISLAND_COORDINATES: Record<string, { x: number; y: number }> = {
  jawa: { x: 330, y: 325 },
  sumatra: { x: 160, y: 177 },
  kalimantan: { x: 406, y: 159 },
  sulawesi: { x: 581, y: 222 },
  "nusa-tenggara": { x: 558, y: 362 },
  "bali-nusa": { x: 558, y: 362 },
  maluku: { x: 700, y: 211 },
  "maluku-papua": { x: 800, y: 240 },
  papua: { x: 858, y: 266 },
};

// Linear projection dari Lng/Lat ke SVG viewBox (0 0 1000 450)
export function projectCoordinates(lng: number, lat: number) {
  const minLng = 95.0;
  const maxLng = 141.0;
  const minLat = -11.0;
  const maxLat = 6.0;

  const x = ((lng - minLng) / (maxLng - minLng)) * (980 - 20) + 20;
  const y = ((maxLat - lat) / (maxLat - minLat)) * (398 - 55) + 55;
  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
}

export default function IndonesiaMap({
  jinanData = [],
  onSelectIsland,
  className = "",
}: IndonesiaMapProps) {
  const [selectedIsland, setSelectedIsland] = useState<IslandId | null>(null);
  const [hoveredIsland, setHoveredIsland] = useState<IslandInfo | null>(null);
  const [hoveredPin, setHoveredPin] = useState<MapPinPoint | null>(null);
  const [selectedPin, setSelectedPin] = useState<MapPinPoint | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Hitung statistik aktual dari jinanData per pulau (murni dari data database)
  const islandStats = useMemo(() => {
    const stats: Record<string, { mushafCount: number; santriCount: number; pesantrenCount: number }> = {
      sumatra: { mushafCount: 0, santriCount: 0, pesantrenCount: 0 },
      jawa: { mushafCount: 0, santriCount: 0, pesantrenCount: 0 },
      kalimantan: { mushafCount: 0, santriCount: 0, pesantrenCount: 0 },
      sulawesi: { mushafCount: 0, santriCount: 0, pesantrenCount: 0 },
      "nusa-tenggara": { mushafCount: 0, santriCount: 0, pesantrenCount: 0 },
      maluku: { mushafCount: 0, santriCount: 0, pesantrenCount: 0 },
      papua: { mushafCount: 0, santriCount: 0, pesantrenCount: 0 },
    };

    const uniquePesantrenPerIsland: Record<string, Set<string>> = {
      sumatra: new Set(),
      jawa: new Set(),
      kalimantan: new Set(),
      sulawesi: new Set(),
      "nusa-tenggara": new Set(),
      maluku: new Set(),
      papua: new Set(),
    };

    jinanData.forEach((item) => {
      let island = getIslandByProvince(item.pesantren_province || "");
      if (!island) {
        // Fallback cek string alamat
        const addr = (item.address || "").toLowerCase();
        if (addr.includes("jawa") || addr.includes("cirebon") || addr.includes("bogor") || addr.includes("banten") || addr.includes("jakarta")) {
          island = "jawa";
        } else if (addr.includes("sumatera") || addr.includes("aceh") || addr.includes("medan") || addr.includes("padang")) {
          island = "sumatra";
        }
      }

      // Normalisasi island key
      let key: IslandId = "jawa";
      if (island === "bali-nusa") key = "nusa-tenggara";
      else if (island === "maluku-papua") key = "papua";
      else if (island && island in stats) key = island as IslandId;

      if (stats[key]) {
        stats[key].mushafCount += 1; // 1 donasi mewakili nomor urut mushaf jinan
        stats[key].santriCount += item.santri_count || 0;
        if (item.pesantren_name) {
          uniquePesantrenPerIsland[key].add(item.pesantren_name.toLowerCase().trim());
        }
      }
    });

    Object.keys(stats).forEach((k) => {
      stats[k].pesantrenCount = uniquePesantrenPerIsland[k]?.size || 0;
    });

    return stats;
  }, [jinanData]);

  // Bangun pin murni dari record infak jinan aktual
  const activePins: MapPinPoint[] = useMemo(() => {
    return jinanData.map((d, idx) => {
      let island = getIslandByProvince(d.pesantren_province || "");
      if (!island) {
        const addr = (d.address || "").toLowerCase();
        island = addr.includes("sumatra") ? "sumatra" : "jawa";
      }

      let islandKey: IslandId = "jawa";
      if (island === "bali-nusa") islandKey = "nusa-tenggara";
      else if (island === "maluku-papua") islandKey = "papua";
      else if (island) islandKey = island as IslandId;

      // Beri sedikit jitter agar pin di pulau yang sama tidak bertumpuk persis
      const baseCoords = ISLAND_COORDINATES[islandKey] || { x: 330, y: 325 };
      const jitterX = ((idx * 27) % 50) - 25;
      const jitterY = ((idx * 19) % 30) - 15;

      return {
        id: String(d.id),
        islandId: islandKey,
        label: d.pesantren_name || "Pesantren Penerima",
        detail: `${d.pesantren_city || ""}, ${d.pesantren_province || d.address || ""}`.trim().replace(/^,\s*/, ""),
        x: baseCoords.x + jitterX,
        y: baseCoords.y + jitterY,
        quantity: `Mushaf ke-${d.mushaf_no}`,
        date: formatTanggal(d.distributed_at),
        recipient: d.display_donor_name,
      };
    });
  }, [jinanData]);

  // Lacak posisi kursor mouse untuk tooltip
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleIslandClick = (id: IslandId) => {
    const nextIsland = selectedIsland === id ? null : id;
    setSelectedIsland(nextIsland);
    if (onSelectIsland) {
      const islandMeta = INDONESIA_ISLANDS[id];
      onSelectIsland(nextIsland, nextIsland ? islandMeta?.name : null);
    }
  };

  const activeIslandData = selectedIsland ? INDONESIA_ISLANDS[selectedIsland] : null;
  const activeIslandStats = selectedIsland ? islandStats[selectedIsland] : null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full rounded-3xl bg-[var(--green-950)] border border-[var(--gold-500)]/30 p-4 sm:p-6 select-none overflow-hidden ${className}`}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(20,89,50,0.22),transparent_75%)] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 pb-3 border-b border-[#8ca362]/20">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#f7f5ee]">
            Sebaran Infak Al-Qur&apos;an Jinan
          </h3>
        </div>

        {/* Legend Indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#d2dac3]">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd700] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffd700]" />
            </span>
            <span>Titik Penyaluran ({jinanData.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-xs bg-[#145932] border border-[#ffd700]" />
            <span>Wilayah Berdata</span>
          </div>
        </div>
      </div>

      {/* Main Responsive SVG (viewBox 0 0 1000 450) */}
      <div className="relative w-full aspect-1000/450 min-h-[300px] flex items-center justify-center">
        <svg
          viewBox="0 0 1000 450"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Island Paths */}
          <g className="transition-all duration-300">
            {Object.values(INDONESIA_ISLANDS).map((island) => {
              const isSelected = selectedIsland === island.id;
              const hasData = (islandStats[island.id]?.mushafCount || 0) > 0;

              return (
                <path
                  key={island.id}
                  d={island.pathD}
                  className={`cursor-pointer transition-all duration-200 outline-none ${
                    isSelected
                      ? "fill-[#1b6b3e] stroke-[#ffd700] stroke-[2.2] filter-[url(#goldGlow)]"
                      : hasData
                      ? "fill-[#145932] stroke-[#ffd700]/70 stroke-[1.2] hover:fill-[#1b6b3e] hover:stroke-[#ffd700]"
                      : "fill-[#0c3b20] stroke-[#8ca362]/60 stroke-[0.9] hover:fill-[#124b2b]"
                  }`}
                  onClick={() => handleIslandClick(island.id)}
                  onMouseEnter={() => setHoveredIsland(island)}
                  onMouseLeave={() => setHoveredIsland(null)}
                />
              );
            })}
          </g>

          {/* Distribution Pins (Dari database infak jinan) */}
          {activePins.map((pin) => {
            const isSelected = selectedPin?.id === pin.id;
            const isHovered = hoveredPin?.id === pin.id;
            const isMatchingIsland = selectedIsland === pin.islandId;

            return (
              <g
                key={pin.id}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedPin(pin);
                  setSelectedIsland(pin.islandId);
                }}
                onMouseEnter={() => setHoveredPin(pin)}
                onMouseLeave={() => setHoveredPin(null)}
              >
                {/* Hit target transparan */}
                <circle cx={pin.x} cy={pin.y} r="14" fill="transparent" />

                {/* Radar pulse untuk pin terpilih */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r="9"
                    fill="none"
                    stroke="#ffd700"
                    strokeWidth="1.5"
                    className="animate-ping opacity-75 pointer-events-none"
                  />
                )}

                {/* Marker titik */}
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={isSelected ? 6 : isMatchingIsland || isHovered ? 5 : 3.5}
                  fill={isSelected ? "#ffd700" : isHovered ? "#fff" : "#ffd700"}
                  stroke={isSelected ? "#0c3b20" : "#145932"}
                  strokeWidth="1.5"
                  className="transition-all duration-200 pointer-events-none"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Floating Tooltip */}
        {(hoveredPin || hoveredIsland) && (
          <div
            className="pointer-events-none absolute z-30 transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 rounded-xl bg-[#081e10]/95 border border-[#ffd700]/70 text-[#f7f5ee] shadow-xl backdrop-blur-md transition-transform duration-75 text-left"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
            }}
          >
            {hoveredPin ? (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#ffd700]">
                  <MapPin className="w-3.5 h-3.5 text-[#ffd700]" />
                  <span>{hoveredPin.label}</span>
                </div>
                <div className="text-[11px] text-[#d2dac3] mt-0.5 max-w-[220px] truncate">
                  {hoveredPin.detail}
                </div>
                {hoveredPin.quantity && (
                  <div className="text-[10px] font-semibold text-[#8ca362] mt-0.5">
                    {hoveredPin.quantity} / Donatur: {hoveredPin.recipient}
                  </div>
                )}
              </div>
            ) : hoveredIsland ? (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#ffd700]">
                  <Layers className="w-3.5 h-3.5 text-[#8ca362]" />
                  <span>{hoveredIsland.name}</span>
                </div>
                {islandStats[hoveredIsland.id]?.mushafCount > 0 ? (
                  <div className="flex items-center gap-3 mt-1.5 pt-1 border-t border-[#8ca362]/30 text-[10px] text-[#f7f5ee]">
                    <span>
                      Mushaf: <strong className="text-[#ffd700]">{islandStats[hoveredIsland.id].mushafCount}</strong>
                    </span>
                    <span>
                      Santri: <strong className="text-[#8ca362]">{islandStats[hoveredIsland.id].santriCount}</strong>
                    </span>
                    <span>
                      Pesantren: <strong className="text-[#8ca362]">{islandStats[hoveredIsland.id].pesantrenCount}</strong>
                    </span>
                  </div>
                ) : (
                  <div className="text-[10px] text-[#8ca362] mt-1 italic">
                    Belum ada penyaluran terdata di wilayah ini
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Selected Island or Pin Info Card */}
        {(activeIslandData || selectedPin) && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-5 sm:bottom-5 sm:max-w-md bg-[#081e10]/95 border-2 border-[#ffd700]/70 p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-md text-[#f7f5ee] z-20 transition-all animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#ffd700] bg-[#145932] px-2.5 py-0.5 rounded-full border border-[#ffd700]/40">
                {selectedPin ? (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-[#ffd700]" />
                    Penerima Manfaat
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5 text-[#ffd700]" />
                    Wilayah Terpilih
                  </>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedIsland(null);
                  setSelectedPin(null);
                  if (onSelectIsland) onSelectIsland(null);
                }}
                className="p-1 text-[#8ca362] hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Tutup Info"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedPin ? (
              <div>
                <h4 className="font-serif font-bold text-lg text-[#f7f5ee]">
                  {selectedPin.label}
                </h4>
                <p className="text-xs text-[#d2dac3] mt-0.5">
                  {selectedPin.detail}
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#8ca362]/20 grid grid-cols-2 gap-2 text-xs text-[#e5ebd9]">
                  <div>
                    <span className="text-[10px] text-[#8ca362] block">Amanah Mushaf</span>
                    <strong className="text-[#ffd700]">{selectedPin.quantity}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8ca362] block">Penyaluran</span>
                    <span>{selectedPin.date}</span>
                  </div>
                </div>
              </div>
            ) : activeIslandData && activeIslandStats ? (
              <div>
                <h4 className="font-serif font-bold text-lg text-[#f7f5ee]">
                  {activeIslandData.name}
                </h4>
                {activeIslandStats.mushafCount > 0 ? (
                  <div className="mt-3 pt-2.5 border-t border-[#8ca362]/20 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#8ca362] block uppercase tracking-wider">Mushaf</span>
                      <span className="font-bold text-base text-[#ffd700]">
                        {activeIslandStats.mushafCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8ca362] block uppercase tracking-wider">Santri</span>
                      <span className="font-bold text-base text-[#8ca362]">
                        {activeIslandStats.santriCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8ca362] block uppercase tracking-wider">Pesantren</span>
                      <span className="font-bold text-base text-[#8ca362]">
                        {activeIslandStats.pesantrenCount}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#d2dac3] mt-2 italic">
                    Belum ada penyaluran infak Al-Qur&apos;an Jinan yang berstatus publikasi di wilayah ini.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Screen Reader Table Alternative (Aksesibilitas Akses Tabel Peta) */}
      <div className="sr-only">
        <h4>Ringkasan Aksesibilitas Sebaran Penyaluran Al-Qur&apos;an per Wilayah Pulau</h4>
        <table aria-label="Ringkasan sebaran infak Al-Qur'an Jinan per pulau">
          <thead>
            <tr>
              <th>Wilayah Pulau</th>
              <th>Mushaf Tersalurkan</th>
              <th>Santri Penerima</th>
              <th>Pesantren Binaan</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(islandStats).map(([islandKey, st]) => (
              <tr key={islandKey}>
                <td>{INDONESIA_ISLANDS[islandKey as IslandId]?.name || islandKey}</td>
                <td>{st.mushafCount}</td>
                <td>{st.santriCount}</td>
                <td>{st.pesantrenCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Helper Note */}
      <div className="mt-2 pt-2 border-t border-[#8ca362]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8ca362] gap-1">
        <span>Klik pulau pada peta untuk menyaring tabel penyaluran di bawah.</span>
      </div>
    </div>
  );
}
