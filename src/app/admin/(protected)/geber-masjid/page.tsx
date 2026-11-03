"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Search, Trash2, Edit, Eye, EyeOff } from "lucide-react";
import { GeberMasjidDistribution } from "@/lib/db/types";

export default function AdminGeberListPage() {
  const [data, setData] = useState<GeberMasjidDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/geber");
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

  const handleToggleStatus = async (item: GeberMasjidDistribution) => {
    const nextStatus = item.status === "published" ? "draft" : "published";
    try {
      await fetch("/api/admin/geber", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, status: nextStatus }),
      });
      fetchData();
    } catch {
      alert("Gagal memperbarui status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus data kegiatan Geber Masjid di ${name}?`)) return;
    try {
      await fetch(`/api/admin/geber?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch {
      alert("Gagal menghapus data");
    }
  };

  const filtered = data.filter((item) => {
    return (
      item.mosque_name.toLowerCase().includes(search.toLowerCase()) ||
      item.city.toLowerCase().includes(search.toLowerCase()) ||
      item.province.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--cream-200)]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
            Data Sebaran Geber Masjid
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-1">
            Kelola data aksi pembersihan karpet, sanitasi, dan peremajaan masjid.
          </p>
        </div>

        <Link
          href="/admin/geber-masjid/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[var(--gold-500)] text-[var(--green-950)] hover:brightness-105 transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Geber Masjid</span>
        </Link>
      </div>

      <div className="p-4 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-200)] flex justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-400)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama masjid atau kota..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-xs text-[var(--ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
          />
        </div>
        <div className="text-xs text-[var(--ink-600)]">
          Total: <span className="font-bold text-[var(--ink-900)]">{filtered.length}</span> masjid
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--cream-200)] bg-[var(--cream-50)] shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[var(--green-950)] text-[var(--cream-50)] text-xs uppercase tracking-wider font-sans">
            <tr>
              <th className="py-3 px-4">Nama Masjid</th>
              <th className="py-3 px-4">Alamat & Wilayah</th>
              <th className="py-3 px-4">Tanggal Aksi</th>
              <th className="py-3 px-4">Relawan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--cream-200)]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-[var(--ink-400)]">
                  Memuat data masjid...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-[var(--ink-400)]">
                  Belum ada data masjid.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="hover:bg-[var(--cream-100)] transition-colors">
                  <td className="py-3 px-4 font-serif font-bold text-[var(--ink-900)]">
                    {row.mosque_name}
                  </td>
                  <td className="py-3 px-4 text-xs text-[var(--ink-600)]">
                    {row.address}, {row.city}, {row.province}
                  </td>
                  <td className="py-3 px-4 text-xs text-[var(--ink-600)]">
                    {row.activity_date}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold">
                    {row.participants} Orang
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(row)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-colors ${
                        row.status === "published"
                          ? "bg-[var(--green-800)] text-[var(--gold-300)]"
                          : "bg-[var(--terracotta-500)]/20 text-[var(--terracotta-500)]"
                      }`}
                    >
                      {row.status === "published" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{row.status}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(row.id, row.mosque_name)}
                      className="p-1.5 rounded-lg text-[var(--danger)] hover:bg-[var(--danger)]/10"
                      title="Hapus Data"
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

