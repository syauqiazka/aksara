"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Select from "@/components/ui/Select";
import ImageUploader from "@/components/admin/ImageUploader";
import { uploadPendingFileOnSave } from "@/lib/upload-helper";

export default function AdminNewReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    program: "infak_alquran",
    period_start: "2026-05-01",
    period_end: "2026-05-31",
    summary: "",
    body: "",
    beneficiaries: "150",
    amount_idr: "30000000",
    cover_url: "/images/infak-mushaf-custom.jpg",
    status: "published",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let uploadRollback: (() => Promise<void>) | null = null;

    try {
      let finalCoverUrl = formData.cover_url || null;

      if (selectedFile) {
        const { url, rollback, commit } = await uploadPendingFileOnSave(selectedFile);
        uploadRollback = rollback;
        finalCoverUrl = url;

        const res = await fetch("/api/admin/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            cover_url: finalCoverUrl,
            beneficiaries: parseInt(formData.beneficiaries, 10),
            amount_idr: formData.amount_idr ? parseInt(formData.amount_idr, 10) : null,
            gallery_urls: [],
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal menyimpan laporan");
        }

        await commit();
      } else {
        const res = await fetch("/api/admin/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            cover_url: finalCoverUrl,
            beneficiaries: parseInt(formData.beneficiaries, 10),
            amount_idr: formData.amount_idr ? parseInt(formData.amount_idr, 10) : null,
            gallery_urls: [],
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal menyimpan laporan");
        }
      }

      router.push("/admin/laporan");
      router.refresh();
    } catch (err: unknown) {
      if (uploadRollback) {
        await uploadRollback();
      }
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/laporan"
          className="p-2 rounded-xl bg-[var(--cream-100)] border border-[var(--cream-200)] hover:bg-[var(--cream-200)] text-[var(--ink-900)]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--ink-900)]">
            Buat Dokumen Laporan Baru
          </h1>
          <p className="text-xs text-[var(--ink-600)] mt-0.5">
            Format laporan akuntabilitas terbuka program Sahabat Aksara.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[var(--danger)]/15 border border-[var(--danger)]/30 text-xs text-[var(--danger)] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
            Judul Laporan *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => {
              const val = e.target.value;
              const autoSlug = val
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
              setFormData({ ...formData, title: val, slug: autoSlug });
            }}
            placeholder="Contoh: Laporan Penyaluran 500 Mushaf Al-Qur'an Tahap 2"
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Slug URL (Otomatis) *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>

          <div>
            <Select
              label="Kategori Program"
              required
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
            >
              <option value="infak_jinan">Infak Al-Qur&apos;an Jinan</option>
              <option value="buss_quran">Program BUSS Al-Qur&apos;an</option>
              <option value="geber_masjid">Geber Masjid (Bersih Masjid)</option>
              <option value="tasmi">Majlis Tasmi&apos; 30 Juz Bil-Ghoib</option>
              <option value="yatim_berdikari">Program Yatim Berdikari</option>
              <option value="pelatihan_it">Beasiswa Pelatihan IT Mitra Produktif</option>
              <option value="umkm">Pembinaan &amp; Pemberdayaan UMKM</option>
              <option value="tematik">Bantuan Tematik Nusantara</option>
              <option value="infak_alquran">Infak Al-Qur&apos;an (Legacy)</option>
              <option value="pena_yatim">PENA Anak Yatim (Legacy)</option>
              <option value="bela_berdikari">Bela Berdikari (Legacy)</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Periode Awal *
            </label>
            <input
              type="date"
              required
              value={formData.period_start}
              onChange={(e) => setFormData({ ...formData, period_start: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Periode Akhir *
            </label>
            <input
              type="date"
              required
              value={formData.period_end}
              onChange={(e) => setFormData({ ...formData, period_end: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Jumlah Penerima Manfaat (Orang/Santri) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.beneficiaries}
              onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Total Anggaran Tersalurkan (Rupiah)
            </label>
            <input
              type="number"
              value={formData.amount_idr}
              onChange={(e) => setFormData({ ...formData, amount_idr: e.target.value })}
              placeholder="Contoh: 30000000"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>
        </div>

        <div>
          <ImageUploader
            label="Foto Sampul / Cover Laporan *"
            value={formData.cover_url}
            onChange={(url) => setFormData({ ...formData, cover_url: url })}
            helperText="Upload foto cover laporan kegiatan. Disimpan di Vercel Blob."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
            Ringkasan Eksekutif (Summary) *
          </label>
          <textarea
            rows={2}
            required
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="Ringkasan singkat hasil kegiatan penyaluran..."
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
            Isi Laporan Lengkap (Format Bebas / Markdown) *
          </label>
          <textarea
            rows={6}
            required
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            placeholder="Tuliskan detail kronologi, lembaga yang menerima manfaat, dan pertanggungjawaban dana..."
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)] font-sans"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--cream-200)]">
          <Link
            href="/admin/laporan"
            className="px-6 py-2.5 rounded-full text-xs font-semibold text-[var(--ink-600)] hover:bg-[var(--cream-200)]"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-full text-xs font-semibold bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Menyimpan..." : "Publikasikan Laporan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

