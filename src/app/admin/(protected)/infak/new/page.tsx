"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, BookOpen, AlertCircle } from "lucide-react";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import ImageUploader from "@/components/admin/ImageUploader";
import { uploadPendingFileOnSave } from "@/lib/upload-helper";
import { QURAN_SURAHS, getSuggestedJuz, validateAyatNumber } from "@/lib/quran-surahs";

interface SantriFormItem {
  id: string;
  name: string;
  phone: string;
  initial_surah_no: number;
  initial_ayat: number;
  initial_juz: number;
}

export default function AdminNewInfakPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    mushaf_no: "",
    donor_name: "",
    show_donor_name: false,
    donor_origin: "Cirebon",
    donor_phone: "",
    dedication_name: "",
    pesantren_name: "Pondok Pesantren Madrasah Al-Huffazh 2 Gedongan",
    address: "Gedongan, Ender, Pangenan, Cirebon, Jawa Barat",
    distributed_at: new Date().toISOString().split("T")[0],
    maps_url: "",
    status: "published" as "published" | "draft",
  });

  const [santriList, setSantriList] = useState<SantriFormItem[]>([]);

  const handleAddSantri = () => {
    setSantriList([
      ...santriList,
      {
        id: `santri-${Date.now()}`,
        name: "",
        phone: "",
        initial_surah_no: 1,
        initial_ayat: 7,
        initial_juz: 1,
      },
    ]);
  };

  const handleRemoveSantri = (id: string) => {
    setSantriList(santriList.filter((s) => s.id !== id));
  };

  const handleSantriChange = (
    id: string,
    field: keyof SantriFormItem,
    value: string | number
  ) => {
    setSantriList(
      santriList.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        // Auto-suggest juz when surah or ayat changes
        if (field === "initial_surah_no" || field === "initial_ayat") {
          const sNo = field === "initial_surah_no" ? Number(value) : item.initial_surah_no;
          const ay = field === "initial_ayat" ? Number(value) : item.initial_ayat;
          updated.initial_juz = getSuggestedJuz(sNo, ay);
        }

        return updated;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Filter santri rows that have a name
    const activeSantri = santriList.filter((s) => s.name.trim().length > 0);

    // Validate active santri items
    for (let i = 0; i < activeSantri.length; i++) {
      const s = activeSantri[i];
      const val = validateAyatNumber(s.initial_surah_no, s.initial_ayat);
      if (!val.valid) {
        setError(`Santri ${s.name}: ${val.message}`);
        setLoading(false);
        return;
      }
    }

    let uploadRollback: (() => Promise<void>) | null = null;

    try {
      let photos: { url: string; caption?: string; sort: number }[] = [];

      if (selectedFile) {
        const { url, rollback, commit } = await uploadPendingFileOnSave(selectedFile);
        uploadRollback = rollback;
        if (url) {
          photos = [{ url, caption: `Serah Terima Mushaf #${formData.mushaf_no}`, sort: 1 }];
        }

        const payload = {
          ...formData,
          mushaf_no: parseInt(formData.mushaf_no, 10),
          donor_phone: formData.donor_phone || null,
          maps_url: formData.maps_url || null,
          photos,
          santri_list: activeSantri.map((s, idx) => {
            const surah = QURAN_SURAHS.find((q) => q.number === s.initial_surah_no);
            return {
              id: s.id,
              name: s.name,
              phone: s.phone || null,
              sort: idx + 1,
              status: formData.status,
              initial_surah_no: s.initial_surah_no,
              initial_surah_name: surah?.nameLatin || "Al-Fatihah",
              initial_ayat: s.initial_ayat,
              initial_juz: s.initial_juz,
            };
          }),
        };

        const res = await fetch("/api/admin/infak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal menyimpan donasi");
        }

        await commit();
      } else {
        const payload = {
          ...formData,
          mushaf_no: parseInt(formData.mushaf_no, 10),
          donor_phone: formData.donor_phone || null,
          maps_url: formData.maps_url || null,
          photos: [],
          santri_list: activeSantri.map((s, idx) => {
            const surah = QURAN_SURAHS.find((q) => q.number === s.initial_surah_no);
            return {
              id: s.id,
              name: s.name,
              phone: s.phone || null,
              sort: idx + 1,
              status: formData.status,
              initial_surah_no: s.initial_surah_no,
              initial_surah_name: surah?.nameLatin || "Al-Fatihah",
              initial_ayat: s.initial_ayat,
              initial_juz: s.initial_juz,
            };
          }),
        };

        const res = await fetch("/api/admin/infak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal menyimpan donasi");
        }
      }

      router.push("/admin/infak");
      router.refresh();
    } catch (err) {
      if (uploadRollback) {
        await uploadRollback();
      }
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--cream-200)]">
        <Link
          href="/admin/infak"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--ink-600)] hover:text-[var(--ink-900)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Donasi</span>
        </Link>
        <span className="text-xs text-[var(--ink-600)] font-medium">
          Form Penyaluran Dua Tingkat (Donasi &rarr; Santri)
        </span>
      </div>

      <div className="bg-[var(--cream-50)] rounded-3xl border border-[var(--cream-200)] p-6 sm:p-8 shadow-sm">
        <div className="border-b border-[var(--cream-200)] pb-4 mb-6">
          <h1 className="font-serif text-2xl font-bold text-[var(--green-950)]">
            Tambah Donasi Mushaf Baru
          </h1>
          <p className="text-xs text-[var(--ink-600)] mt-1">
            Input data donatur, dedikasi mushaf, serta daftar santri penerima manfaat.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* BAGIAN 1: DATA DONASI & DONATUR */}
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-[var(--green-950)] border-b border-[var(--cream-200)] pb-2">
              1. Identitas Donasi &amp; Pewakaf
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                  Mushaf Ke- (Unik) *
                </label>
                <Input
                  type="number"
                  required
                  min={1}
                  value={formData.mushaf_no}
                  onChange={(e) => setFormData({ ...formData, mushaf_no: e.target.value })}
                  placeholder="Contoh: 101"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                  Nama Donatur (Cover Mushaf) *
                </label>
                <Input
                  type="text"
                  required
                  value={formData.donor_name}
                  onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                  placeholder="Contoh: Inayah Binti Kartoni"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                  Asal Donatur (Kota/Wilayah) *
                </label>
                <Input
                  type="text"
                  required
                  value={formData.donor_origin}
                  onChange={(e) => setFormData({ ...formData, donor_origin: e.target.value })}
                  placeholder="Contoh: Cirebon, Jakarta"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                  Nomor HP Donatur (ADMIN SAJA - Privasi Aman)
                </label>
                <Input
                  type="text"
                  value={formData.donor_phone}
                  onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value })}
                  placeholder="Contoh: 081234567890"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="show_donor_name"
                  checked={formData.show_donor_name}
                  onChange={(e) => setFormData({ ...formData, show_donor_name: e.target.checked })}
                  className="w-4 h-4 rounded text-[var(--green-800)] focus:ring-[var(--gold-400)] cursor-pointer"
                />
                <label htmlFor="show_donor_name" className="text-xs text-[var(--ink-800)] cursor-pointer font-medium">
                  Tampilkan nama donatur di publik (bila tidak dicentang, tampil sebagai &quot;Hamba Allah&quot;)
                </label>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                Dedikasi Atas Nama *
              </label>
              <Input
                type="text"
                required
                value={formData.dedication_name}
                onChange={(e) => setFormData({ ...formData, dedication_name: e.target.value })}
                placeholder="Contoh: Alm. H. Ahmad Bin Abdullah &amp; Keluarga"
              />
            </div>
          </div>

          {/* BAGIAN 2: LEMBAGA & PENYALURAN */}
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-[var(--green-950)] border-b border-[var(--cream-200)] pb-2">
              2. Lembaga Penerima &amp; Lokasi Penyaluran
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                  Nama Pesantren / Madrasah Tujuan *
                </label>
                <Input
                  type="text"
                  required
                  value={formData.pesantren_name}
                  onChange={(e) => setFormData({ ...formData, pesantren_name: e.target.value })}
                  placeholder="Contoh: Pondok Pesantren Al-Hikmah"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                  Tanggal Penyaluran / Distribusi *
                </label>
                <Input
                  type="date"
                  required
                  value={formData.distributed_at}
                  onChange={(e) => setFormData({ ...formData, distributed_at: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                Alamat Lengkap Pesantren *
              </label>
              <Input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Contoh: Jl. Pesantren No. 12"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                  Tautan Google Maps Koordinat (Opsional)
                </label>
                <Input
                  type="url"
                  value={formData.maps_url}
                  onChange={(e) => setFormData({ ...formData, maps_url: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                  Status Publikasi *
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "published" | "draft" })}
                  options={[
                    { value: "published", label: "Published (Tampil di Publik)" },
                    { value: "draft", label: "Draft (Hanya Pengurus)" },
                  ]}
                />
              </div>
            </div>

            {/* Foto Dokumentasi (Upload-on-Save) */}
            <div className="pt-2">
              <ImageUploader
                label="Foto Serah Terima Dokumentasi (Upload-on-Save)"
                file={selectedFile}
                onFileChange={(file) => setSelectedFile(file)}
                helperText="Pilih foto dokumentasi serah-terima. Foto baru diunggah saat tombol Simpan ditekan (WebP ≤300KB)."
              />
            </div>
          </div>

          {/* BAGIAN 3: DAFTAR SANTRI PENERIMA (TWO-TIER) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--cream-200)] pb-2">
              <div>
                <h2 className="font-serif text-lg font-bold text-[var(--green-950)]">
                  3. Santri Penerima Mushaf ({santriList.length})
                </h2>
                <p className="text-xs text-[var(--ink-600)]">
                  Tambah santri yang menerima mushaf ini beserta hafalan awalnya.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSantri}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--green-900)] text-[var(--cream-50)] text-xs font-semibold hover:bg-[var(--green-800)] transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Santri</span>
              </button>
            </div>

            <div className="space-y-4">
              {santriList.map((santri, idx) => (
                <div
                  key={santri.id}
                  className="p-4 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-200)] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--green-900)] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[var(--gold-600)]" />
                      Santri #{idx + 1}
                    </span>
                    {santriList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSantri(santri.id)}
                        className="p-1 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                        title="Hapus Santri"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--ink-800)] mb-1">
                        Nama Santri *
                      </label>
                      <Input
                        type="text"
                        required
                        value={santri.name}
                        onChange={(e) => handleSantriChange(santri.id, "name", e.target.value)}
                        placeholder="Nama lengkap santri"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--ink-800)] mb-1">
                        Nomor HP Santri (ADMIN SAJA - Privasi Aman)
                      </label>
                      <Input
                        type="text"
                        value={santri.phone}
                        onChange={(e) => handleSantriChange(santri.id, "phone", e.target.value)}
                        placeholder="Nomor HP santri / wali"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--ink-800)] mb-1">
                        Surah Terkini *
                      </label>
                      <Select
                        value={santri.initial_surah_no.toString()}
                        onChange={(e) => handleSantriChange(santri.id, "initial_surah_no", parseInt(e.target.value, 10))}
                        options={QURAN_SURAHS.map((q) => ({
                          value: q.number.toString(),
                          label: `${q.number}. ${q.nameLatin} (${q.totalAyat} ayat)`,
                        }))}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--ink-800)] mb-1">
                        Ayat Terkini *
                      </label>
                      <Input
                        type="number"
                        min={1}
                        required
                        value={santri.initial_ayat}
                        onChange={(e) => handleSantriChange(santri.id, "initial_ayat", parseInt(e.target.value, 10) || 1)}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--ink-800)] mb-1">
                        Juz (Otomatis &bull; Bisa Edit) *
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        required
                        value={santri.initial_juz}
                        onChange={(e) => handleSantriChange(santri.id, "initial_juz", parseInt(e.target.value, 10) || 1)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--cream-200)] flex items-center justify-end gap-3">
            <Link
              href="/admin/infak"
              className="px-5 py-2.5 rounded-full text-xs font-semibold border border-[var(--cream-300)] text-[var(--ink-700)] hover:bg-[var(--cream-100)] transition-colors"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[var(--gold-400)]" />
              <span>{loading ? "Menyimpan Data..." : "Simpan Donasi &amp; Santri"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
