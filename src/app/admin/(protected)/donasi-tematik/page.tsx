"use client";

import { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import { PlusCircle, Search, Trash2, Edit, X, HeartHandshake } from "lucide-react";
import { ThemedCampaign } from "@/lib/db/types";
import ImageUploader from "@/components/admin/ImageUploader";
import { cleanNumericString } from "@/lib/numeric-utils";

export default function AdminThemedCampaignsPage() {
  const [campaigns, setCampaigns] = useState<ThemedCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<ThemedCampaign | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    disaster_type: "Bencana Alam",
    location: "",
    status: "aktif" as "aktif" | "selesai",
    description: "",
    cover_url: "",
    target_idr: "",
    collected_idr: "0",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/campaigns");
      const data = await res.json();
      if (Array.isArray(data)) setCampaigns(data);
    } catch {
      setFeedback({ type: "error", message: "Gagal memuat kampanye donasi tematik." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingCampaign(null);
    setFormData({
      title: "",
      disaster_type: "Bencana Alam",
      location: "",
      status: "aktif",
      description: "",
      cover_url: "",
      target_idr: "",
      collected_idr: "0",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (camp: ThemedCampaign) => {
    setEditingCampaign(camp);
    setFormData({
      title: camp.title,
      disaster_type: camp.disaster_type,
      location: camp.location,
      status: camp.status,
      description: camp.description,
      cover_url: camp.cover_url || "",
      target_idr: camp.target_idr.toString(),
      collected_idr: camp.collected_idr.toString(),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCampaign(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const url = "/api/admin/campaigns";
      const method = editingCampaign ? "PUT" : "POST";
      const parsedPayload = {
        ...formData,
        target_idr: parseInt(formData.target_idr, 10) || 0,
        collected_idr: parseInt(formData.collected_idr, 10) || 0,
      };
      const body = editingCampaign ? { id: editingCampaign.id, ...parsedPayload } : parsedPayload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Gagal menyimpan kampanye.");
      }

      setFeedback({
        type: "success",
        message: editingCampaign
          ? `Kampanye "${formData.title}" berhasil diperbarui.`
          : `Kampanye "${formData.title}" berhasil ditambahkan.`,
      });
      closeModal();
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (camp: ThemedCampaign) => {
    const nextStatus = camp.status === "aktif" ? "selesai" : "aktif";
    try {
      await fetch("/api/admin/campaigns", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...camp, status: nextStatus }),
      });
      setFeedback({
        type: "success",
        message: `Status kampanye "${camp.title}" diubah menjadi ${nextStatus}.`,
      });
      fetchData();
    } catch {
      setFeedback({ type: "error", message: "Gagal memperbarui status kampanye." });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus kampanye donasi tematik "${title}"?`)) return;
    try {
      await fetch(`/api/admin/campaigns?id=${id}`, { method: "DELETE" });
      setFeedback({
        type: "success",
        message: `Kampanye "${title}" berhasil dihapus.`,
      });
      fetchData();
    } catch {
      setFeedback({ type: "error", message: "Gagal menghapus kampanye." });
    }
  };

  const filtered = campaigns.filter(
    (camp) =>
      camp.title.toLowerCase().includes(search.toLowerCase()) ||
      camp.location.toLowerCase().includes(search.toLowerCase()) ||
      camp.disaster_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--cream-200)]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
            Donasi Tematik (Tanggap Bencana)
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-1">
            Kelola kampanye aksi darurat gempa bumi, banjir bandang, erupsi, dan kemanusiaan.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[var(--gold-500)] text-[var(--green-950)] hover:brightness-105 transition-all shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Kampanye</span>
        </button>
      </div>

      {/* Feedback banner */}
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

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-400)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan nama kampanye, wilayah bencana, atau jenis tanggap darurat..."
          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white border border-[var(--cream-200)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)]"
        />
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="text-center py-12 text-xs text-[var(--ink-500)]">
          Memuat data kampanye donasi tematik...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 p-8 border border-dashed border-[var(--cream-200)] rounded-3xl bg-[var(--cream-100)]/50 space-y-3">
          <HeartHandshake className="w-10 h-10 mx-auto text-[var(--ink-400)]" />
          <p className="text-sm font-semibold text-[var(--ink-700)]">
            Belum ada kampanye tanggap bencana yang dibuat.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[var(--gold-500)] text-[var(--green-950)]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Tambah Kampanye Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((camp) => {
            const percentage =
              camp.target_idr > 0
                ? Math.min(100, Math.round((camp.collected_idr / camp.target_idr) * 100))
                : 0;

            return (
              <div
                key={camp.id}
                className="p-6 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--terracotta-500)]">
                      {camp.disaster_type}, {camp.location}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(camp)}
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition-all ${
                        camp.status === "aktif"
                          ? "bg-[var(--green-800)] text-[var(--gold-300)] hover:brightness-110"
                          : "bg-[var(--cream-200)] text-[var(--ink-600)] hover:bg-[var(--cream-300)]"
                      }`}
                      title="Klik untuk ubah status"
                    >
                      {camp.status === "aktif" ? "Aktif Berjalan" : "Selesai"}
                    </button>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[var(--ink-900)] leading-snug">
                    {camp.title}
                  </h3>

                  <p className="text-xs text-[var(--ink-600)] leading-relaxed line-clamp-3">
                    {camp.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-semibold text-[var(--ink-700)]">
                      <span>Terkumpul: Rp {camp.collected_idr.toLocaleString("id-ID")}</span>
                      <span>Target: Rp {camp.target_idr.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="w-full bg-[var(--cream-200)] rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[var(--gold-500)] h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-right text-[11px] font-bold text-[var(--gold-700)]">
                      {percentage}% Terpenuhi
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[var(--cream-200)] flex items-center justify-between">
                  <span className="text-[11px] text-[var(--ink-500)]">
                    Dibuat {camp.created_at ? new Date(camp.created_at).toLocaleDateString("id-ID") : "-"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(camp)}
                      className="p-1.5 text-[var(--ink-600)] hover:text-[var(--gold-600)] rounded-lg hover:bg-white transition-colors"
                      title="Edit Kampanye"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(camp.id, camp.title)}
                      className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                      title="Hapus Kampanye"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[var(--cream-200)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--cream-200)] mb-4">
              <h3 className="font-serif font-bold text-xl text-[var(--ink-900)]">
                {editingCampaign ? "Edit Kampanye Tanggap Bencana" : "Tambah Kampanye Tanggap Bencana"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-full hover:bg-[var(--cream-100)] text-[var(--ink-500)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-700)] mb-1">
                  Nama Kampanye *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Tanggap Gempa Bumi Cianjur & Bantuan Logistik Al-Qur'an"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--cream-200)] focus:ring-2 focus:ring-[var(--gold-500)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Select
                    label="Jenis Bencana"
                    required
                    value={formData.disaster_type}
                    onChange={(e) => setFormData({ ...formData, disaster_type: e.target.value })}
                  >
                    <option value="Gempa Bumi">Gempa Bumi</option>
                    <option value="Banjir Bandang">Banjir Bandang</option>
                    <option value="Erupsi Gunung Api">Erupsi Gunung Api</option>
                    <option value="Tanah Longsor">Tanah Longsor</option>
                    <option value="Kebakaran Hutan">Kebakaran Hutan</option>
                    <option value="Kemanusiaan / Darurat">Kemanusiaan / Darurat</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-700)] mb-1">
                    Lokasi Wilayah *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Contoh: Cianjur, Jawa Barat"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--cream-200)] focus:ring-2 focus:ring-[var(--gold-500)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-700)] mb-1">
                    Target Donasi (Rp) *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    value={formData.target_idr}
                    onChange={(e) =>
                      setFormData({ ...formData, target_idr: cleanNumericString(e.target.value, false) })
                    }
                    placeholder="Contoh: 50000000"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--cream-200)] focus:ring-2 focus:ring-[var(--gold-500)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-700)] mb-1">
                    Donasi Terkumpul (Rp)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.collected_idr}
                    onChange={(e) =>
                      setFormData({ ...formData, collected_idr: cleanNumericString(e.target.value, true) })
                    }
                    placeholder="Contoh: 0"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--cream-200)] focus:ring-2 focus:ring-[var(--gold-500)] focus:outline-none"
                  />
                </div>
              </div>

              <ImageUploader
                label="Foto Cover / Banner Kampanye (Opsional)"
                value={formData.cover_url}
                onChange={(url) => setFormData({ ...formData, cover_url: url })}
                helperText="Upload gambar aksi tanggap darurat yang menarik. Disimpan di Vercel Blob."
              />

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-700)] mb-1">
                  Deskripsi Tanggap Darurat *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan kebutuhan pengungsi, bantuan mushaf darurat, atau logistik..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--cream-200)] focus:ring-2 focus:ring-[var(--gold-500)] focus:outline-none"
                />
              </div>

              <div>
                <Select
                  label="Status Kampanye"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as "aktif" | "selesai" })
                  }
                >
                  <option value="aktif">Masih Aktif Menerima Donasi</option>
                  <option value="selesai">Selesai / Terpenuhi</option>
                </Select>
              </div>

              <div className="pt-3 border-t border-[var(--cream-200)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold rounded-full border border-[var(--cream-200)] text-[var(--ink-600)] hover:bg-[var(--cream-100)]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-full bg-[var(--gold-500)] text-[var(--green-950)] hover:brightness-105 disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : editingCampaign ? "Simpan Perubahan" : "Tambah Kampanye"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
