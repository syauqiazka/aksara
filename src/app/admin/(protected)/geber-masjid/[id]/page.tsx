"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, Loader2 } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { uploadPendingFileOnSave, deleteOldBlobAfterUpdate } from "@/lib/upload-helper";
import { cleanNumericString } from "@/lib/numeric-utils";
import { GeberMasjidDistribution } from "@/lib/db/types";

export default function AdminEditGeberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPhotoUrl, setOriginalPhotoUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    mosque_name: "",
    province: "",
    city: "",
    district: "",
    address: "",
    lat: "",
    lng: "",
    activity_date: "",
    participants: "",
    activity_notes: "",
    photo_url: "",
    status: "published" as "published" | "draft",
  });

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/geber?id=${id}`);
      if (!res.ok) {
        throw new Error("Gagal mengambil data Geber Masjid dari server");
      }
      const item: GeberMasjidDistribution = await res.json();
      const existingPhoto = item.photo_urls && item.photo_urls.length > 0 ? item.photo_urls[0] : "";
      setOriginalPhotoUrl(existingPhoto || null);
      setFormData({
        mosque_name: item.mosque_name || "",
        province: item.province || "",
        city: item.city || "",
        district: item.district || "",
        address: item.address || "",
        lat: item.lat !== null && item.lat !== undefined ? String(item.lat) : "",
        lng: item.lng !== null && item.lng !== undefined ? String(item.lng) : "",
        activity_date: item.activity_date || "",
        participants: item.participants !== null && item.participants !== undefined ? String(item.participants) : "",
        activity_notes: item.activity_notes || "",
        photo_url: existingPhoto,
        status: item.status,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
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
      let finalPhotoUrl = formData.photo_url || null;

      if (selectedFile) {
        const { url, rollback, commit } = await uploadPendingFileOnSave(selectedFile);
        uploadRollback = rollback;
        finalPhotoUrl = url;

        const res = await fetch("/api/admin/geber", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            ...formData,
            participants: parseInt(formData.participants || "0", 10),
            lat: formData.lat ? parseFloat(formData.lat) : null,
            lng: formData.lng ? parseFloat(formData.lng) : null,
            activity_notes: formData.activity_notes || null,
            photo_urls: finalPhotoUrl ? [finalPhotoUrl] : [],
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal memperbarui data Geber Masjid");
        }

        await commit();

        if (originalPhotoUrl && originalPhotoUrl !== finalPhotoUrl) {
          await deleteOldBlobAfterUpdate(originalPhotoUrl);
        }
      } else {
        const res = await fetch("/api/admin/geber", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            ...formData,
            participants: parseInt(formData.participants || "0", 10),
            lat: formData.lat ? parseFloat(formData.lat) : null,
            lng: formData.lng ? parseFloat(formData.lng) : null,
            activity_notes: formData.activity_notes || null,
            photo_urls: finalPhotoUrl ? [finalPhotoUrl] : [],
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal memperbarui data Geber Masjid");
        }

        if (originalPhotoUrl && !finalPhotoUrl) {
          await deleteOldBlobAfterUpdate(originalPhotoUrl);
        }
      }

      router.push("/admin/geber-masjid");
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
        <span>Memuat data aksi Geber Masjid...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/geber-masjid"
          className="p-2 rounded-xl bg-[var(--cream-100)] border border-[var(--cream-200)] hover:bg-[var(--cream-200)] text-[var(--ink-900)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--ink-900)]">
            Ubah Data Geber Masjid
          </h1>
          <p className="text-xs text-[var(--ink-600)] mt-0.5">
            Perbarui informasi kegiatan, relawan, atau dokumentasi pembersihan masjid.
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
            Nama Masjid / Musholla *
          </label>
          <input
            type="text"
            required
            value={formData.mosque_name}
            onChange={(e) => setFormData({ ...formData, mosque_name: e.target.value })}
            placeholder="Contoh: Masjid Jami Al-Ikhlas"
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
            Alamat Lengkap *
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Contoh: Jl. Lapangan No. 12, RT 03/RW 05"
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Provinsi *
            </label>
            <input
              type="text"
              required
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              placeholder="Contoh: Jawa Barat"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Kota / Kabupaten *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Contoh: Bekasi"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Kecamatan *
            </label>
            <input
              type="text"
              required
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              placeholder="Contoh: Bekasi Selatan"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Tanggal Aksi *
            </label>
            <input
              type="date"
              required
              value={formData.activity_date}
              onChange={(e) => setFormData({ ...formData, activity_date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Jumlah Relawan yang Terjun *
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              placeholder="Contoh: 25"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: cleanNumericString(e.target.value, false) })}
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
            label="Foto Dokumentasi Geber Masjid (Opsional)"
            value={formData.photo_url}
            onChange={(url) => setFormData({ ...formData, photo_url: url })}
            file={selectedFile}
            onFileChange={(f) => setSelectedFile(f)}
            helperText="Upload foto aksi pembersihan atau sanitasi masjid. Otomatis dikompresi WebP."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
            Catatan Aksi & Pembersihan
          </label>
          <textarea
            rows={3}
            value={formData.activity_notes}
            onChange={(e) => setFormData({ ...formData, activity_notes: e.target.value })}
            placeholder="Pencucian karpet, pengecatan dinding, pembagian alat kebersihan..."
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--cream-200)]">
          <Link
            href="/admin/geber-masjid"
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
            <span>{saving ? "Menyimpan Perubahan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

