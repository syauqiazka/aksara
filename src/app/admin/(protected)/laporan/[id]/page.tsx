"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, Loader2 } from "lucide-react";
import Select from "@/components/ui/Select";
import ImageUploader from "@/components/admin/ImageUploader";
import { uploadPendingFileOnSave, deleteOldBlobAfterUpdate } from "@/lib/upload-helper";
import { cleanNumericString } from "@/lib/numeric-utils";
import { Report } from "@/lib/db/types";

export default function AdminEditReportPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalCoverUrl, setOriginalCoverUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    program: "infak_alquran",
    period_start: "",
    period_end: "",
    summary: "",
    body: "",
    beneficiaries: "",
    amount_idr: "",
    cover_url: "",
    status: "published" as "published" | "draft",
  });

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?id=${id}`);
      if (!res.ok) {
        throw new Error("Gagal mengambil data laporan dari server");
      }
      const item: Report = await res.json();
      setOriginalCoverUrl(item.cover_url || null);
      setFormData({
        slug: item.slug || "",
        title: item.title || "",
        program: item.program || "infak_alquran",
        period_start: item.period_start ? String(item.period_start).split("T")[0] : "",
        period_end: item.period_end ? String(item.period_end).split("T")[0] : "",
        summary: item.summary || "",
        body: item.body || "",
        beneficiaries: item.beneficiaries !== null && item.beneficiaries !== undefined ? String(item.beneficiaries) : "",
        amount_idr: item.amount_idr !== null && item.amount_idr !== undefined ? String(item.amount_idr) : "",
        cover_url: item.cover_url || "",
        status: item.status,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat dokumen laporan");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    let uploadRollback: (() => Promise<void>) | null = null;

    try {
      let finalCoverUrl = formData.cover_url || null;

      if (selectedFile) {
        const { url, rollback, commit } = await uploadPendingFileOnSave(selectedFile);
        uploadRollback = rollback;
        finalCoverUrl = url;

        const res = await fetch("/api/admin/reports", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            ...formData,
            cover_url: finalCoverUrl,
            beneficiaries: parseInt(formData.beneficiaries || "0", 10),
            amount_idr: formData.amount_idr ? parseInt(formData.amount_idr, 10) : null,
            gallery_urls: [],
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal memperbarui laporan");
        }

        await commit();

        if (originalCoverUrl && originalCoverUrl !== finalCoverUrl) {
          await deleteOldBlobAfterUpdate(originalCoverUrl);
        }
      } else {
        const res = await fetch("/api/admin/reports", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            ...formData,
            cover_url: finalCoverUrl,
            beneficiaries: parseInt(formData.beneficiaries || "0", 10),
            amount_idr: formData.amount_idr ? parseInt(formData.amount_idr, 10) : null,
            gallery_urls: [],
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal memperbarui laporan");
        }

        if (originalCoverUrl && !finalCoverUrl) {
          await deleteOldBlobAfterUpdate(originalCoverUrl);
        }
      }

      router.push("/admin/laporan");
      router.refresh();
    } catch (err: unknown) {
      if (uploadRollback) {
        await uploadRollback();
      }
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-xs text-[var(--ink-400)] flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-[var(--green-800)]" />
        <span>Memuat dokumen laporan...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/laporan"
          className="p-2 rounded-xl bg-[var(--cream-100)] border border-[var(--cream-200)] hover:bg-[var(--cream-200)] text-[var(--ink-900)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--ink-900)]">
            Ubah Dokumen Laporan
          </h1>
          <p className="text-xs text-[var(--ink-600)] mt-0.5">
            Perbarui data akuntabilitas, ringkasan eksekutif, dan rincian penyaluran program.
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
              setFormData({ ...formData, title: val });
            }}
            placeholder="Contoh: Laporan Penyaluran 500 Mushaf Al-Qur'an Tahap 2"
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Slug URL *
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
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              value={formData.beneficiaries}
              onChange={(e) => setFormData({ ...formData, beneficiaries: cleanNumericString(e.target.value, true) })}
              placeholder="Contoh: 100"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Total Anggaran Tersalurkan (Rupiah)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.amount_idr}
              onChange={(e) => setFormData({ ...formData, amount_idr: cleanNumericString(e.target.value, false) })}
              placeholder="Contoh: 30000000"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
            Status Publikasi *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs text-[var(--ink-800)] cursor-pointer">
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === "published"}
                onChange={() => setFormData({ ...formData, status: "published" })}
                className="accent-[var(--green-800)]"
              />
              <span>Published (Tampil di Publik)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--ink-800)] cursor-pointer">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === "draft"}
                onChange={() => setFormData({ ...formData, status: "draft" })}
                className="accent-[var(--green-800)]"
              />
              <span>Draft (Hanya Admin)</span>
            </label>
          </div>
        </div>

        <div>
          <ImageUploader
            label="Foto Sampul / Cover Laporan *"
            value={formData.cover_url}
            onChange={(url) => setFormData({ ...formData, cover_url: url })}
            file={selectedFile}
            onFileChange={(f) => setSelectedFile(f)}
            helperText="Upload foto cover laporan kegiatan. Otomatis dikompresi WebP."
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
            className="px-6 py-2.5 rounded-full text-xs font-semibold text-[var(--ink-600)] hover:bg-[var(--cream-200)] transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full text-xs font-semibold bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan Perubahan..." : "Simpan Perubahan Laporan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

