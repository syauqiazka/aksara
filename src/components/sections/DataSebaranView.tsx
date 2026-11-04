"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  Building2,
  Calendar,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  SearchX,
  ImageIcon,
} from "lucide-react";
import {
  PublicInfakJinanRecord,
  PublicBussDistribution,
  YatimActivity,
  GeberMasjidDistribution,
  AggregatedStats,
} from "@/lib/db/types";
import IndonesiaMap from "@/components/sections/IndonesiaMap";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";

interface DataSebaranViewProps {
  initialInfakJinan: PublicInfakJinanRecord[];
  initialBuss: PublicBussDistribution[];
  initialYatim: YatimActivity[];
  initialGeber: GeberMasjidDistribution[];
  stats: AggregatedStats;
}

type TabType = "jinan" | "buss" | "yatim" | "geber";

export default function DataSebaranView({
  initialInfakJinan,
  initialBuss,
  initialYatim,
  initialGeber,
}: DataSebaranViewProps) {
  // Flag untuk Geber Masjid (disembunyikan dari publik kecuali diaktifkan via env)
  const showGeberTab = process.env.NEXT_PUBLIC_SHOW_GEBER_SEBARAN === "true";

  const [activeTab, setActiveTab] = useState<TabType>("jinan");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal / Drawer state
  const [activeGalleryModal, setActiveGalleryModal] = useState<{
    title: string;
    subtitle?: string;
    photos: string[];
    description?: string;
  } | null>(null);

  // Filter lists
  const years = useMemo(() => {
    const list = new Set<string>();
    initialBuss.forEach((b) => list.add(b.year.toString()));
    initialYatim.forEach((y) => list.add(y.year.toString()));
    return Array.from(list).sort().reverse();
  }, [initialBuss, initialYatim]);

  const origins = useMemo(() => {
    const list = new Set<string>();
    initialInfakJinan.forEach((i) => i.donor_origin && list.add(i.donor_origin));
    initialBuss.forEach((b) => b.origin && list.add(b.origin));
    return Array.from(list).sort();
  }, [initialInfakJinan, initialBuss]);

  // Tab 1: Filtered Infak Jinan
  const filteredJinan = useMemo(() => {
    return initialInfakJinan.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        item.mushaf_no.toString().includes(q) ||
        item.display_donor_name.toLowerCase().includes(q) ||
        item.dedication_name.toLowerCase().includes(q) ||
        item.pesantren_name.toLowerCase().includes(q) ||
        item.donor_origin.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q);

      const matchesOrigin = selectedOrigin === "all" || item.donor_origin === selectedOrigin;

      return matchesSearch && matchesOrigin;
    });
  }, [initialInfakJinan, searchQuery, selectedOrigin]);

  // Tab 2: Filtered BUSS
  const filteredBuss = useMemo(() => {
    return initialBuss.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        item.santri_name.toLowerCase().includes(q) ||
        item.pesantren_name.toLowerCase().includes(q) ||
        item.display_donor_name.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q) ||
        item.current_surah.toLowerCase().includes(q);

      const matchesYear = selectedYear === "all" || item.year.toString() === selectedYear;
      const matchesOrigin = selectedOrigin === "all" || item.origin === selectedOrigin;

      return matchesSearch && matchesYear && matchesOrigin;
    });
  }, [initialBuss, searchQuery, selectedYear, selectedOrigin]);

  // Tab 3: Filtered Yatim
  const filteredYatim = useMemo(() => {
    return initialYatim.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        item.activity_name.toLowerCase().includes(q) ||
        item.organizer.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      const matchesYear = selectedYear === "all" || item.year.toString() === selectedYear;

      return matchesSearch && matchesYear;
    });
  }, [initialYatim, searchQuery, selectedYear]);

  // Tab 4 (Optional): Filtered Geber
  const filteredGeber = useMemo(() => {
    return initialGeber.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        q === "" ||
        item.mosque_name.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.province.toLowerCase().includes(q)
      );
    });
  }, [initialGeber, searchQuery]);

  // Pagination calculation
  const currentDataset = useMemo(() => {
    switch (activeTab) {
      case "jinan":
        return filteredJinan;
      case "buss":
        return filteredBuss;
      case "yatim":
        return filteredYatim;
      case "geber":
        return filteredGeber;
    }
  }, [activeTab, filteredJinan, filteredBuss, filteredYatim, filteredGeber]);

  const totalPages = Math.ceil(currentDataset.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return currentDataset.slice(start, start + pageSize);
  }, [currentDataset, currentPage, pageSize]);

  const handleTabSwitch = (tab: TabType) => {
    setActiveTab(tab);
    setSearchQuery("");
    setSelectedYear("all");
    setSelectedOrigin("all");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-12">
      {/* 1. Main Navigation Tabs (Infak Jinan | BUSS Al-Qur'an | Yatim Berdikari) */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {/* Tab A: Infak Jinan */}
        <button
          onClick={() => handleTabSwitch("jinan")}
          className={`px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-serif text-sm sm:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2.5 border ${
            activeTab === "jinan"
              ? "bg-[var(--green-950)] text-gold-gradient border-[var(--gold-400)] shadow-xl scale-105"
              : "bg-[var(--cream-100)] text-[var(--ink-600)] border-[var(--cream-200)] hover:bg-[var(--cream-200)]"
          }`}
        >
          <BookOpen className="w-5 h-5 text-[var(--gold-400)]" />
          <span>Infak Al-Qur&apos;an Jinan ({initialInfakJinan.length})</span>
        </button>

        {/* Tab B: BUSS Al-Qur'an */}
        <button
          onClick={() => handleTabSwitch("buss")}
          className={`px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-serif text-sm sm:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2.5 border ${
            activeTab === "buss"
              ? "bg-[var(--green-950)] text-gold-gradient border-[var(--gold-400)] shadow-xl scale-105"
              : "bg-[var(--cream-100)] text-[var(--ink-600)] border-[var(--cream-200)] hover:bg-[var(--cream-200)]"
          }`}
        >
          <GraduationCap className="w-5 h-5 text-[var(--gold-400)]" />
          <span>BUSS Al-Qur&apos;an ({initialBuss.length})</span>
        </button>

        {/* Tab C: Yatim Berdikari */}
        <button
          onClick={() => handleTabSwitch("yatim")}
          className={`px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-serif text-sm sm:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2.5 border ${
            activeTab === "yatim"
              ? "bg-[var(--green-950)] text-gold-gradient border-[var(--gold-400)] shadow-xl scale-105"
              : "bg-[var(--cream-100)] text-[var(--ink-600)] border-[var(--cream-200)] hover:bg-[var(--cream-200)]"
          }`}
        >
          <HeartHandshake className="w-5 h-5 text-[var(--gold-400)]" />
          <span>Yatim Berdikari ({initialYatim.length})</span>
        </button>

        {/* Optional Tab D: Geber Masjid (If Flag Enabled) */}
        {showGeberTab && (
          <button
            onClick={() => handleTabSwitch("geber")}
            className={`px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-serif text-sm sm:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2.5 border ${
              activeTab === "geber"
                ? "bg-[var(--green-950)] text-gold-gradient border-[var(--gold-400)] shadow-xl scale-105"
                : "bg-[var(--cream-100)] text-[var(--ink-600)] border-[var(--cream-200)] hover:bg-[var(--cream-200)]"
            }`}
          >
            <Building2 className="w-5 h-5 text-[var(--gold-400)]" />
            <span>Geber Masjid ({initialGeber.length})</span>
          </button>
        )}
      </div>

      {/* 2. Interactive National Map (Pratinjau Sebaran) */}
      <IndonesiaMap
        infakData={initialInfakJinan.map((j) => ({
          id: j.id,
          mushaf_no: j.mushaf_no,
          donor_name: j.display_donor_name,
          show_donor_name: true,
          recipient_name: j.pesantren_name,
          recipient_type: "pesantren" as const,
          province: j.donor_origin,
          city: j.donor_origin,
          district: "",
          lat: null,
          lng: null,
          distributed_at: j.distributed_at,
          quantity: 1,
          photo_url: j.photos[0]?.url || null,
          notes: null,
          status: "published" as const,
          created_at: j.distributed_at,
          updated_at: j.distributed_at,
        }))}
        geberData={initialGeber}
        activeTab="infak"
      />

      {/* 3. Search & Filter Bar */}
      <div className="p-6 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search box */}
          <div className="w-full md:flex-1">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              startIcon={<Search className="w-4 h-4" />}
              placeholder={
                activeTab === "jinan"
                  ? "Cari nomor mushaf, nama donatur, santri, atau pesantren..."
                  : activeTab === "buss"
                  ? "Cari nama santri, asal, pesantren, atau donatur..."
                  : "Cari nama kegiatan atau penyelenggara..."
              }
            />
          </div>

          {/* Year Filter (for BUSS & Yatim) */}
          {(activeTab === "buss" || activeTab === "yatim") && (
            <div className="w-full md:w-52">
              <Select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Semua Tahun</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    Tahun {y}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Origin / Wilayah Filter (for Jinan & BUSS) */}
          {(activeTab === "jinan" || activeTab === "buss") && origins.length > 0 && (
            <div className="w-full md:w-56">
              <Select
                value={selectedOrigin}
                onChange={(e) => {
                  setSelectedOrigin(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Semua Asal Wilayah</option>
                {origins.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* PageSize selector */}
          <div className="w-full md:w-40">
            <Select
              value={pageSize.toString()}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="10">10 / halaman</option>
              <option value="25">25 / halaman</option>
              <option value="50">50 / halaman</option>
            </Select>
          </div>
        </div>

        {/* Active Filter Info & Reset Button */}
        {(searchQuery || selectedYear !== "all" || selectedOrigin !== "all") && (
          <div className="flex items-center justify-between pt-2 border-t border-[var(--cream-200)] text-xs text-[var(--ink-600)]">
            <div>
              Menampilkan <strong>{currentDataset.length}</strong> hasil pencarian
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedYear("all");
                setSelectedOrigin("all");
                setCurrentPage(1);
              }}
              className="text-[var(--terracotta-500)] hover:underline font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Table Views */}
      <div className="space-y-6">
        {/* Empty State */}
        {paginatedData.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--cream-200)] text-[var(--ink-600)] flex items-center justify-center mx-auto">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[var(--ink-900)]">
              Belum ada data penyaluran pada filter ini
            </h3>
            <p className="text-sm text-[var(--ink-600)] leading-relaxed">
              Silakan sesuaikan kata kunci pencarian atau reset filter untuk menampilkan data sebaran lainnya.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedYear("all");
                setSelectedOrigin("all");
              }}
              className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors inline-block"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <>
            {/* ======================================================== */}
            {/* TAB A: INFAK AL-QUR'AN JINAN (1 baris = 1 donasi/mushaf) */}
            {/* ======================================================== */}
            {activeTab === "jinan" && (
              <>
                {/* Desktop View (Table) */}
                <div className="hidden lg:block overflow-x-auto rounded-3xl border border-[var(--cream-200)] shadow-sm bg-[var(--cream-50)]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[var(--green-950)] text-[var(--cream-50)] font-serif uppercase tracking-wider text-[11px]">
                        <th className="py-4 px-3 text-center sticky left-0 z-10 bg-[var(--green-950)]">No.</th>
                        <th className="py-4 px-4 sticky left-12 z-10 bg-[var(--green-950)]">Donatur</th>
                        <th className="py-4 px-3">Asal</th>
                        <th className="py-4 px-3 text-center">Urutan Mushaf</th>
                        <th className="py-4 px-4">Dedikasi untuk</th>
                        <th className="py-4 px-4">Pesantren Tujuan</th>
                        <th className="py-4 px-4">Alamat &amp; Peta</th>
                        <th className="py-4 px-4">Tanggal Distribusi</th>
                        <th className="py-4 px-4 text-center">Tersalurkan</th>
                        <th className="py-4 px-4 text-center">Dokumentasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--cream-200)] text-[var(--ink-900)]">
                      {(paginatedData as PublicInfakJinanRecord[]).map((item, idx) => {
                        const displayIndex = (currentPage - 1) * pageSize + idx + 1;
                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-[var(--cream-100)] transition-colors group"
                          >
                            <td className="py-4 px-3 text-center font-mono text-[var(--ink-600)] sticky left-0 bg-[var(--cream-50)] group-hover:bg-[var(--cream-100)]">
                              {displayIndex}
                            </td>
                            <td className="py-4 px-4 font-semibold text-[var(--green-950)] sticky left-12 bg-[var(--cream-50)] group-hover:bg-[var(--cream-100)]">
                              {item.display_donor_name}
                            </td>
                            <td className="py-4 px-3 text-[var(--ink-600)]">
                              {item.donor_origin}
                            </td>
                            <td className="py-4 px-3 text-center">
                              <span className="inline-block px-2.5 py-1 rounded-full bg-[var(--gold-500)] text-[var(--green-950)] font-bold font-mono shadow-xs">
                                Mushaf ke-{item.mushaf_no}
                              </span>
                            </td>
                            <td className="py-4 px-4 italic text-[var(--ink-800)]">
                              &ldquo;{item.dedication_name}&rdquo;
                            </td>
                            <td className="py-4 px-4 font-medium text-[var(--ink-900)]">
                              {item.pesantren_name}
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-[11px] text-[var(--ink-600)] line-clamp-2 max-w-xs">
                                {item.address}
                              </div>
                              {item.maps_url && (
                                <a
                                  href={item.maps_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-[var(--green-800)] hover:underline font-semibold mt-1"
                                >
                                  <MapPin className="w-3 h-3 text-[var(--gold-600)]" />
                                  <span>Buka peta</span>
                                </a>
                              )}
                            </td>
                            <td className="py-4 px-4 text-[var(--ink-600)] whitespace-nowrap">
                              {item.distributed_at}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {item.santri_count > 0 ? (
                                <Link
                                  href={`/data-sebaran/infak-jinan/${item.id}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--green-900)] text-[var(--cream-50)] text-xs font-semibold hover:bg-[var(--green-800)] shadow-xs transition-colors"
                                >
                                  <BookOpen className="w-3.5 h-3.5 text-[var(--gold-300)]" />
                                  <span>{item.santri_count} Santri</span>
                                </Link>
                              ) : (
                                <span className="text-xs text-[var(--ink-400)]">Belum ada data</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {item.photos && item.photos.length > 0 ? (
                                <button
                                  onClick={() =>
                                    setActiveGalleryModal({
                                      title: `Mushaf ke-${item.mushaf_no} - ${item.display_donor_name}`,
                                      subtitle: `${item.pesantren_name} (${item.distributed_at})`,
                                      photos: item.photos.map(p => p.url),
                                      description: item.photos[0]?.caption || `Dokumentasi serah terima Mushaf ke-${item.mushaf_no} di ${item.pesantren_name}`,
                                    })
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--gold-500)] text-[var(--green-950)] text-xs font-semibold bg-[var(--cream-100)] hover:bg-gold-gradient transition-all shadow-xs"
                                >
                                  <ImageIcon className="w-3.5 h-3.5 text-[var(--gold-700)]" />
                                  <span>Lihat</span>
                                </button>
                              ) : (
                                <span className="text-xs text-[var(--ink-400)]">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View (Stacked Cards) */}
                <div className="lg:hidden space-y-4">
                  {(paginatedData as PublicInfakJinanRecord[]).map((item, idx) => {
                    const displayIndex = (currentPage - 1) * pageSize + idx + 1;
                    return (
                      <div
                        key={item.id}
                        className="p-5 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] shadow-sm space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-[var(--cream-200)]">
                          <span className="text-xs font-mono text-[var(--ink-600)]">
                            No. {displayIndex}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[var(--gold-500)] text-[var(--green-950)] font-bold font-mono text-xs shadow-xs">
                            Mushaf ke-{item.mushaf_no}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          <span className="text-[10px] uppercase font-bold text-[var(--gold-700)] block">
                            Donatur &amp; Asal
                          </span>
                          <p className="font-serif text-base font-bold text-[var(--green-950)]">
                            {item.display_donor_name}
                          </p>
                          <p className="text-[11px] text-[var(--ink-600)]">
                            Wilayah: <strong>{item.donor_origin}</strong>
                          </p>
                        </div>

                        <div className="p-3 rounded-2xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-xs space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[var(--gold-700)] block">
                            Dedikasi
                          </span>
                          <p className="italic text-[var(--ink-800)]">
                            &ldquo;{item.dedication_name}&rdquo;
                          </p>
                          <p className="text-[11px] text-[var(--ink-600)] pt-1">
                            Pesantren Tujuan: <strong>{item.pesantren_name}</strong>
                          </p>
                          <p className="text-[10px] text-[var(--ink-500)] line-clamp-2">
                            {item.address}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[var(--ink-600)] pt-1 border-t border-[var(--cream-200)]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[var(--green-700)]" />
                            {item.distributed_at}
                          </span>
                          {item.maps_url && (
                            <a
                              href={item.maps_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--green-800)] hover:underline font-semibold flex items-center gap-1"
                            >
                              <MapPin className="w-3 h-3 text-[var(--gold-600)]" />
                              <span>Buka peta</span>
                            </a>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                          {item.santri_count > 0 ? (
                            <Link
                              href={`/data-sebaran/infak-jinan/${item.id}`}
                              className="w-full py-2.5 rounded-full bg-[var(--green-900)] text-[var(--cream-50)] text-xs font-semibold text-center hover:bg-[var(--green-800)] transition-colors shadow-xs flex items-center justify-center gap-1.5"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-[var(--gold-300)]" />
                              <span>Lihat {item.santri_count} Santri Penerima</span>
                            </Link>
                          ) : (
                            <span className="w-full py-2.5 text-center text-xs text-[var(--ink-400)] bg-[var(--cream-200)]/40 rounded-full">
                              Belum ada data santri
                            </span>
                          )}

                          {item.photos && item.photos.length > 0 && (
                            <button
                              onClick={() =>
                                setActiveGalleryModal({
                                  title: `Mushaf ke-${item.mushaf_no} - ${item.display_donor_name}`,
                                  subtitle: `${item.pesantren_name} (${item.distributed_at})`,
                                  photos: item.photos.map(p => p.url),
                                  description: item.photos[0]?.caption || `Dokumentasi serah terima Mushaf ke-${item.mushaf_no} di ${item.pesantren_name}`,
                                })
                              }
                              className="w-full py-2.5 rounded-full border border-[var(--green-800)] text-[var(--green-950)] text-xs font-semibold text-center hover:bg-[var(--cream-200)] transition-colors"
                            >
                              Lihat Foto
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {/* TAB B: BUSS AL-QUR'AN                                    */}
            {/* ======================================================== */}
            {activeTab === "buss" && (
              <>
                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto rounded-3xl border border-[var(--cream-200)] shadow-sm bg-[var(--cream-50)]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[var(--green-950)] text-[var(--cream-50)] font-serif uppercase tracking-wider text-[11px]">
                        <th className="py-4 px-3 text-center">Tahun</th>
                        <th className="py-4 px-3 text-center">No.</th>
                        <th className="py-4 px-4">Nama Santri</th>
                        <th className="py-4 px-3">Asal</th>
                        <th className="py-4 px-4">Pesantren</th>
                        <th className="py-4 px-4">Surat &amp; Ayat Terkini</th>
                        <th className="py-4 px-3 text-center">Juz</th>
                        <th className="py-4 px-4">Nama Donatur</th>
                        <th className="py-4 px-4 text-center">Dokumentasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--cream-200)] text-[var(--ink-900)]">
                      {(paginatedData as PublicBussDistribution[]).map((item, idx) => {
                        const displayIndex = (currentPage - 1) * pageSize + idx + 1;
                        return (
                          <tr key={item.id} className="hover:bg-[var(--cream-100)] transition-colors">
                            <td className="py-4 px-3 text-center font-bold text-[var(--gold-700)]">
                              {item.year}
                            </td>
                            <td className="py-4 px-3 text-center font-mono text-[var(--ink-600)]">
                              {displayIndex}
                            </td>
                            <td className="py-4 px-4 font-semibold text-[var(--green-950)]">
                              {item.santri_name}
                            </td>
                            <td className="py-4 px-3 text-[var(--ink-600)]">
                              {item.origin}
                            </td>
                            <td className="py-4 px-4 font-medium text-[var(--ink-800)]">
                              {item.pesantren_name}
                            </td>
                            <td className="py-4 px-4 font-semibold text-[var(--ink-900)]">
                              {item.current_surah}
                            </td>
                            <td className="py-4 px-3 text-center font-bold text-[var(--gold-700)]">
                              Juz {item.juz}
                            </td>
                            <td className="py-4 px-4 font-medium text-[var(--ink-800)]">
                              {item.display_donor_name}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {item.photo_urls.length > 0 ? (
                                <button
                                  onClick={() =>
                                    setActiveGalleryModal({
                                      title: `Dokumentasi BUSS - ${item.santri_name}`,
                                      subtitle: `${item.pesantren_name} (${item.year})`,
                                      photos: item.photo_urls,
                                      description: `Penerima beasiswa santri tahfidz atas dukungan donatur ${item.display_donor_name}.`,
                                    })
                                  }
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[var(--gold-500)] text-xs font-semibold bg-[var(--cream-100)] hover:bg-gold-gradient transition-all"
                                >
                                  <ImageIcon className="w-3.5 h-3.5 text-[var(--gold-700)]" />
                                  <span>Lihat Foto</span>
                                </button>
                              ) : (
                                <span className="text-[var(--ink-400)]">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden space-y-4">
                  {(paginatedData as PublicBussDistribution[]).map((item, idx) => {
                    const displayIndex = (currentPage - 1) * pageSize + idx + 1;
                    return (
                      <div
                        key={item.id}
                        className="p-5 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-[var(--cream-200)] text-xs">
                          <span className="font-mono text-[var(--ink-600)]">
                            No. {displayIndex} &bull; Tahun {item.year}
                          </span>
                          <span className="font-bold text-[var(--gold-700)]">
                            Juz {item.juz}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-serif text-base font-bold text-[var(--green-950)]">
                            {item.santri_name}
                          </h4>
                          <p className="text-xs text-[var(--ink-600)]">
                            {item.pesantren_name} &bull; Asal: {item.origin}
                          </p>
                        </div>

                        <div className="p-3 rounded-2xl bg-[var(--cream-50)] text-xs space-y-1 border border-[var(--cream-200)]">
                          <p className="font-semibold text-[var(--ink-900)]">
                            Capaian: {item.current_surah}
                          </p>
                          <p className="text-[11px] text-[var(--ink-600)]">
                            Donatur: <strong className="text-[var(--green-800)]">{item.display_donor_name}</strong>
                          </p>
                        </div>

                        {item.photo_urls.length > 0 && (
                          <button
                            onClick={() =>
                              setActiveGalleryModal({
                                title: `Dokumentasi BUSS - ${item.santri_name}`,
                                subtitle: `${item.pesantren_name} (${item.year})`,
                                photos: item.photo_urls,
                                description: `Penerima beasiswa santri tahfidz atas dukungan donatur ${item.display_donor_name}.`,
                              })
                            }
                            className="w-full py-2 rounded-full border border-[var(--gold-500)] text-xs font-semibold text-center hover:bg-gold-gradient transition-all"
                          >
                            Lihat Foto Dokumentasi
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ======================================================== */}
            {/* TAB C: YATIM BERDIKARI                                   */}
            {/* ======================================================== */}
            {activeTab === "yatim" && (
              <>
                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto rounded-3xl border border-[var(--cream-200)] shadow-sm bg-[var(--cream-50)]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[var(--green-950)] text-[var(--cream-50)] font-serif uppercase tracking-wider text-[11px]">
                        <th className="py-4 px-3 text-center">Tahun</th>
                        <th className="py-4 px-3 text-center">No.</th>
                        <th className="py-4 px-6">Nama Kegiatan</th>
                        <th className="py-4 px-5">Penyelenggara</th>
                        <th className="py-4 px-4">Tanggal Pelaksanaan</th>
                        <th className="py-4 px-4 text-center">Dokumentasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--cream-200)] text-[var(--ink-900)]">
                      {(paginatedData as YatimActivity[]).map((item, idx) => {
                        const displayIndex = (currentPage - 1) * pageSize + idx + 1;
                        return (
                          <tr key={item.id} className="hover:bg-[var(--cream-100)] transition-colors">
                            <td className="py-4 px-3 text-center font-bold text-[var(--gold-700)]">
                              {item.year}
                            </td>
                            <td className="py-4 px-3 text-center font-mono text-[var(--ink-600)]">
                              {displayIndex}
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-serif text-sm font-bold text-[var(--green-950)]">
                                {item.activity_name}
                              </div>
                              <div className="text-[11px] text-[var(--ink-600)] line-clamp-1 mt-0.5">
                                {item.description}
                              </div>
                            </td>
                            <td className="py-4 px-5 font-medium text-[var(--ink-800)]">
                              {item.organizer}
                            </td>
                            <td className="py-4 px-4 text-[var(--ink-600)] whitespace-nowrap">
                              {item.activity_date}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() =>
                                  setActiveGalleryModal({
                                    title: item.activity_name,
                                    subtitle: `Penyelenggara: ${item.organizer} (${item.activity_date})`,
                                    photos: item.documentation_urls,
                                    description: item.description,
                                  })
                                }
                                className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[var(--green-800)] text-[var(--cream-50)] text-xs font-semibold hover:bg-[var(--green-700)] shadow-xs transition-colors"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>Lihat Dokumentasi Kegiatan</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden space-y-4">
                  {(paginatedData as YatimActivity[]).map((item, idx) => {
                    const displayIndex = (currentPage - 1) * pageSize + idx + 1;
                    return (
                      <div
                        key={item.id}
                        className="p-5 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-[var(--cream-200)] text-xs">
                          <span className="font-mono text-[var(--ink-600)]">
                            No. {displayIndex} &bull; Tahun {item.year}
                          </span>
                          <span className="text-[var(--ink-600)] flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[var(--green-700)]" />
                            {item.activity_date}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-serif text-base font-bold text-[var(--green-950)]">
                            {item.activity_name}
                          </h4>
                          <p className="text-xs text-[var(--ink-600)] mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="text-xs text-[var(--ink-800)]">
                          Penyelenggara: <strong>{item.organizer}</strong>
                        </div>

                        <button
                          onClick={() =>
                            setActiveGalleryModal({
                              title: item.activity_name,
                              subtitle: `Penyelenggara: ${item.organizer} (${item.activity_date})`,
                              photos: item.documentation_urls,
                              description: item.description,
                            })
                          }
                          className="w-full py-2.5 rounded-full bg-[var(--green-800)] text-[var(--cream-50)] text-xs font-semibold text-center hover:bg-[var(--green-700)] transition-colors shadow-xs"
                        >
                          Klik Lihat Dokumentasi Kegiatan
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ======================================================== */}
            {/* TAB D: GEBER MASJID (Hanya tampil jika env diaktifkan)   */}
            {/* ======================================================== */}
            {showGeberTab && activeTab === "geber" && (
              <div className="overflow-x-auto rounded-3xl border border-[var(--cream-200)] shadow-sm bg-[var(--cream-50)]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[var(--green-950)] text-[var(--cream-50)] font-serif uppercase tracking-wider text-[11px]">
                      <th className="py-4 px-3 text-center">No.</th>
                      <th className="py-4 px-4">Nama Masjid</th>
                      <th className="py-4 px-4">Lokasi &amp; Alamat</th>
                      <th className="py-4 px-3">Tanggal Kegiatan</th>
                      <th className="py-4 px-3 text-center">Relawan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--cream-200)] text-[var(--ink-900)]">
                    {(paginatedData as GeberMasjidDistribution[]).map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[var(--cream-100)] transition-colors">
                        <td className="py-4 px-3 text-center font-mono text-[var(--ink-600)]">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-4 font-semibold text-[var(--green-950)]">
                          {item.mosque_name}
                        </td>
                        <td className="py-4 px-4">
                          <div>{item.city}, {item.province}</div>
                          <div className="text-[10px] text-[var(--ink-600)] line-clamp-1">{item.address}</div>
                        </td>
                        <td className="py-4 px-3 text-[var(--ink-600)]">{item.activity_date}</td>
                        <td className="py-4 px-3 text-center font-bold text-[var(--green-800)]">
                          {item.participants} orang
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 5. Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--cream-200)]">
                <div className="text-xs text-[var(--ink-600)]">
                  Menampilkan <strong>{(currentPage - 1) * pageSize + 1}</strong> s/d{" "}
                  <strong>{Math.min(currentPage * pageSize, currentDataset.length)}</strong> dari{" "}
                  <strong>{currentDataset.length}</strong> data
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="p-2 rounded-xl border border-[var(--cream-300)] text-[var(--ink-800)] hover:bg-[var(--cream-200)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-semibold px-3 py-1 bg-[var(--cream-100)] rounded-lg text-[var(--ink-900)]">
                    Halaman {currentPage} dari {totalPages}
                  </span>

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="p-2 rounded-xl border border-[var(--cream-300)] text-[var(--ink-800)] hover:bg-[var(--cream-200)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Halaman selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ======================================================== */}
      {/* 6. MODAL: GALERI FOTO KEGIATAN                          */}
      {/* ======================================================== */}
      {activeGalleryModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setActiveGalleryModal(null)}
        >
          <div
            className="bg-[var(--cream-50)] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[var(--gold-500)]/40 shadow-2xl p-6 sm:p-8 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-[var(--cream-200)]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[var(--green-950)]">
                  {activeGalleryModal.title}
                </h3>
                {activeGalleryModal.subtitle && (
                  <p className="text-xs text-[var(--ink-600)] mt-0.5">
                    {activeGalleryModal.subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={() => setActiveGalleryModal(null)}
                className="p-2 rounded-full hover:bg-[var(--cream-200)] text-[var(--ink-600)] transition-colors"
                aria-label="Tutup modal galeri"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeGalleryModal.description && (
              <p className="text-xs text-[var(--ink-700)] leading-relaxed">
                {activeGalleryModal.description}
              </p>
            )}

            <div className="grid grid-cols-1 gap-3">
              {activeGalleryModal.photos.map((url, pIdx) => (
                <div
                  key={pIdx}
                  className="relative aspect-16/10 rounded-2xl overflow-hidden border border-[var(--cream-200)] bg-[var(--green-950)] shadow-sm"
                >
                  <Image
                    src={url}
                    alt={activeGalleryModal.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 550px"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setActiveGalleryModal(null)}
                className="px-6 py-2 rounded-full bg-[var(--green-800)] text-[var(--cream-50)] text-xs font-semibold hover:bg-[var(--green-700)] transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
