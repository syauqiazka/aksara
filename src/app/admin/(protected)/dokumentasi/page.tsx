"use client";

import { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import Image from "next/image";
import { PlusCircle, Search, Trash2, Edit, Eye, EyeOff, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { GalleryItem } from "@/lib/db/types";
import ImageUploader from "@/components/admin/ImageUploader";
import { uploadPendingFileOnSave, deleteOldBlobAfterUpdate } from "@/lib/upload-helper";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: "",
    program: "Infak Al-Qur'an",
    date: new Date().toISOString().split("T")[0],
    image_url: "",
    caption: "",
    status: "published" as "published" | "draft",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch {
      setFeedback({ type: "error", message: "Gagal memuat galeri dokumentasi." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      program: "Infak Al-Qur'an",
      date: new Date().toISOString().split("T")[0],
      image_url: "",
      caption: "",
      status: "published",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      program: item.program,
      date: item.date,
      image_url: item.image_url,
      caption: item.caption || "",
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    let uploadRollback = null;

    try {
      let finalImg = formData.image_url;
      if (selectedFile) {
        const { url, rollback, commit } = await uploadPendingFileOnSave(selectedFile);
        uploadRollback = rollback;
        finalImg = url || formData.image_url;
      }

      const url = "/api/admin/gallery";
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem ? { id: editingItem.id, ...formData, image_url: finalImg } : { ...formData, image_url: finalImg };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Gagal menyimpan dokumentasi.");
      }

      if (editingItem && editingItem.image_url !== finalImg) {
        await deleteOldBlobAfterUpdate(editingItem.image_url, finalImg);
      }

      setFeedback({
        type: "success",
        message: editingItem
          ? `Dokumentasi "${formData.title}" berhasil diperbarui.`
          : `Dokumentasi "${formData.title}" berhasil ditambahkan.`,
      });
      setSelectedFile(null);
      closeModal();
      fetchData();
    } catch (err: unknown) {
      if (uploadRollback) await uploadRollback();
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: GalleryItem) => {
    const nextStatus = item.status === "published" ? "draft" : "published";
    try {
      await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, status: nextStatus }),
      });
      setFeedback({
        type: "success",
        message: `Status foto "${item.title}" diubah menjadi ${nextStatus}.`,
      });
      fetchData();
    } catch {
      setFeedback({ type: "error", message: "Gagal memperbarui status foto." });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus foto dokumentasi "${title}"?`)) return;
    try {
      await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      setFeedback({
        type: "success",
        message: `Foto "${title}" berhasil dihapus.`,
      });
      fetchData();
    } catch {
      setFeedback({ type: "error", message: "Gagal menghapus foto." });
    }
  };

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.program.toLowerCase().includes(search.toLowerCase()) ||
      (item.caption && item.caption.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--cream-200)]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
            Galeri Dokumentasi Program
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-1">
            Kelola arsip foto serah terima mushaf, majlis tasmi&apos;, dan kegiatan lapangan.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[var(--gold-500)] text-[var(--green-950)] hover:brightness-105 transition-all shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Dokumentasi</span>
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
          placeholder="Cari berdasarkan judul foto, program, atau keterangan..."
          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white border border-[var(--cream-200)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)]"
        />
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="text-center py-12 text-xs text-[var(--ink-500)]">
          Memuat galeri dokumentasi...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 p-8 border border-dashed border-[var(--cream-200)] rounded-3xl bg-[var(--cream-100)]/50 space-y-3">
          <ImageIcon className="w-10 h-10 mx-auto text-[var(--ink-400)]" />
          <p className="text-sm font-semibold text-[var(--ink-700)]">
            Belum ada foto dokumentasi.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[var(--gold-500)] text-[var(--green-950)]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Tambah Foto Perdana</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl overflow-hidden border border-[var(--cream-200)] bg-[var(--cream-100)] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-[var(--green-950)] overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${
                        item.status === "published"
                          ? "bg-[var(--green-800)] text-[var(--gold-300)]"
                          : "bg-amber-800 text-amber-100"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-700)] block">
                    {item.program} &bull; {item.date}
                  </span>
                  <h4 className="font-serif font-bold text-base text-[var(--ink-900)] leading-snug">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-xs text-[var(--ink-600)] line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-white/70 border-t border-[var(--cream-200)] flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleStatus(item)}
                  className="inline-flex items-center gap-1 text-[11px] text-[var(--ink-600)] hover:text-[var(--ink-900)]"
                  title={item.status === "published" ? "Ubah ke Draft" : "Publikasikan"}
                >
                  {item.status === "published" ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[var(--green-700)]" />
                      <span>Terbit</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                      <span>Draft</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-[var(--ink-600)] hover:text-[var(--gold-600)] rounded-lg hover:bg-[var(--cream-100)] transition-colors"
                    title="Edit Dokumentasi"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                    title="Hapus Dokumentasi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[var(--cream-200)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--cream-200)] mb-4">
              <h3 className="font-serif font-bold text-xl text-[var(--ink-900)]">
                {editingItem ? "Edit Foto Dokumentasi" : "Tambah Foto Dokumentasi"}
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
                  Judul Foto / Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Serah Terima Mushaf di Ponpes Al-Hikmah"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--cream-200)] focus:ring-2 focus:ring-[var(--gold-500)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Select
                    label="Nama Program"
                    required
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  >
                    <option value="Infak Al-Qur'an">{"Infak Al-Qur'an"}</option>
                    <option value="Geber Masjid">Geber Masjid</option>
                    <option value="Tasmi' Al-Qur'an">{"Tasmi' Al-Qur'an"}</option>
                    <option value="Pena Yatim">Pena Yatim</option>
                    <option value="Bela Berdikari">Bela Berdikari</option>
                    <option value="Bantuan Tanggap Bencana">Bantuan Tanggap Bencana</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-700)] mb-1">
                    Tanggal Kegiatan *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--cream-200)] focus:ring-2 focus:ring-[var(--gold-500)] focus:outline-none"
                  />
                </div>
              </div>

              <ImageUploader
                label="Foto Dokumentasi *"
                required
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                file={selectedFile}
                onFileChange={setSelectedFile}
                helperText="Upload foto dokumentasi resolusi tinggi. URL akan disimpan di Supabase."
              />

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-700)] mb-1">
                  Keterangan / Caption
                </label>
                <textarea
                  rows={3}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Ceritakan momen atau dokumentasi kegiatan ini..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--cream-200)] focus:ring-2 focus:ring-[var(--gold-500)] focus:outline-none"
                />
              </div>

              <div>
                <Select
                  label="Status Publikasi"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as "published" | "draft" })
                  }
                >
                  <option value="published">Publikasikan (Published)</option>
                  <option value="draft">Simpan Sebagai Draf (Draft)</option>
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
                  {submitting ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Tambah Dokumentasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
