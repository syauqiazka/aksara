"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  ArrowUpDown,
  BookOpen,
  Building2,
  Calendar,
  MapPin,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  SearchX,
} from "lucide-react";
import { InfakDistribution, GeberMasjidDistribution, AggregatedStats } from "@/lib/db/types";
import IndonesiaMap from "@/components/sections/IndonesiaMap";
import Badge from "@/components/ui/Badge";

interface DataSebaranViewProps {
  initialInfak: InfakDistribution[];
  initialGeber: GeberMasjidDistribution[];
  stats: AggregatedStats;
}

function cleanName(str: string): string {
  return str.replace(/\s*\[CONTOH[^\]]*\]/gi, "").trim();
}

export default function DataSebaranView({
  initialInfak,
  initialGeber,
}: DataSebaranViewProps) {
  const [activeTab, setActiveTab] = useState<"infak" | "geber">("infak");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("date");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Selected item for detail drawer
  const [selectedDrawerItem, setSelectedDrawerItem] = useState<{
    title: string;
    subtitle: string;
    date: string;
    location: string;
    detail: string;
    photoUrl?: string | null;
    type?: string;
  } | null>(null);

  // Clean provinces list
  const provinces = useMemo(() => {
    const list = new Set<string>();
    initialInfak.forEach((i) => i.province && list.add(i.province));
    initialGeber.forEach((g) => g.province && list.add(g.province));
    return Array.from(list);
  }, [initialInfak, initialGeber]);

  // Filtered & Sorted Infak
  const filteredInfak = useMemo(() => {
    return initialInfak
      .filter((item) => {
        const cDonor = cleanName(item.donor_name);
        const cRecipient = cleanName(item.recipient_name);
        const matchesSearch =
          searchQuery.trim() === "" ||
          item.mushaf_no.toString().includes(searchQuery.trim()) ||
          cRecipient.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          (item.show_donor_name && cDonor.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
          item.city.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          item.province.toLowerCase().includes(searchQuery.toLowerCase().trim());

        const matchesProvince = selectedProvince === "all" || item.province === selectedProvince;
        const matchesType = selectedType === "all" || item.recipient_type === selectedType;

        return matchesSearch && matchesProvince && matchesType;
      })
      .sort((a, b) => {
        if (sortField === "mushaf_no") {
          return sortAsc ? a.mushaf_no - b.mushaf_no : b.mushaf_no - a.mushaf_no;
        }
        if (sortField === "quantity") {
          return sortAsc ? a.quantity - b.quantity : b.quantity - a.quantity;
        }
        const dateA = new Date(a.distributed_at).getTime();
        const dateB = new Date(b.distributed_at).getTime();
        return sortAsc ? dateA - dateB : dateB - dateA;
      });
  }, [initialInfak, searchQuery, selectedProvince, selectedType, sortField, sortAsc]);

  // Filtered & Sorted Geber
  const filteredGeber = useMemo(() => {
    return initialGeber
      .filter((item) => {
        const cMosque = cleanName(item.mosque_name);
        const matchesSearch =
          searchQuery.trim() === "" ||
          cMosque.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          item.city.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          item.district.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          item.province.toLowerCase().includes(searchQuery.toLowerCase().trim());

        const matchesProvince = selectedProvince === "all" || item.province === selectedProvince;

        return matchesSearch && matchesProvince;
      })
      .sort((a, b) => {
        if (sortField === "participants") {
          return sortAsc ? a.participants - b.participants : b.participants - a.participants;
        }
        const dateA = new Date(a.activity_date).getTime();
        const dateB = new Date(b.activity_date).getTime();
        return sortAsc ? dateA - dateB : dateB - dateA;
      });
  }, [initialGeber, searchQuery, selectedProvince, sortField, sortAsc]);

  const activeDataset = activeTab === "infak" ? filteredInfak : filteredGeber;
  const totalPages = Math.ceil(activeDataset.length / pageSize) || 1;
  const paginatedData = activeDataset.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleTabSwitch = (tab: "infak" | "geber") => {
    setActiveTab(tab);
    setSearchQuery("");
    setSelectedProvince("all");
    setSelectedType("all");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-12">
      {/* 1. Large Switching Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => handleTabSwitch("infak")}
          className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-serif text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3 border ${
            activeTab === "infak"
              ? "bg-[var(--green-950)] text-gold-gradient border-[var(--gold-400)] shadow-xl scale-105"
              : "bg-[var(--cream-100)] text-[var(--ink-600)] border-[var(--cream-200)] hover:bg-[var(--cream-200)]"
          }`}
        >
          <BookOpen className="w-5 h-5 text-[var(--gold-400)]" />
          <span>Infak 1 Jt Al-Qur&apos;an ({initialInfak.length})</span>
        </button>

        <button
          onClick={() => handleTabSwitch("geber")}
          className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-serif text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3 border ${
            activeTab === "geber"
              ? "bg-[var(--green-950)] text-gold-gradient border-[var(--gold-400)] shadow-xl scale-105"
              : "bg-[var(--cream-100)] text-[var(--ink-600)] border-[var(--cream-200)] hover:bg-[var(--cream-200)]"
          }`}
        >
          <Building2 className="w-5 h-5 text-[var(--gold-400)]" />
          <span>Geber Masjid ({initialGeber.length})</span>
        </button>
      </div>

      {/* 2. Interactive Map */}
      <IndonesiaMap
        infakData={initialInfak}
        geberData={initialGeber}
        activeTab={activeTab}
      />

      {/* 3. Filter Bar & Search */}
      <div className="p-6 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search box - Always clean placeholder without pre-filled text */}
          <div className="relative flex-grow">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-400)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={
                activeTab === "infak"
                  ? "Cari nama pesantren, sekolah, nomor mushaf, atau kota..."
                  : "Cari nama masjid atau kota..."
              }
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm text-[var(--ink-900)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-400)]"
            />
          </div>

          {/* Province Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 rounded-2xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm text-[var(--ink-900)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-400)]"
            >
              <option value="all">Semua Provinsi</option>
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          {activeTab === "infak" && (
            <div className="w-full md:w-48">
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm text-[var(--ink-900)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-400)]"
              >
                <option value="all">Semua Lembaga</option>
                <option value="pesantren">Pesantren</option>
                <option value="masjid">Masjid</option>
                <option value="madrasah">Madrasah</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          )}
        </div>

        {/* Quick summary line & sort toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[var(--ink-600)] pt-2 border-t border-[var(--cream-200)] gap-2">
          <div>
            Menampilkan <span className="font-bold text-[var(--ink-900)]">{activeDataset.length}</span> data penyaluran terverifikasi
          </div>
          <div className="flex items-center gap-2">
            <span>Urutkan:</span>
            <button
              onClick={() => {
                setSortField("date");
                setSortAsc(!sortAsc);
              }}
              className="px-2.5 py-1 rounded-lg bg-[var(--cream-50)] border border-[var(--cream-200)] hover:border-[var(--gold-500)] flex items-center gap-1 font-medium"
            >
              <span>Tanggal</span>
              <ArrowUpDown className="w-3 h-3 text-[var(--gold-700)]" />
            </button>
            {activeTab === "infak" && (
              <button
                onClick={() => {
                  setSortField("mushaf_no");
                  setSortAsc(!sortAsc);
                }}
                className="px-2.5 py-1 rounded-lg bg-[var(--cream-50)] border border-[var(--cream-200)] hover:border-[var(--gold-500)] flex items-center gap-1 font-medium"
              >
                <span>No. Mushaf</span>
                <ArrowUpDown className="w-3 h-3 text-[var(--gold-700)]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Table & Cards */}
      {paginatedData.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)]">
          <SearchX className="w-10 h-10 text-[var(--ink-400)] mx-auto mb-3" />
          <h4 className="font-serif text-xl font-bold text-[var(--ink-900)]">
            Tidak Ada Data yang Cocok
          </h4>
          <p className="text-sm text-[var(--ink-600)] mt-1">
            Silakan sesuaikan kata kunci pencarian Anda.
          </p>
        </div>
      ) : activeTab === "infak" ? (
        <div className="overflow-hidden rounded-3xl border border-[var(--cream-200)] shadow-sm bg-[var(--cream-50)]">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--green-950)] text-[var(--cream-50)] text-xs uppercase tracking-wider font-sans">
                <tr>
                  <th className="py-4 px-6 font-semibold">Mushaf Ke-</th>
                  <th className="py-4 px-6 font-semibold">Donatur / Atas Nama</th>
                  <th className="py-4 px-6 font-semibold">Lembaga Penerima</th>
                  <th className="py-4 px-6 font-semibold">Jenis</th>
                  <th className="py-4 px-6 font-semibold">Wilayah</th>
                  <th className="py-4 px-6 font-semibold">Tanggal</th>
                  <th className="py-4 px-6 font-semibold text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cream-200)]">
                {(paginatedData as InfakDistribution[]).map((row, idx) => {
                  const donorDisplay = row.show_donor_name ? cleanName(row.donor_name) : "Hamba Allah";
                  const recipientDisplay = cleanName(row.recipient_name);
                  return (
                    <tr
                      key={row.id}
                      onClick={() =>
                        setSelectedDrawerItem({
                          title: recipientDisplay,
                          subtitle: `Donatur: ${donorDisplay}`,
                          date: row.distributed_at,
                          location: `${row.district}, ${row.city}, ${row.province}`,
                          detail: row.notes || "Mushaf Al-Qur'an hafalan diserahkan langsung ke santri tahfidz.",
                          photoUrl: row.photo_url,
                          type: row.recipient_type,
                        })
                      }
                      className={`cursor-pointer transition-colors ${
                        idx % 2 === 0 ? "bg-[var(--cream-50)]" : "bg-[var(--sage-100)]/60"
                      } hover:bg-[var(--cream-100)]`}
                    >
                      <td className="py-4 px-6 font-mono font-bold text-[var(--green-800)]">
                        #{row.mushaf_no}
                      </td>
                      <td className="py-4 px-6 font-medium text-[var(--ink-900)]">
                        {donorDisplay}
                      </td>
                      <td className="py-4 px-6 font-serif font-bold text-[var(--ink-900)]">
                        {recipientDisplay}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={row.recipient_type === "pesantren" ? "pesantren" : row.recipient_type === "masjid" ? "masjid" : "madrasah"}>
                          {row.recipient_type}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-xs text-[var(--ink-600)]">
                        {row.city}, {row.province}
                      </td>
                      <td className="py-4 px-6 text-xs text-[var(--ink-600)]">
                        {row.distributed_at}
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-right text-[var(--ink-900)]">
                        {row.quantity} Mushaf
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="md:hidden divide-y divide-[var(--cream-200)]">
            {(paginatedData as InfakDistribution[]).map((row) => {
              const donorDisplay = row.show_donor_name ? cleanName(row.donor_name) : "Hamba Allah";
              const recipientDisplay = cleanName(row.recipient_name);
              return (
                <div
                  key={row.id}
                  onClick={() =>
                    setSelectedDrawerItem({
                      title: recipientDisplay,
                      subtitle: `Donatur: ${donorDisplay}`,
                      date: row.distributed_at,
                      location: `${row.district}, ${row.city}, ${row.province}`,
                      detail: row.notes || "Mushaf Al-Qur'an hafalan diserahkan langsung ke santri tahfidz.",
                      photoUrl: row.photo_url,
                      type: row.recipient_type,
                    })
                  }
                  className="p-5 space-y-3 cursor-pointer hover:bg-[var(--cream-100)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-[var(--green-950)] text-[var(--gold-400)]">
                      Mushaf #{row.mushaf_no}
                    </span>
                    <Badge variant={row.recipient_type === "pesantren" ? "pesantren" : "masjid"}>
                      {row.recipient_type}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[var(--ink-900)]">
                      {recipientDisplay}
                    </h4>
                    <p className="text-xs text-[var(--gold-700)] font-medium mt-0.5">
                      Donatur: {donorDisplay}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--ink-600)] pt-2 border-t border-[var(--cream-200)]">
                    <span>{row.city}, {row.province}</span>
                    <span className="font-bold text-[var(--green-800)]">{row.quantity} Mushaf</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Geber Table */
        <div className="overflow-hidden rounded-3xl border border-[var(--cream-200)] shadow-sm bg-[var(--cream-50)]">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--green-950)] text-[var(--cream-50)] text-xs uppercase tracking-wider font-sans">
                <tr>
                  <th className="py-4 px-6 font-semibold">Nama Masjid</th>
                  <th className="py-4 px-6 font-semibold">Alamat Lengkap</th>
                  <th className="py-4 px-6 font-semibold">Kota / Wilayah</th>
                  <th className="py-4 px-6 font-semibold">Tanggal Aksi</th>
                  <th className="py-4 px-6 font-semibold text-right">Peserta Relawan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cream-200)]">
                {(paginatedData as GeberMasjidDistribution[]).map((row, idx) => {
                  const mosqueDisplay = cleanName(row.mosque_name);
                  return (
                    <tr
                      key={row.id}
                      onClick={() =>
                        setSelectedDrawerItem({
                          title: mosqueDisplay,
                          subtitle: `${row.participants} Relawan Terjun`,
                          date: row.activity_date,
                          location: `${row.address}, ${row.district}, ${row.city}, ${row.province}`,
                          detail: row.activity_notes || "Aksi pembersihan karpet, sanitasi wudhu, dan pengecatan fasilitas.",
                          photoUrl: row.photo_urls[0] || null,
                          type: "masjid",
                        })
                      }
                      className={`cursor-pointer transition-colors ${
                        idx % 2 === 0 ? "bg-[var(--cream-50)]" : "bg-[var(--sage-100)]/60"
                      } hover:bg-[var(--cream-100)]`}
                    >
                      <td className="py-4 px-6 font-serif font-bold text-[var(--ink-900)]">
                        {mosqueDisplay}
                      </td>
                      <td className="py-4 px-6 text-xs text-[var(--ink-600)]">
                        {row.address}
                      </td>
                      <td className="py-4 px-6 text-xs text-[var(--ink-600)]">
                        {row.city}, {row.province}
                      </td>
                      <td className="py-4 px-6 text-xs text-[var(--ink-600)]">
                        {row.activity_date}
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-right text-[var(--ink-900)]">
                        {row.participants} Orang
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-[var(--cream-200)]">
            {(paginatedData as GeberMasjidDistribution[]).map((row) => {
              const mosqueDisplay = cleanName(row.mosque_name);
              return (
                <div
                  key={row.id}
                  onClick={() =>
                    setSelectedDrawerItem({
                      title: mosqueDisplay,
                      subtitle: `${row.participants} Relawan Terjun`,
                      date: row.activity_date,
                      location: `${row.address}, ${row.district}, ${row.city}, ${row.province}`,
                      detail: row.activity_notes || "Aksi pembersihan karpet, sanitasi wudhu, dan pengecatan fasilitas.",
                      photoUrl: row.photo_urls[0] || null,
                      type: "masjid",
                    })
                  }
                  className="p-5 space-y-3 cursor-pointer hover:bg-[var(--cream-100)]"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="masjid">Aksi Geber Masjid</Badge>
                    <span className="text-xs text-[var(--ink-600)]">{row.activity_date}</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[var(--ink-900)]">
                      {mosqueDisplay}
                    </h4>
                    <p className="text-xs text-[var(--ink-600)] mt-0.5">{row.address}, {row.city}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--ink-600)] pt-2 border-t border-[var(--cream-200)]">
                    <span>{row.province}</span>
                    <span className="font-bold text-[var(--green-800)]">{row.participants} Relawan</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-xs text-[var(--ink-600)]">
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-[var(--cream-100)] border border-[var(--cream-200)] disabled:opacity-40 hover:bg-[var(--cream-200)]"
            >
              <ChevronLeft className="w-4 h-4 text-[var(--ink-900)]" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-[var(--cream-100)] border border-[var(--cream-200)] disabled:opacity-40 hover:bg-[var(--cream-200)]"
            >
              <ChevronRight className="w-4 h-4 text-[var(--ink-900)]" />
            </button>
          </div>
        </div>
      )}

      {/* 6. Detail Drawer Modal */}
      {selectedDrawerItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedDrawerItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full bg-[var(--green-950)] text-[var(--cream-50)] border-2 border-[var(--gold-500)] rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedDrawerItem(null)}
              className="absolute top-5 right-5 text-[var(--sage-300)] hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {selectedDrawerItem.photoUrl && (
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 border border-[var(--gold-500)]/40 bg-[var(--green-900)]">
                <Image
                  src={selectedDrawerItem.photoUrl}
                  alt={selectedDrawerItem.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--gold-500)] text-[var(--green-950)] mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Berita Acara Penyaluran</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[var(--cream-50)] mb-1">
              {selectedDrawerItem.title}
            </h3>
            <p className="text-xs text-[var(--gold-300)] font-medium mb-4">
              {selectedDrawerItem.subtitle}
            </p>

            <div className="space-y-3 py-4 border-y border-[var(--gold-500)]/20 text-xs text-[var(--cream-100)]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--gold-400)] flex-shrink-0" />
                <span>{selectedDrawerItem.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--gold-400)] flex-shrink-0" />
                <span>Tanggal Penyaluran: {selectedDrawerItem.date}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-[var(--gold-400)] uppercase tracking-wider font-semibold mb-1">
                Catatan Lapangan & Dokumentasi:
              </div>
              <p className="text-sm text-[var(--cream-200)] leading-relaxed">
                {selectedDrawerItem.detail}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--gold-500)]/20 flex justify-end">
              <button
                onClick={() => setSelectedDrawerItem(null)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold bg-gold-gradient text-[var(--green-950)]"
              >
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
