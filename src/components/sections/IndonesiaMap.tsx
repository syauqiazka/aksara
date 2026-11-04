"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { MapPin, Sparkles, X, Layers, Landmark, Info, CheckCircle2 } from "lucide-react";
import { INDONESIA_ISLANDS, IslandId, IslandInfo } from "./indonesiaMapData";
import { InfakDistribution, GeberMasjidDistribution } from "@/lib/db/types";

export interface MapPinPoint {
  id: string;
  islandId: IslandId;
  label: string;
  detail: string;
  x: number;
  y: number;
  category?: "infak" | "geber" | "hub";
  quantity?: string;
  date?: string;
  recipient?: string;
}

export interface IndonesiaMapProps {
  /** Optional distribution data from DB */
  infakData?: InfakDistribution[];
  /** Optional geber masjid data from DB */
  geberData?: GeberMasjidDistribution[];
  /** Tab mode */
  activeTab?: "infak" | "geber";
  /** Callback when recipient/point is clicked */
  onSelectRecipient?: (name: string) => void;
  /** Extra CSS classes */
  className?: string;
}

// Preset distribution points across the archipelago
const DEFAULT_PINS: MapPinPoint[] = [
  {
    id: "hub-jakarta",
    islandId: "jawa",
    label: "DKI Jakarta (Pusat Yayasan)",
    detail: "Markaz Operasional & Sentra Distribusi Al-Qur'an Nasional",
    x: 267,
    y: 301,
    category: "hub",
    quantity: "Sentra Distribusi",
    date: "Pusat Koordinasi",
    recipient: "Yayasan Sahabat Aksara Indonesia",
  },
  {
    id: "dist-aceh",
    islandId: "sumatra",
    label: "Banda Aceh",
    detail: "Dayah & Pesantren Tahfidz Pesisir",
    x: 35,
    y: 65,
    category: "infak",
    quantity: "120 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Dayah Tahfidzul Quran",
  },
  {
    id: "dist-medan",
    islandId: "sumatra",
    label: "Medan & Deli",
    detail: "Rumah Quran Mualaf Mandailing",
    x: 82,
    y: 118,
    category: "infak",
    quantity: "250 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Komunitas Sahabat Quran",
  },
  {
    id: "dist-padang",
    islandId: "sumatra",
    label: "Padang & Mentawai",
    detail: "Halaqah Santri Pesisir & Kepulauan",
    x: 118,
    y: 195,
    category: "infak",
    quantity: "180 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "TPQ Kepulauan Mandiri",
  },
  {
    id: "dist-plm",
    islandId: "sumatra",
    label: "Palembang",
    detail: "Komunitas Muslim Sungai Musi",
    x: 215,
    y: 242,
    category: "geber",
    quantity: "150 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Masjid Baitul Musi",
  },
  {
    id: "dist-bdg",
    islandId: "jawa",
    label: "Bandung Raya & Priangan",
    detail: "Pondok Pesantren Lereng Gunung",
    x: 275,
    y: 316,
    category: "infak",
    quantity: "320 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Ponpes Nurul Quran",
  },
  {
    id: "dist-smg",
    islandId: "jawa",
    label: "Semarang & Kudus",
    detail: "Sentra Tahfidz Santri Pantura",
    x: 340,
    y: 312,
    category: "infak",
    quantity: "280 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Madrasah Huffadz",
  },
  {
    id: "dist-sby",
    islandId: "jawa",
    label: "Surabaya & Madura",
    detail: "TPQ Pesisir Selat Madura",
    x: 398,
    y: 318,
    category: "geber",
    quantity: "310 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Bina Santri Madura",
  },
  {
    id: "dist-ptk",
    islandId: "kalimantan",
    label: "Pontianak",
    detail: "Komunitas Mualaf Sungai Kapuas",
    x: 330,
    y: 160,
    category: "infak",
    quantity: "160 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Halaqah Kapuas Raya",
  },
  {
    id: "dist-bpn",
    islandId: "kalimantan",
    label: "Balikpapan & IKN",
    detail: "Masjid Perintis Kawasan Nusantara",
    x: 452,
    y: 185,
    category: "geber",
    quantity: "220 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Masjid Al-Muhajirin IKN",
  },
  {
    id: "dist-mks",
    islandId: "sulawesi",
    label: "Makassar & Gowa",
    detail: "Pondok Tahfidz Sulawesi Selatan",
    x: 545,
    y: 288,
    category: "infak",
    quantity: "300 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Yayasan Huffadh Gowa",
  },
  {
    id: "dist-mnd",
    islandId: "sulawesi",
    label: "Manado & Bitung",
    detail: "Komunitas Muslim Pesisir Selat Lembeh",
    x: 638,
    y: 138,
    category: "infak",
    quantity: "140 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Masjid Pesisir Bitung",
  },
  {
    id: "dist-dps",
    islandId: "nusa-tenggara",
    label: "Denpasar & Karangasem",
    detail: "Kampung Muslim Pesisir Bali",
    x: 452,
    y: 335,
    category: "infak",
    quantity: "130 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Bina Insan Karangasem",
  },
  {
    id: "dist-mataram",
    islandId: "nusa-tenggara",
    label: "Lombok & Sumbawa",
    detail: "Pulau Seribu Masjid & TPQ Rinjani",
    x: 485,
    y: 338,
    category: "geber",
    quantity: "340 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Ponpes Darul Quran Lombok",
  },
  {
    id: "dist-kupang",
    islandId: "nusa-tenggara",
    label: "Kupang & Rote",
    detail: "Komunitas Muslim Pulau Terluar NTT",
    x: 648,
    y: 378,
    category: "infak",
    quantity: "150 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Rumah Quran Flobamora",
  },
  {
    id: "dist-ambon",
    islandId: "maluku",
    label: "Ambon & Seram",
    detail: "Majelis Taklim Kepulauan Rempah",
    x: 686,
    y: 248,
    category: "infak",
    quantity: "190 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Majelis Rempah Al-Quran",
  },
  {
    id: "dist-sorong",
    islandId: "papua",
    label: "Sorong & Raja Ampat",
    detail: "Santri Mualaf Pesisir Kepala Burung",
    x: 758,
    y: 205,
    category: "infak",
    quantity: "180 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Dai Pedalaman Papua",
  },
  {
    id: "dist-jayapura",
    islandId: "papua",
    label: "Jayapura & Keerom",
    detail: "Santri Perbatasan Tapal Batas RI-PNG",
    x: 960,
    y: 218,
    category: "infak",
    quantity: "210 Mushaf",
    date: "Penyaluran Berjalan",
    recipient: "Pesantren Perbatasan Keerom",
  },
];

// Linear projection from Longitude/Latitude to SVG viewBox (0 0 1000 450)
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
  infakData = [],
  geberData = [],
  activeTab = "infak",
  onSelectRecipient,
  className = "",
}: IndonesiaMapProps) {
  const [selectedIsland, setSelectedIsland] = useState<IslandId | null>(null);
  const [hoveredIsland, setHoveredIsland] = useState<IslandInfo | null>(null);
  const [hoveredPin, setHoveredPin] = useState<MapPinPoint | null>(null);
  const [selectedPin, setSelectedPin] = useState<MapPinPoint | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with live database rows if provided, or default to preset points
  const activePins: MapPinPoint[] = useMemo(() => {
    if (activeTab === "infak" && infakData && infakData.length > 0) {
      return [
        DEFAULT_PINS[0], // Keep Jakarta hub
        ...infakData.slice(0, 30).map((d) => {
          const { x, y } = projectCoordinates(d.lng || 106.85, d.lat || -6.69);
          return {
            id: String(d.id),
            islandId: (d.province && d.province.toLowerCase().includes("jawa") ? "jawa" : "sumatra") as IslandId,
            label: d.recipient_name?.replace(/\s*\[CONTOH[^\]]*\]/gi, "") || "Penerima Mushaf",
            detail: `${d.city || ""}, ${d.province || ""}`,
            x,
            y,
            category: "infak" as const,
            quantity: `${d.quantity || 1} Mushaf (No. ${d.mushaf_no || "-"})`,
            date: d.distributed_at,
            recipient: d.donor_name || "Hamba Allah",
          };
        }),
      ];
    }
    if (activeTab === "geber" && geberData && geberData.length > 0) {
      return [
        DEFAULT_PINS[0], // Keep Jakarta hub
        ...geberData.slice(0, 30).map((g) => {
          const { x, y } = projectCoordinates(g.lng || 106.99, g.lat || -6.24);
          return {
            id: String(g.id),
            islandId: "jawa" as IslandId,
            label: g.mosque_name?.replace(/\s*\[CONTOH[^\]]*\]/gi, "") || "Masjid",
            detail: `${g.address || ""}, ${g.city || ""}`,
            x,
            y,
            category: "geber" as const,
            quantity: `${g.participants || 0} Relawan`,
            date: g.activity_date,
            recipient: g.activity_notes || "Aksi Pembersihan Masjid",
          };
        }),
      ];
    }
    return DEFAULT_PINS;
  }, [infakData, geberData, activeTab]);

  // Track cursor position for smooth tooltip positioning
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleIslandClick = (id: IslandId) => {
    setSelectedIsland((prev) => (prev === id ? null : id));
  };

  const activeIslandData = selectedIsland ? INDONESIA_ISLANDS[selectedIsland] : null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full overflow-hidden rounded-3xl bg-[#06150b] border border-[#8ca362]/30 shadow-2xl p-4 sm:p-7 select-none ${className}`}
    >
      {/* Background Ambience & Atmospheric Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(20,89,50,0.22),transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(140,163,98,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(140,163,98,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 pb-3 border-b border-[#8ca362]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8ca362]">
              Peta Sebaran Nasional
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#f7f5ee] mt-0.5">
            {activeTab === "infak"
              ? "Sebaran Mushaf Al-Qur'an Nusantara"
              : "Titik Aksi Geber Masjid Nusantara"}
          </h3>
        </div>

        {/* Legend Indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#d2dac3]">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd700] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffd700]" />
            </span>
            <span>Titik Distribusi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00b4d8] ring-2 ring-[#00b4d8]/40" />
            <span>Pusat (Jakarta)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-sm bg-[#145932] border border-[#ffd700]" />
            <span>Pulau Aktif</span>
          </div>
        </div>
      </div>

      {/* Main Responsive SVG (viewBox 0 0 1000 450) */}
      <div className="relative w-full aspect-[1000/450] min-h-[300px] flex items-center justify-center">
        <svg
          viewBox="0 0 1000 450"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Subtle glow filter */}
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Soft drop shadow for island landmasses */}
            <filter id="islandShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Latitude & Longitude Coordinate Lines */}
          <g stroke="rgba(140, 163, 98, 0.12)" strokeWidth="0.8" strokeDasharray="3 5">
            <line x1="30" y1="100" x2="970" y2="100" />
            <line x1="30" y1="200" x2="970" y2="200" />
            <line x1="30" y1="300" x2="970" y2="300" />
            <line x1="30" y1="400" x2="970" y2="400" />
            <line x1="200" y1="30" x2="200" y2="430" />
            <line x1="450" y1="30" x2="450" y2="430" />
            <line x1="700" y1="30" x2="700" y2="430" />
            <line x1="900" y1="30" x2="900" y2="430" />
          </g>

          {/* 7 Geographically Accurate Major Island Paths */}
          <g filter="url(#islandShadow)">
            {(Object.keys(INDONESIA_ISLANDS) as IslandId[]).map((key) => {
              const island = INDONESIA_ISLANDS[key];
              const isSelected = selectedIsland === key;
              const isHovered = hoveredIsland?.id === key;

              return (
                <path
                  key={island.id}
                  id={island.id}
                  d={island.pathD}
                  className={`cursor-pointer transition-all duration-300 ease-out outline-none ${
                    isSelected
                      ? "fill-[#1b6b3e] stroke-[#ffd700] stroke-[1.8] drop-shadow-[0_0_12px_rgba(255,215,0,0.5)]"
                      : isHovered
                      ? "fill-[#145932] stroke-[#ffd700] stroke-[1.4] drop-shadow-[0_0_7px_rgba(255,215,0,0.35)]"
                      : "fill-[#0c3b20] stroke-[#8ca362] stroke-[1] hover:fill-[#145932] hover:stroke-[#ffd700] hover:stroke-[1.3]"
                  }`}
                  onClick={() => handleIslandClick(island.id)}
                  onMouseEnter={() => setHoveredIsland(island)}
                  onMouseLeave={() => setHoveredIsland(null)}
                />
              );
            })}
          </g>

          {/* Arcing Connection Rays from Jakarta Hub */}
          <g opacity="0.35">
            {activePins
              .filter((p) => p.category !== "hub")
              .slice(0, 14)
              .map((p, idx) => {
                const jktX = 267;
                const jktY = 301;
                const midX = (jktX + p.x) / 2;
                const midY = (jktY + p.y) / 2 - Math.min(42, Math.abs(p.x - jktX) * 0.12);
                return (
                  <path
                    key={`arc-${p.id}-${idx}`}
                    d={`M ${jktX} ${jktY} Q ${midX} ${midY} ${p.x} ${p.y}`}
                    fill="none"
                    stroke="#8ca362"
                    strokeWidth="0.85"
                    strokeDasharray="3 4"
                  />
                );
              })}
          </g>

          {/* Jakarta Central Markaz Hub (x=267, y=301) */}
          <g
            className="cursor-pointer"
            onClick={() => {
              const hubPin = activePins.find((p) => p.category === "hub") || DEFAULT_PINS[0];
              setSelectedPin(hubPin);
              if (onSelectRecipient) onSelectRecipient(hubPin.label);
            }}
            onMouseEnter={() => {
              const hubPin = activePins.find((p) => p.category === "hub") || DEFAULT_PINS[0];
              setHoveredPin(hubPin);
            }}
            onMouseLeave={() => setHoveredPin(null)}
          >
            {/* Invisible stable hit target */}
            <circle cx="267" cy="301" r="16" fill="transparent" />

            {/* Radar wave rings */}
            <circle
              cx="267"
              cy="301"
              r="13"
              fill="none"
              stroke="#00b4d8"
              strokeWidth="1"
              opacity="0.6"
              className="pointer-events-none"
            />
            <circle
              cx="267"
              cy="301"
              r="7"
              fill="rgba(0, 180, 216, 0.25)"
              stroke="#00b4d8"
              strokeWidth="1.5"
              className="pointer-events-none"
            />
            <circle cx="267" cy="301" r="3.5" fill="#ffd700" className="pointer-events-none" />
          </g>

          {/* Distribution Pins (Stable, Non-jittery with transparent hit-area) */}
          {activePins
            .filter((p) => p.category !== "hub")
            .map((pin) => {
              const isSelected = selectedPin?.id === pin.id;
              const isHovered = hoveredPin?.id === pin.id;
              const isMatchingIsland = selectedIsland === pin.islandId;

              return (
                <g
                  key={pin.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedPin(pin);
                    if (onSelectRecipient) onSelectRecipient(pin.label);
                  }}
                  onMouseEnter={() => setHoveredPin(pin)}
                  onMouseLeave={() => setHoveredPin(null)}
                >
                  {/* Invisible hit-area circle so cursor stays locked without jitter */}
                  <circle cx={pin.x} cy={pin.y} r="14" fill="transparent" />

                  {/* Outer glow ring */}
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={isSelected ? 11 : isHovered ? 9.5 : 6.5}
                    fill={isSelected || isHovered ? "rgba(255, 215, 0, 0.3)" : "rgba(255, 215, 0, 0.15)"}
                    stroke={isSelected || isHovered ? "#ffd700" : isMatchingIsland ? "#ffd700" : "#8ca362"}
                    strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 1}
                    className="pointer-events-none transition-all duration-200"
                  />

                  {/* Core dot */}
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={isSelected ? 5 : isHovered ? 4.5 : 3}
                    fill={isSelected || isHovered ? "#ffffff" : "#ffd700"}
                    stroke="#06150b"
                    strokeWidth="1.2"
                    className="pointer-events-none transition-all duration-200"
                  />
                </g>
              );
            })}
        </svg>

        {/* Dynamic Floating Tooltip near cursor */}
        {(hoveredIsland || hoveredPin) && (
          <div
            className="pointer-events-none absolute z-30 px-3.5 py-2 rounded-xl bg-[#092212]/95 border border-[#ffd700]/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-75 text-left"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              transform: "translate(-50%, calc(-100% - 14px))",
            }}
          >
            {hoveredPin ? (
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#ffd700]">
                  <MapPin className="w-3 h-3 text-[#ffd700]" />
                  <span>{hoveredPin.label}</span>
                </div>
                <div className="text-[10px] text-[#e0e7d5] mt-0.5">
                  {hoveredPin.detail}
                </div>
                {hoveredPin.quantity && (
                  <div className="text-[10px] font-semibold text-[#8ca362] mt-0.5">
                    {hoveredPin.quantity}
                  </div>
                )}
              </div>
            ) : hoveredIsland ? (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#ffd700]">
                  <Layers className="w-3.5 h-3.5 text-[#8ca362]" />
                  <span>{hoveredIsland.name}</span>
                </div>
                <div className="text-[10px] text-[#c7d3b6] mt-0.5 max-w-[200px]">
                  {hoveredIsland.category}
                </div>
                <div className="flex items-center gap-3 mt-1.5 pt-1 border-t border-[#8ca362]/30 text-[10px] text-[#f7f5ee]">
                  <span>
                    Mushaf: <strong className="text-[#ffd700]">{hoveredIsland.mushafCount.toLocaleString()}</strong>
                  </span>
                  <span>
                    Masjid: <strong className="text-[#8ca362]">{hoveredIsland.mosqueCount}</strong>
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Selected Island or Pin Information Card */}
        {(activeIslandData || selectedPin) && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-5 sm:bottom-5 sm:max-w-md bg-[#081e10]/95 border-2 border-[#ffd700]/70 p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-md text-[#f7f5ee] z-20 transition-all animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#ffd700] bg-[#145932] px-2.5 py-0.5 rounded-full border border-[#ffd700]/40">
                {selectedPin ? (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-[#ffd700]" />
                    Titik Penyaluran
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
                    Pulau Terpilih
                  </>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedIsland(null);
                  setSelectedPin(null);
                }}
                className="p-1 text-[#8ca362] hover:text-white rounded-lg transition-colors"
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
                    <span className="text-[10px] text-[#8ca362] block">Volume / Penyaluran</span>
                    <strong className="text-[#ffd700]">{selectedPin.quantity || "Al-Qur'an Standar"}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8ca362] block">Penerima / Mitra</span>
                    <span className="truncate block">{selectedPin.recipient || "Pesantren & TPQ"}</span>
                  </div>
                </div>
              </div>
            ) : activeIslandData ? (
              <div>
                <h4 className="font-serif font-bold text-lg text-[#f7f5ee]">
                  {activeIslandData.name}
                </h4>
                <p className="text-xs text-[#d2dac3] mt-1 leading-relaxed">
                  {activeIslandData.description}
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#8ca362]/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#8ca362] block uppercase tracking-wider">Total Mushaf</span>
                    <span className="font-bold text-base text-[#ffd700]">
                      {activeIslandData.mushafCount.toLocaleString()} Eksemplar
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#8ca362] block uppercase tracking-wider">Titik Aksi</span>
                    <span className="font-bold text-base text-[#8ca362]">
                      {activeIslandData.mosqueCount} Titik
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Footer Helper Note */}
      <div className="mt-2 pt-2 border-t border-[#8ca362]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8ca362] gap-1">
        <span>Arahkan kursor ke pulau untuk melihat ringkasan, atau klik pulau / titik untuk rincian data.</span>
        <span className="text-[#d2dac3]/60">Skala Geografis Akurat &bull; viewBox 1000 &times; 450</span>
      </div>
    </div>
  );
}
