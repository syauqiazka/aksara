"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Upload,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { InfakDistribution } from "@/lib/db/types";
import Badge from "@/components/ui/Badge";

export default function AdminInfakListPage() {
  const [data, setData] = useState<InfakDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published">("all");
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/infak");
      const list = await res.json();
      if (Array.isArray(list)) setData(list);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (item: InfakDistribution) => {
    const nextStatus = item.status === "published" ? "draft" : "published";
    try {
      await fetch("/api/admin/infak", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, status: nextStatus }),
      });
      fetchData();
    } catch {
      alert("Gagal memperbarui status");
    }
  };

  const handleDelete = async (id: string, no: number) => {
    if (!confirm(`Hapus data penyaluran mushaf #${no}?`)) return;
    try {
      await fetch(`/api/admin/infak?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch {
      alert("Gagal menghapus data");
    }
  };

  const handleBulkImport = async () => {
    if (!csvText.trim()) return;
    setImportStatus("Mengimpor data...");
    try {
      const res = await fetch("/api/admin/infak/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvText }),
      });
      const result = await res.json();
      if (result.success) {
        setImportStatus(`Berhasil mengimpor ${result.count} data!`);
        setTimeout(() => {
          setShowImportModal(false);
          setCsvText("");
          setImportStatus(null);
          fetchData();
        }, 1500);
      } else {
        setImportStatus(`Gagal: ${result.error}`);
      }
    } catch {
      setImportStatus("Terjadi kesalahan saat mengunggah");
    }
  };

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.mushaf_no.toString().includes(search) ||
      item.donor_name.toLowerCase().includes(search.toLowerCase()) ||
      item.recipient_name.toLowerCase().includes(search.toLowerCase()) ||
      item.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--cream-200)]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
            Data Sebaran Infak 1 Jt Al-Qur&apos;an
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-1">
            Kelola nomor urut mushaf, nama custom pewakaf, penerima manfaat, dan publikasi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-[var(--cream-100)] border border-[var(--cream-200)] text-[var(--ink-900)] hover:bg-[var(--cream-200)] transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-[var(--green-700)]" />
            <span>Impor CSV</span>
          </button>
          <Link
            href="/admin/infak/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-[var(--gold-400)]" />
            <span>Tambah Data</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-200)] flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-400)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor mushaf, donatur, atau kota..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-xs text-[var(--ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[var(--ink-600)]">Status:</span>
          {(["all", "published", "draft"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filterStatus === st
                  ? "bg-[var(--green-950)] text-[var(--gold-300)]"
                  : "bg-[var(--cream-50)] text-[var(--ink-600)] border border-[var(--cream-200)]"
              }`}
            >
              {st === "all" ? "Semua" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--cream-200)] bg-[var(--cream-50)] shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[var(--green-950)] text-[var(--cream-50)] text-xs uppercase tracking-wider font-sans">
            <tr>
              <th className="py-3 px-4">No.</th>
              <th className="py-3 px-4">Donatur (Cover Mushaf)</th>
              <th className="py-3 px-4">Tampil Publik</th>
              <th className="py-3 px-4">Lembaga Penerima</th>
              <th className="py-3 px-4">Wilayah</th>
              <th className="py-3 px-4">Jumlah</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--cream-200)]">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-[var(--ink-400)]">
                  Memuat data penyaluran...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-[var(--ink-400)]">
                  Belum ada data yang sesuai filter.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="hover:bg-[var(--cream-100)] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[var(--green-800)]">
                    #{row.mushaf_no}
                  </td>
                  <td className="py-3 px-4 font-medium text-[var(--ink-900)]">
                    {row.donor_name}
                  </td>
                  <td className="py-3 px-4">
                    {row.show_donor_name ? (
                      <span className="text-[11px] font-semibold text-[var(--green-700)] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ya
                      </span>
                    ) : (
                      <span className="text-[11px] text-[var(--ink-400)]">
                        Hamba Allah
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-serif font-bold text-[var(--ink-900)]">
                    {row.recipient_name}
                  </td>
                  <td className="py-3 px-4 text-xs text-[var(--ink-600)]">
                    {row.city}, {row.province}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold">
                    {row.quantity} Mushaf
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(row)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-colors ${
                        row.status === "published"
                          ? "bg-[var(--green-800)] text-[var(--gold-300)] hover:bg-[var(--green-900)]"
                          : "bg-[var(--terracotta-500)]/20 text-[var(--terracotta-500)] hover:bg-[var(--terracotta-500)]/30"
                      }`}
                    >
                      {row.status === "published" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{row.status}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/infak/${row.id}`}
                        className="p-1.5 rounded-lg text-[var(--ink-600)] hover:text-[var(--green-800)] hover:bg-[var(--cream-200)]"
                        title="Edit Data"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(row.id, row.mushaf_no)}
                        className="p-1.5 rounded-lg text-[var(--danger)] hover:bg-[var(--danger)]/10"
                        title="Hapus Data"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bulk CSV Import Modal */}
      {showImportModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowImportModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full bg-[var(--green-950)] text-[var(--cream-50)] border-2 border-[var(--gold-500)] rounded-3xl p-6 sm:p-8 shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-2xl font-bold text-[var(--cream-50)]">
                Impor Data Massal (CSV)
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-xs text-[var(--sage-300)] hover:text-white"
              >
                &times; Tutup
              </button>
            </div>

            <p className="text-xs text-[var(--cream-200)]/90 mb-4 leading-relaxed">
              Tempelkan teks baris data spreadsheet berformat CSV dengan kolom:
              <br />
              <code className="text-[11px] text-[var(--gold-300)] font-mono block mt-1 bg-[var(--green-900)] p-2 rounded-lg">
                mushaf_no,donor_name,show_donor_name,recipient_name,recipient_type,province,city,district,distributed_at,quantity,notes,status
              </code>
            </p>

            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={`mushaf_no,donor_name,show_donor_name,recipient_name,recipient_type,province,city,district,distributed_at,quantity,notes,status\n10,Hj. Mariam,true,Pesantren Raudhatul Jannah,pesantren,Jawa Barat,Bandung,Soreang,2026-06-20,50,Penyerahan santri baru,published`}
              className="w-full p-4 rounded-xl bg-[var(--green-900)] border border-[var(--gold-500)]/30 font-mono text-xs text-[var(--cream-50)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)] mb-4"
            />

            {importStatus && (
              <div className="text-xs font-semibold text-[var(--gold-300)] mb-4">
                {importStatus}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--cream-200)] hover:bg-[var(--green-900)]"
              >
                Batal
              </button>
              <button
                onClick={handleBulkImport}
                className="px-6 py-2.5 rounded-full text-xs font-semibold bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-lg"
              >
                Proses Impor CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

