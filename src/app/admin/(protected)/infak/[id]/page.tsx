"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminEditInfakPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    mushaf_no: "",
    donor_name: "",
    show_donor_name: false,
    recipient_name: "",
    recipient_type: "pesantren",
    province: "",
    city: "",
    district: "",
    lat: "",
    lng: "",
    distributed_at: "",
    quantity: "1",
    photo_url: "",
    notes: "",
    status: "published",
  });

  useEffect(() => {
    if (!id) return;
    const loadItem = async () => {
      try {
        const res = await fetch("/api/admin/infak");
        const list = await res.json();
        const found = list.find((item: { id: string }) => item.id === id);
        if (found) {
          setFormData({
            mushaf_no: found.mushaf_no.toString(),
            donor_name: found.donor_name,
            show_donor_name: Boolean(found.show_donor_name),
            recipient_name: found.recipient_name,
            recipient_type: found.recipient_type,
            province: found.province,
            city: found.city,
            district: found.district,
            lat: found.lat ? found.lat.toString() : "",
            lng: found.lng ? found.lng.toString() : "",
            distributed_at: found.distributed_at,
            quantity: found.quantity ? found.quantity.toString() : "1",
            photo_url: found.photo_url || "",
            notes: found.notes || "",
            status: found.status,
          });
        }
      } catch {
        setError("Gagal memuat data penyaluran");
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/infak", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...formData,
          mushaf_no: parseInt(formData.mushaf_no, 10),
          quantity: parseInt(formData.quantity, 10),
          lat: formData.lat ? parseFloat(formData.lat) : null,
          lng: formData.lng ? parseFloat(formData.lng) : null,
          photo_url: formData.photo_url || null,
          notes: formData.notes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui data");
      }

      router.push("/admin/infak");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[var(--ink-400)]">
        Memuat data...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/infak"
          className="p-2 rounded-xl bg-[var(--cream-100)] border border-[var(--cream-200)] hover:bg-[var(--cream-200)] text-[var(--ink-900)]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--ink-900)]">
            Ubah Data Penyaluran Mushaf #{formData.mushaf_no}
          </h1>
          <p className="text-xs text-[var(--ink-600)] mt-0.5">
            Perbarui detail donatur, lembaga penerima, atau status publikasi.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Nomor Urut Mushaf *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.mushaf_no}
              onChange={(e) => setFormData({ ...formData, mushaf_no: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Jumlah Mushaf *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
            Nama Donatur / Atas Nama (Cover Mushaf) *
          </label>
          <input
            type="text"
            required
            value={formData.donor_name}
            onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
          />
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)]">
          <input
            type="checkbox"
            id="show_donor"
            checked={formData.show_donor_name}
            onChange={(e) => setFormData({ ...formData, show_donor_name: e.target.checked })}
            className="w-4 h-4 text-[var(--green-800)] rounded"
          />
          <label htmlFor="show_donor" className="text-xs text-[var(--ink-900)] font-medium">
            Tampilkan nama donatur ke publik (bila tidak dicentang, akan tampil sebagai &quot;Hamba Allah&quot;)
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Lembaga Penerima *
            </label>
            <input
              type="text"
              required
              value={formData.recipient_name}
              onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Tipe Penerima *
            </label>
            <select
              value={formData.recipient_type}
              onChange={(e) => setFormData({ ...formData, recipient_type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            >
              <option value="pesantren">Pesantren</option>
              <option value="masjid">Masjid</option>
              <option value="madrasah">Madrasah</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
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
              Tanggal Penyaluran *
            </label>
            <input
              type="date"
              required
              value={formData.distributed_at}
              onChange={(e) => setFormData({ ...formData, distributed_at: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
              Status Publikasi *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            >
              <option value="published">Published (Tampil di Publik)</option>
              <option value="draft">Draft (Simpan Sementara)</option>
            </select>
          </div>
        </div>

        <div>
          <ImageUploader
            label="Foto Serah Terima / Dokumentasi (Opsional)"
            value={formData.photo_url}
            onChange={(url) => setFormData({ ...formData, photo_url: url })}
            helperText="Upload foto serah terima ke santri/pesantren. Disimpan di Vercel Blob."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-2">
            Catatan Lapangan & Penyerahan
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--cream-200)]">
          <Link
            href="/admin/infak"
            className="px-6 py-2.5 rounded-full text-xs font-semibold text-[var(--ink-600)] hover:bg-[var(--cream-200)]"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full text-xs font-semibold bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan Perubahan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

