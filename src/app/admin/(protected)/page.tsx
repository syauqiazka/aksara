import Link from "next/link";
import { db } from "@/lib/db/api";
import {
  BookOpen,
  Building2,
  Clock,
  PlusCircle,
  FileText,
  ArrowRight,
  Database,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

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
    <div className="space-y-6 sm:space-y-8">
      {/* Top Cockpit Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--cream-200)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--gold-700)] mb-1">
            <ShieldCheck className="w-4 h-4 text-[var(--green-700)]" />
            <span>Cockpit Pengurus Yayasan Sahabat Aksara</span>
          </div>
          <h1 className="font-fraunces text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
            Ringkasan Amanah &amp; Operasional
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-1">
            Pantau status verifikasi, draft penyaluran, dan akuntabilitas sebaran Al-Qur&apos;an secara real-time.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/infak/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-[var(--green-950)] text-white hover:bg-[var(--green-900)] transition-colors shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[var(--gold-400)]" />
            <span>Input Donasi Jinan</span>
          </Link>
          <Link
            href="/admin/geber-masjid/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-[var(--gold-500)] text-[var(--green-950)] hover:brightness-105 transition-colors shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Geber Masjid</span>
          </Link>
        </div>
      </div>

      {/* 4 Actionable KPI Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Mushaf */}
        <Link
          href="/admin/infak"
          className="p-5 rounded-2xl bg-white border border-[var(--cream-200)] hover:border-[var(--green-700)]/40 transition-colors shadow-xs flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--ink-500)] uppercase tracking-wider">
              Total Mushaf
            </span>
            <div className="w-9 h-9 rounded-xl bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-fraunces text-3xl font-bold text-[var(--ink-900)]">
              {totalMushaf.toLocaleString("id-ID")}
            </div>
            <div className="text-[11px] text-[var(--green-800)] font-medium mt-1 flex items-center justify-between">
              <span>{allInfak.length} entri serah terima</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </Link>

        {/* KPI 2: Draft Menunggu Publish */}
        <div
          className={`p-5 rounded-2xl border transition-colors flex flex-col justify-between ${
            totalDrafts > 0
              ? "bg-amber-50/60 border-amber-200"
              : "bg-white border-[var(--cream-200)]"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--ink-500)] uppercase tracking-wider">
              Draft Menunggu Publish
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                totalDrafts > 0
                  ? "bg-amber-600 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div
              className={`font-fraunces text-3xl font-bold ${
                totalDrafts > 0 ? "text-amber-800" : "text-[var(--ink-900)]"
              }`}
            >
              {totalDrafts}
            </div>
            <div className="text-[11px] text-[var(--ink-600)] font-medium mt-1">
              {totalDrafts > 0 ? "Perlu verifikasi pengurus" : "Semua data terbit"}
            </div>
          </div>
        </div>

        {/* KPI 3: Geber Masjid */}
        <Link
          href="/admin/geber-masjid"
          className="p-5 rounded-2xl bg-white border border-[var(--cream-200)] hover:border-[var(--green-700)]/40 transition-colors shadow-xs flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--ink-500)] uppercase tracking-wider">
              Geber Masjid
            </span>
            <div className="w-9 h-9 rounded-xl bg-[var(--gold-500)] text-[var(--green-950)] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-fraunces text-3xl font-bold text-[var(--ink-900)]">
              {totalMasjid}
            </div>
            <div className="text-[11px] text-[var(--ink-600)] font-medium mt-1 flex items-center justify-between">
              <span>Masjid pelosok dibersihkan</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </Link>

        {/* KPI 4: Laporan Penyaluran */}
        <Link
          href="/admin/laporan"
          className="p-5 rounded-2xl bg-white border border-[var(--cream-200)] hover:border-[var(--green-700)]/40 transition-colors shadow-xs flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--ink-500)] uppercase tracking-wider">
              Laporan Akuntabilitas
            </span>
            <div className="w-9 h-9 rounded-xl bg-[var(--green-900)] text-[var(--cream-50)] flex items-center justify-center">
              <FileText className="w-4 h-4 text-[var(--gold-400)]" />
            </div>
          </div>
          <div>
            <div className="font-fraunces text-3xl font-bold text-[var(--ink-900)]">
              {allReports.length}
            </div>
            <div className="text-[11px] text-[var(--green-800)] font-medium mt-1 flex items-center justify-between">
              <span>Dokumen terbuka publik</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Operations Strip */}
      <div className="p-4 rounded-xl bg-[var(--cream-100)] border border-[var(--cream-200)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[var(--ink-700)] font-medium">
          <Database className="w-4 h-4 text-[var(--green-800)]" />
          <span>Pemeliharaan Sistem &amp; File:</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/pengaturan/storage"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[var(--cream-200)] text-[var(--ink-800)] hover:text-[var(--green-800)] hover:border-[var(--green-800)] transition-colors font-medium cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span>Pembersih Storage (Orphan Files)</span>
          </Link>
          <Link
            href="/admin/pengaturan"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[var(--cream-200)] text-[var(--ink-800)] hover:text-[var(--green-800)] hover:border-[var(--green-800)] transition-colors font-medium cursor-pointer"
          >
            <span>Pengaturan Rekening &amp; Kontak</span>
          </Link>
        </div>
      </div>

      {/* 5 Entri Penyaluran Terakhir (High Density Table) */}
      <div className="bg-white rounded-2xl border border-[var(--cream-200)] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-fraunces text-lg font-bold text-[var(--ink-900)]">
              Entri Penyaluran Mushaf Terkini
            </h2>
            <p className="text-xs text-[var(--ink-500)] mt-0.5">
              5 entri terakhir yang tercatat dalam sistem yayasan.
            </p>
          </div>
          <Link
            href="/admin/infak"
            className="text-xs font-semibold text-[var(--green-800)] hover:text-[var(--gold-700)] flex items-center gap-1 cursor-pointer"
          >
            <span>Kelola Semua Donasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--green-950)] text-[var(--cream-100)] text-xs uppercase font-medium">
              <tr>
                <th className="py-3 px-4">Urutan Mushaf</th>
                <th className="py-3 px-4">Nama Donatur</th>
                <th className="py-3 px-4">Lembaga Penerima</th>
                <th className="py-3 px-4">Wilayah</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentEntries.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--cream-50)] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[var(--green-800)]">
                    Mushaf ke-{item.mushaf_no}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[var(--ink-900)]">
                    {item.donor_name}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[var(--ink-800)]">
                    {item.recipient_name}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[var(--ink-600)]">
                    {item.city}, {item.province}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[var(--ink-600)]">
                    {item.distributed_at}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                        item.status === "published"
                          ? "bg-[var(--green-100)] text-[var(--green-800)] border border-[var(--green-300)]"
                          : "bg-amber-50 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {item.status === "published" ? "Terbit" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/data-sebaran/infak-jinan/${item.id}`}
                        target="_blank"
                        className="text-xs text-slate-500 hover:text-[var(--green-800)] p-1 cursor-pointer"
                        title="Lihat Publik"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/infak/${item.id}`}
                        className="text-xs font-semibold text-[var(--green-800)] hover:text-[var(--gold-700)] underline underline-offset-2 cursor-pointer"
                      >
                        Ubah
                      </Link>
                    </div>
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
