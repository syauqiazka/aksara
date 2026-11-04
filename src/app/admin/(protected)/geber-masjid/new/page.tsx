"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { uploadPendingFileOnSave } from "@/lib/upload-helper";

export default function AdminNewGeberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    mosque_name: "",
    province: "Jawa Barat",
    city: "Bekasi",
    district: "Bekasi Selatan",
    address: "",
    lat: "-6.2412",
    lng: "106.9984",
    activity_date: new Date().toISOString().split("T")[0],
    participants: "25",
    activity_notes: "",
    photo_url: "",
    status: "published",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let uploadRollback: (() => Promise<void>) | null = null;

    try {
      let finalPhotoUrl = formData.photo_url || null;

      if (selectedFile) {
        const { url, rollback, commit } = await uploadPendingFileOnSave(selectedFile);
        uploadRollback = rollback;
        finalPhotoUrl = url;

        const res = await fetch("/api/admin/geber", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            participants: parseInt(formData.participants, 10),
            lat: formData.lat ? parseFloat(formData.lat) : null,
            lng: formData.lng ? parseFloat(formData.lng) : null,
            activity_notes: formData.activity_notes || null,
            photo_urls: finalPhotoUrl ? [finalPhotoUrl] : [],
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal menyimpan data Geber Masjid");
        }

        await commit();
      } else {
        const res = await fetch("/api/admin/geber", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            participants: parseInt(formData.participants, 10),
            lat: formData.lat ? parseFloat(formData.lat) : null,
            lng: formData.lng ? parseFloat(formData.lng) : null,
            activity_notes: formData.activity_notes || null,
            photo_urls: finalPhotoUrl ? [finalPhotoUrl] : [],
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal menyimpan data Geber Masjid");
        }
      }

      router.push("/admin/geber-masjid");
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
          href="/admin/geber-masjid"
          className="p-2 rounded-xl bg-[var(--cream-100)] border border-[var(--cream-200)] hover:bg-[var(--cream-200)] text-[var(--ink-900)]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--ink-900)]">
            Tambah Aksi Geber Masjid Baru
          </h1>
          <p className="text-xs text-[var(--ink-600)] mt-0.5">
            Catat pembersihan karpet, fasilitas wudhu, dan jumlah relawan yang terlibat.
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
              type="number"
              required
              min="1"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>
        </div>

        <div>
          <ImageUploader
            label="Foto Dokumentasi Geber Masjid (Opsional)"
            value={formData.photo_url}
            onChange={(url) => setFormData({ ...formData, photo_url: url })}
            helperText="Upload foto aksi pembersihan atau sanitasi masjid. Disimpan di Vercel Blob."
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
            <span>{loading ? "Menyimpan..." : "Simpan Aksi Geber"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

