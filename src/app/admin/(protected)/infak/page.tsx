"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Users,
} from "lucide-react";
import { InfakJinanRecord } from "@/lib/db/types";

export default function AdminInfakListPage() {
  const [data, setData] = useState<InfakJinanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published">("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/infak");
      const list = await res.json();
      if (Array.isArray(list)) setData(list);
    } catch {
      setFeedback({ type: "error", message: "Gagal memuat data dari server." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (item: InfakJinanRecord) => {
    const nextStatus = item.status === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/admin/infak", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, status: nextStatus }),
      });
      if (!res.ok) throw new Error("Gagal update status");
      setFeedback({ type: "success", message: `Status Mushaf #${item.mushaf_no} diubah ke ${nextStatus}.` });
      fetchData();
    } catch {
      setFeedback({ type: "error", message: "Gagal memperbarui status data." });
    }
  };

  const handleDelete = async (id: string, mushafNo: number) => {
    if (!confirm(`Hapus donasi Mushaf #${mushafNo} beserta seluruh data santri anaknya?`)) return;

    try {
      const res = await fetch(`/api/admin/infak?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus data");
      setFeedback({ type: "success", message: `Mushaf #${mushafNo} berhasil dihapus.` });
      fetchData();
    } catch {
      setFeedback({ type: "error", message: "Gagal menghapus data dari server." });
    }
  };

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.mushaf_no.toString().includes(search) ||
      item.donor_name.toLowerCase().includes(search.toLowerCase()) ||
      item.pesantren_name.toLowerCase().includes(search.toLowerCase()) ||
      item.donor_origin.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => a.mushaf_no - b.mushaf_no);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--cream-200)]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
            Data Penyaluran Infak Al-Qur&apos;an Jinan
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-1">
            Arsitektur Dua Tingkat: Kelola donasi mushaf dan daftar santri binaan penerima manfaat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/infak/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-[var(--gold-400)]" />
            <span>Tambah Donasi Mushaf</span>
          </Link>
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`px-4 py-3 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === "success"
              ? "bg-[var(--green-50)] border-[var(--green-200)] text-[var(--green-900)]"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-[11px] font-semibold underline ml-3"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-200)] flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-400)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor mushaf, donatur, pesantren..."
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
              <th className="py-3 px-4">Urutan Mushaf</th>
              <th className="py-3 px-4">Donatur (Admin HP)</th>
              <th className="py-3 px-4">Tampil Publik</th>
              <th className="py-3 px-4">Pesantren &amp; Dedikasi</th>
              <th className="py-3 px-4 text-center">Jumlah Santri</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--cream-200)]">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[var(--ink-400)]">
                  Memuat data penyaluran...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[var(--ink-400)]">
                  Belum ada data yang sesuai filter.
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const santriCount = row.santri_list ? row.santri_list.length : (row.santri_count || 0);
                const hasZeroSantriWarning = row.status === "published" && santriCount === 0;

                return (
                  <tr key={row.id} className="hover:bg-[var(--cream-100)] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[var(--green-800)] whitespace-nowrap">
                      Mushaf #{row.mushaf_no}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[var(--ink-900)]">{row.donor_name}</div>
                      <div className="text-[11px] text-[var(--ink-600)]">
                        {row.donor_origin} / HP: <span className="font-mono">{row.donor_phone || "-"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {row.show_donor_name ? (
                        <span className="text-[11px] font-semibold text-[var(--green-700)] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ya
                        </span>
                      ) : (
                        <span className="text-[11px] text-[var(--ink-500)] italic">
                          Hamba Allah
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-serif font-bold text-[var(--ink-900)]">
                        {row.pesantren_name}
                      </div>
                      <div className="text-[11px] italic text-[var(--gold-700)]">
                        &ldquo;{row.dedication_name}&rdquo;
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--green-900)]/10 text-[var(--green-800)]">
                        <Users className="w-3.5 h-3.5" />
                        <span>{santriCount} Santri</span>
                      </div>
                      {hasZeroSantriWarning && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-amber-700 font-bold px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Published tapi 0 Santri</span>
                        </div>
                      )}
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
                          title="Edit Donasi & Input Hafalan"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/data-sebaran/infak-jinan/${row.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-[var(--ink-600)] hover:text-[var(--green-800)] hover:bg-[var(--cream-200)]"
                          title="Lihat Halaman Publik"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(row.id, row.mushaf_no)}
                          className="p-1.5 rounded-lg text-[var(--danger)] hover:bg-[var(--danger)]/10"
                          title="Hapus Donasi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
