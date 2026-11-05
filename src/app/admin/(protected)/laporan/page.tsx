"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Search, Trash2 } from "lucide-react";
import { Report } from "@/lib/db/types";

export default function AdminReportsListPage() {
  const [data, setData] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports");
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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus laporan "${title}"?`)) return;
    try {
      await fetch(`/api/admin/reports?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch {
      alert("Gagal menghapus laporan");
    }
  };

  const filtered = data.filter((item) => {
    return (
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--cream-200)]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
            Laporan Penyaluran & Audit Terbuka
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-1">
            Publikasikan dokumen pertanggungjawaban donasi per program dan periode.
          </p>
        </div>

        <Link
          href="/admin/laporan/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[var(--gold-400)]" />
          <span>Buat Laporan Baru</span>
        </Link>
      </div>

      <div className="p-4 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-200)] flex justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-400)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul laporan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-xs text-[var(--ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
          />
        </div>
        <div className="text-xs text-[var(--ink-600)]">
          Total: <span className="font-bold text-[var(--ink-900)]">{filtered.length}</span> laporan
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--cream-200)] bg-[var(--cream-50)] shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[var(--green-950)] text-[var(--cream-50)] text-xs uppercase tracking-wider font-sans">
            <tr>
              <th className="py-3 px-4">Judul Laporan</th>
              <th className="py-3 px-4">Program</th>
              <th className="py-3 px-4">Periode</th>
              <th className="py-3 px-4">Penerima</th>
              <th className="py-3 px-4">Anggaran</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--cream-200)]">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[var(--ink-400)]">
                  Memuat laporan...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[var(--ink-400)]">
                  Belum ada dokumen laporan.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="hover:bg-[var(--cream-100)] transition-colors">
                  <td className="py-3 px-4 font-serif font-bold text-[var(--ink-900)] max-w-xs truncate">
                    {row.title}
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-[var(--gold-700)]">
                    {row.program.replace("_", " ")}
                  </td>
                  <td className="py-3 px-4 text-xs text-[var(--ink-600)]">
                    {row.period_start} s/d {row.period_end}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold">
                    {row.beneficiaries} Orang
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-[var(--green-800)] font-bold">
                    {row.amount_idr ? `Rp ${row.amount_idr.toLocaleString("id-ID")}` : "-"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        row.status === "published"
                          ? "bg-[var(--green-800)] text-[var(--gold-300)]"
                          : "bg-[var(--terracotta-500)]/20 text-[var(--terracotta-500)]"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(row.id, row.title)}
                      className="p-1.5 rounded-lg text-[var(--danger)] hover:bg-[var(--danger)]/10"
                      title="Hapus Laporan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

