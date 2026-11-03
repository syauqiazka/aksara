import Link from "next/link";
import { db } from "@/lib/db/api";
import {
  BookOpen,
  Building2,
  Clock,
  CheckCircle2,
  PlusCircle,
  FileText,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default async function AdminDashboardPage() {
  const allInfak = await db.getInfakDistributions(false);
  const allGeber = await db.getGeberDistributions(false);
  const allReports = await db.getReports(false);

  const totalMushaf = allInfak.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
  const totalMasjid = allGeber.length;

  const draftInfak = allInfak.filter((i) => i.status === "draft");
  const draftGeber = allGeber.filter((g) => g.status === "draft");
  const draftReports = allReports.filter((r) => r.status === "draft");
  const totalDrafts = draftInfak.length + draftGeber.length + draftReports.length;

  const recentEntries = allInfak.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--cream-200)]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[var(--ink-900)]">
            Dashboard Pengurus Yayasan
          </h1>
          <p className="text-sm text-[var(--ink-600)] mt-1">
            Ringkasan data penyaluran, status publikasi, dan verifikasi amanah donatur.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/infak/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-[var(--gold-400)]" />
            <span>Tambah Data Infak</span>
          </Link>
          <Link
            href="/admin/geber-masjid/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-[var(--gold-500)] text-[var(--green-950)] hover:brightness-105 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Geber Masjid</span>
          </Link>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--ink-600)] font-semibold uppercase tracking-wider">
              Total Mushaf
            </div>
            <div className="font-serif text-3xl font-bold text-[var(--ink-900)] mt-1">
              {totalMushaf.toLocaleString("id-ID")}
            </div>
            <div className="text-[11px] text-[var(--green-800)] font-medium mt-1">
              Dari {allInfak.length} riwayat serah terima
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--green-800)] text-[var(--gold-400)] flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--ink-600)] font-semibold uppercase tracking-wider">
              Masjid Dibersihkan
            </div>
            <div className="font-serif text-3xl font-bold text-[var(--ink-900)] mt-1">
              {totalMasjid}
            </div>
            <div className="text-[11px] text-[var(--teal-600)] font-medium mt-1">
              Aksi Geber Masjid pelosok
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--gold-500)] text-[var(--green-950)] flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--ink-600)] font-semibold uppercase tracking-wider">
              Draft Menunggu Publish
            </div>
            <div className="font-serif text-3xl font-bold text-[var(--terracotta-500)] mt-1">
              {totalDrafts}
            </div>
            <div className="text-[11px] text-[var(--ink-600)] font-medium mt-1">
              Belum tampil di publik
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--terracotta-500)]/20 text-[var(--terracotta-500)] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--ink-600)] font-semibold uppercase tracking-wider">
              Laporan Terbuka
            </div>
            <div className="font-serif text-3xl font-bold text-[var(--ink-900)] mt-1">
              {allReports.length}
            </div>
            <div className="text-[11px] text-[var(--green-700)] font-medium mt-1">
              Dokumen akuntabilitas publik
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--green-900)] text-[var(--cream-50)] flex items-center justify-center">
            <FileText className="w-6 h-6 text-[var(--gold-400)]" />
          </div>
        </div>
      </div>

      {/* 5 Recent Entries Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-[var(--ink-900)]">
              Entri Penyaluran Mushaf Terbaru
            </h2>
            <p className="text-xs text-[var(--ink-600)] mt-0.5">
              5 entri terakhir yang tercatat dalam basis data.
            </p>
          </div>
          <Link
            href="/admin/infak"
            className="text-xs font-bold text-[var(--green-800)] hover:text-[var(--gold-700)] flex items-center gap-1"
          >
            <span>Buka Seluruh Data Infak</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--green-950)] text-[var(--cream-50)] text-xs uppercase font-sans">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">No. Mushaf</th>
                <th className="py-3 px-4">Nama Donatur</th>
                <th className="py-3 px-4">Lembaga Penerima</th>
                <th className="py-3 px-4">Wilayah</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cream-200)]">
              {recentEntries.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--cream-50)] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[var(--green-800)]">
                    #{item.mushaf_no}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {item.donor_name}
                  </td>
                  <td className="py-3 px-4 font-serif font-bold">
                    {item.recipient_name}
                  </td>
                  <td className="py-3 px-4 text-xs text-[var(--ink-600)]">
                    {item.city}, {item.province}
                  </td>
                  <td className="py-3 px-4 text-xs text-[var(--ink-600)]">
                    {item.distributed_at}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.status === "published"
                          ? "bg-[var(--green-800)] text-[var(--gold-300)]"
                          : "bg-[var(--terracotta-500)]/20 text-[var(--terracotta-500)]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/infak/${item.id}`}
                      className="text-xs font-semibold text-[var(--green-800)] hover:text-[var(--gold-700)] underline"
                    >
                      Ubah
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

