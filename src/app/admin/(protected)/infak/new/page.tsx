"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  BookOpen,
  AlertCircle,
  Building2,
  Users,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import ImageUploader from "@/components/admin/ImageUploader";
import { uploadPendingFileOnSave } from "@/lib/upload-helper";
import { QURAN_SURAHS, getSuggestedJuz, validateAyatNumber } from "@/lib/quran-surahs";
import { cleanNumericString } from "@/lib/numeric-utils";
import { PROVINCES_38 } from "@/lib/provinces-38";
import { infakJinanSchema, formatZodError, formatHumanError } from "@/lib/validation/schemas";

interface SantriFormItem {
  id: string;
  name: string;
  phone: string;
  initial_surah_no: number;
  initial_ayat: string;
  initial_juz: string;
  is_juz_manual?: boolean;
  ayat_error?: string;
}

export default function AdminNewInfakPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Accordion open/close state
  const [openSections, setOpenSections] = useState({
    step1: true,
    step2: true,
    step3: true,
    step4: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const [formData, setFormData] = useState({
    mushaf_no: "",
    donor_name: "",
    show_donor_name: false,
    donor_origin: "",
    donor_phone: "",
    dedication_name: "",
    pesantren_name: "",
    pesantren_province: "",
    pesantren_city: "",
    address: "",
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
        initial_ayat: "7",
        initial_juz: "1",
        is_juz_manual: false,
        ayat_error: "",
      },
    ]);
  };

  const handleRemoveSantri = (id: string) => {
    setSantriList(santriList.filter((s) => s.id !== id));
  };

  const handleSantriTextChange = (
    id: string,
    field: "name" | "phone",
    value: string
  ) => {
    setSantriList(
      santriList.map((item) => {
        if (item.id !== id) return item;
        return { ...item, [field]: value };
      })
    );
  };

  const handleSantriSurahChange = (id: string, surahNo: number) => {
    setSantriList(
      santriList.map((item) => {
        if (item.id !== id) return item;
        let ayatErr = "";
        if (item.initial_ayat) {
          const val = validateAyatNumber(surahNo, item.initial_ayat);
          if (!val.valid) {
            ayatErr = val.message || "Ayat tidak valid";
          }
        }
        let juz = item.initial_juz;
        if (!item.is_juz_manual && item.initial_ayat && !ayatErr) {
          juz = getSuggestedJuz(surahNo, item.initial_ayat).toString();
        }
        return {
          ...item,
          initial_surah_no: surahNo,
          ayat_error: ayatErr,
          initial_juz: juz,
        };
      })
    );
  };

  const handleSantriAyatChange = (id: string, rawVal: string) => {
    const cleaned = cleanNumericString(rawVal, false);
    setSantriList(
      santriList.map((item) => {
        if (item.id !== id) return item;
        let ayatErr = "";
        if (cleaned) {
          const val = validateAyatNumber(item.initial_surah_no, cleaned);
          if (!val.valid) {
            ayatErr = val.message || "Ayat tidak valid";
          }
        }
        let juz = item.initial_juz;
        if (!item.is_juz_manual && cleaned && !ayatErr) {
          juz = getSuggestedJuz(item.initial_surah_no, cleaned).toString();
        }
        return {
          ...item,
          initial_ayat: cleaned,
          ayat_error: ayatErr,
          initial_juz: juz,
        };
      })
    );
  };

  const handleSantriJuzChange = (id: string, rawVal: string) => {
    const cleaned = cleanNumericString(rawVal, false);
    setSantriList(
      santriList.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          initial_juz: cleaned,
          is_juz_manual: true,
        };
      })
    );
  };

  const handleResetJuzAuto = (id: string) => {
    setSantriList(
      santriList.map((item) => {
        if (item.id !== id) return item;
        const autoJuz = getSuggestedJuz(
          item.initial_surah_no,
          item.initial_ayat || 1
        ).toString();
        return {
          ...item,
          initial_juz: autoJuz,
          is_juz_manual: false,
        };
      })
    );
  };

  const handleSubmitWithStatus = async (targetStatus: "published" | "draft") => {
    setLoading(true);
    setError(null);

    // Filter santri rows that have a name
    const activeSantri = santriList.filter((s) => s.name.trim().length > 0);

    // Validate active santri items
    for (let i = 0; i < activeSantri.length; i++) {
      const s = activeSantri[i];
      if (!s.initial_ayat) {
        setError(`Santri ${s.name}: Kolom ayat tidak boleh kosong.`);
        setLoading(false);
        return;
      }
      const val = validateAyatNumber(s.initial_surah_no, s.initial_ayat);
      if (!val.valid) {
        setError(`Santri ${s.name}: ${val.message}`);
        setLoading(false);
        return;
      }
    }

    // Client-side pre-validation
    const rawMushafNo = parseInt(formData.mushaf_no, 10);
    const candidatePayload = {
      ...formData,
      status: targetStatus,
      mushaf_no: isNaN(rawMushafNo) ? 0 : rawMushafNo,
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
          status: targetStatus,
          initial_surah_no: s.initial_surah_no,
          initial_surah_name: surah?.nameLatin || "Al-Fatihah",
          initial_ayat: parseInt(s.initial_ayat, 10) || 1,
          initial_juz: parseInt(s.initial_juz, 10) || 1,
        };
      }),
    };

    const clientValidation = infakJinanSchema.safeParse(candidatePayload);
    if (!clientValidation.success) {
      setOpenSections((prev) => ({
        ...prev,
        step1: true,
        step2: true,
      }));
      setError(formatZodError(clientValidation.error));
      setLoading(false);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
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
          ...candidatePayload,
          photos,
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
          ...candidatePayload,
          photos: [],
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
    } catch (err: unknown) {
      if (uploadRollback) {
        try {
          await uploadRollback();
        } catch (rollbackErr) {
          console.error("Gagal rollback file:", rollbackErr);
        }
      }
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menyimpan.");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--cream-200)]">
        <div>
          <Link
            href="/admin/infak"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-500)] hover:text-[var(--green-800)] mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Donasi</span>
          </Link>
          <h1 className="font-fraunces text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
            Input Donasi Mushaf Jinan
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-0.5">
            Lengkapi data pewakaf, pesantren tujuan, santri penerima manfaat, dan foto serah terima.
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 sm:p-5 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-900 shadow-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <p className="font-semibold text-red-950">
              Mohon lengkapi formulir sebelum menyimpan:
            </p>
            <div className="text-red-800 leading-relaxed space-y-1">
              {formatHumanError(error)
                .split(". ")
                .filter(Boolean)
                .map((msg, idx) => (
                  <p key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 inline-block" />
                    <span>{msg.replace(/\.$/, "")}</span>
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitWithStatus(formData.status);
        }}
        className="space-y-4"
      >
        {/* LANGKAH 1: IDENTITAS DONASI & DONATUR (ACCORDION) */}
        <div className="bg-white rounded-2xl border border-[var(--cream-200)] shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("step1")}
            className="w-full p-5 flex items-center justify-between text-left bg-[var(--cream-50)]/60 hover:bg-[var(--cream-100)]/80 transition-colors cursor-pointer border-b border-[var(--cream-200)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h2 className="font-fraunces text-base font-bold text-[var(--ink-900)] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--green-800)]" />
                  Identitas Donasi &amp; Pewakaf
                </h2>
                <p className="text-[11px] text-[var(--ink-500)]">
                  Nomor mushaf, nama custom cover, asal donatur, dan dedikasi.
                </p>
              </div>
            </div>
            {openSections.step1 ? (
              <ChevronUp className="w-4 h-4 text-[var(--ink-500)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--ink-500)]" />
            )}
          </button>

          {openSections.step1 && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                    Mushaf Ke- (Nomor Urut Unik) *
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    value={formData.mushaf_no}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mushaf_no: cleanNumericString(e.target.value, false),
                      })
                    }
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
                    Asal Donatur (Kota/Kabupaten) *
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
                    Nomor HP Donatur (ADMIN SAJA — Privasi Aman)
                  </label>
                  <Input
                    type="text"
                    value={formData.donor_phone}
                    onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value })}
                    placeholder="Contoh: 081234567890"
                  />
                  <p className="text-[10px] text-[var(--ink-500)] mt-1">
                    Nomor ini tidak pernah dikirim ke browser publik dan terenkripsi dalam database.
                  </p>
                </div>

                <div className="flex items-start gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="show_donor_name"
                    checked={formData.show_donor_name}
                    onChange={(e) => setFormData({ ...formData, show_donor_name: e.target.checked })}
                    className="w-4 h-4 rounded text-[var(--green-800)] focus:ring-[var(--gold-400)] cursor-pointer mt-0.5"
                  />
                  <label htmlFor="show_donor_name" className="text-xs text-[var(--ink-800)] cursor-pointer font-medium leading-relaxed">
                    Tampilkan nama donatur di halaman publik. (Bila tidak dicentang, sistem otomatis menampilkan &quot;Hamba Allah&quot; sesuai aturan privasi).
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
                  placeholder="Contoh: Alm. H. Ahmad Bin Abdullah & Keluarga"
                />
              </div>
            </div>
          )}
        </div>

        {/* LANGKAH 2: LEMBAGA & LOKASI PENYALURAN (ACCORDION) */}
        <div className="bg-white rounded-2xl border border-[var(--cream-200)] shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("step2")}
            className="w-full p-5 flex items-center justify-between text-left bg-[var(--cream-50)]/60 hover:bg-[var(--cream-100)]/80 transition-colors cursor-pointer border-b border-[var(--cream-200)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h2 className="font-fraunces text-base font-bold text-[var(--ink-900)] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[var(--green-800)]" />
                  Lembaga Penerima &amp; Lokasi Distribusi
                </h2>
                <p className="text-[11px] text-[var(--ink-500)]">
                  Nama pesantren, tanggal serah terima, alamat lengkap, dan Google Maps.
                </p>
              </div>
            </div>
            {openSections.step2 ? (
              <ChevronUp className="w-4 h-4 text-[var(--ink-500)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--ink-500)]" />
            )}
          </button>

          {openSections.step2 && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                    Nama Pesantren / Madrasah Penerima *
                  </label>
                  <Input
                    type="text"
                    required
                    list="pesantren-suggestions"
                    value={formData.pesantren_name}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matched = [
                        { name: "Pesantren Tahfidz Darul Qur'an Bogor", province: "Jawa Barat", city: "Bogor", address: "Jl. Raya Bogor No. 12, Bogor, Jawa Barat", maps: "https://maps.google.com" },
                        { name: "Pesantren Tahfidz Al-Hikmah", province: "Jawa Barat", city: "Bogor", address: "Jl. Pesantren No. 45, Bogor, Jawa Barat", maps: "" },
                        { name: "Madrasah Diniyah Nurul Iman", province: "Banten", city: "Serang", address: "Desa Ender, Serang, Banten", maps: "" },
                      ].find((p) => p.name.toLowerCase() === val.toLowerCase());

                      if (matched) {
                        setFormData({
                          ...formData,
                          pesantren_name: matched.name,
                          pesantren_province: matched.province,
                          pesantren_city: matched.city,
                          address: matched.address,
                          maps_url: matched.maps || formData.maps_url,
                        });
                      } else {
                        setFormData({ ...formData, pesantren_name: val });
                      }
                    }}
                    placeholder="Contoh: Pondok Pesantren Al-Hikmah"
                  />
                  <datalist id="pesantren-suggestions">
                    <option value="Pesantren Tahfidz Darul Qur'an Bogor" />
                    <option value="Pesantren Tahfidz Al-Hikmah" />
                    <option value="Madrasah Diniyah Nurul Iman" />
                  </datalist>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                    Provinsi Lembaga (Peta Sebaran) *
                  </label>
                  <Select
                    value={formData.pesantren_province || ""}
                    onChange={(e) => setFormData({ ...formData, pesantren_province: e.target.value })}
                    options={[
                      { value: "", label: "-- Pilih Provinsi (38 Provinsi) --" },
                      ...PROVINCES_38.map((p) => ({ value: p.name, label: p.name })),
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                    Kota / Kabupaten Lembaga
                  </label>
                  <Input
                    type="text"
                    value={formData.pesantren_city || ""}
                    onChange={(e) => setFormData({ ...formData, pesantren_city: e.target.value })}
                    placeholder="Contoh: Cirebon, Bogor"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                    Alamat Lengkap Lembaga
                  </label>
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Contoh: Jl. Pesantren No. 12"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                    Tautan Google Maps Lokasi
                  </label>
                  <Input
                    type="url"
                    value={formData.maps_url}
                    onChange={(e) => setFormData({ ...formData, maps_url: e.target.value })}
                    placeholder="https://maps.app.goo.gl/..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* LANGKAH 3: SANTRI PENERIMA MANFAAT (ACCORDION) */}
        <div className="bg-white rounded-2xl border border-[var(--cream-200)] shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("step3")}
            className="w-full p-5 flex items-center justify-between text-left bg-[var(--cream-50)]/60 hover:bg-[var(--cream-100)]/80 transition-colors cursor-pointer border-b border-[var(--cream-200)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h2 className="font-fraunces text-base font-bold text-[var(--ink-900)] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--green-800)]" />
                  Santri Binaan Penerima Manfaat ({santriList.length} Santri)
                </h2>
                <p className="text-[11px] text-[var(--ink-500)]">
                  Data santri penerima mushaf dan catatan hafalan awal terdaftar.
                </p>
              </div>
            </div>
            {openSections.step3 ? (
              <ChevronUp className="w-4 h-4 text-[var(--ink-500)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--ink-500)]" />
            )}
          </button>

          {openSections.step3 && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-2">
                <p className="text-xs text-[var(--ink-600)]">
                  Tambah santri yang menerima amanah mushaf ini. Setiap santri dapat diperbarui capaian hafalannya setiap bulan.
                </p>
                <button
                  type="button"
                  onClick={handleAddSantri}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--green-950)] text-[var(--gold-300)] text-xs font-semibold hover:bg-[var(--green-900)] transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Baris Santri</span>
                </button>
              </div>

              {santriList.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-[var(--cream-300)] rounded-xl bg-[var(--cream-50)]/50">
                  <Users className="w-8 h-8 mx-auto text-[var(--ink-400)] mb-2" />
                  <p className="text-xs font-medium text-[var(--ink-700)]">
                    Belum ada santri yang ditambahkan untuk donasi ini.
                  </p>
                  <p className="text-[11px] text-[var(--ink-500)] mt-0.5 mb-3">
                    Klik tombol di bawah untuk mendaftarkan santri penerima.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddSantri}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[var(--cream-300)] text-xs font-semibold text-[var(--green-950)] hover:bg-[var(--cream-100)] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[var(--green-800)]" />
                    <span>Tambah Santri Pertama</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {santriList.map((santri, index) => (
                    <div
                      key={santri.id}
                      className="p-4 rounded-xl border border-[var(--cream-200)] bg-[var(--cream-50)]/40 relative space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--green-950)] flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[var(--green-800)] text-[var(--cream-50)] flex items-center justify-center text-[10px]">
                            {index + 1}
                          </span>
                          Santri #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSantri(santri.id)}
                          className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[var(--ink-700)] mb-1">
                            Nama Santri *
                          </label>
                          <Input
                            type="text"
                            value={santri.name}
                            onChange={(e) => handleSantriTextChange(santri.id, "name", e.target.value)}
                            placeholder="Contoh: Muhammad Farhan"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[var(--ink-700)] mb-1">
                            No. HP Santri/Wali (ADMIN SAJA — Privasi Aman)
                          </label>
                          <Input
                            type="text"
                            value={santri.phone}
                            onChange={(e) => handleSantriTextChange(santri.id, "phone", e.target.value)}
                            placeholder="Contoh: 089876543210"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-[var(--ink-700)] mb-1">
                            Hafalan Awal: Surah
                          </label>
                          <Select
                            value={santri.initial_surah_no.toString()}
                            onChange={(e) => handleSantriSurahChange(santri.id, parseInt(e.target.value, 10))}
                            options={QURAN_SURAHS.map((surah) => ({
                              value: surah.number.toString(),
                              label: `${surah.number}. ${surah.nameLatin} (${surah.totalAyat} ayat)`,
                            }))}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[var(--ink-700)] mb-1">
                            Ayat Terakhir
                          </label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={santri.initial_ayat}
                            onChange={(e) => handleSantriAyatChange(santri.id, e.target.value)}
                            placeholder="Contoh: 7"
                            error={santri.ayat_error}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-semibold text-[var(--ink-700)]">
                              Juz Otomatis
                            </label>
                            {santri.is_juz_manual && (
                              <button
                                type="button"
                                onClick={() => handleResetJuzAuto(santri.id)}
                                className="text-[10px] text-[var(--gold-700)] hover:text-[var(--gold-800)] underline cursor-pointer"
                              >
                                Kembalikan otomatis
                              </button>
                            )}
                          </div>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={santri.initial_juz}
                            onChange={(e) => handleSantriJuzChange(santri.id, e.target.value)}
                            placeholder="Contoh: 1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* LANGKAH 4: DOKUMENTASI FOTO (ACCORDION) */}
        <div className="bg-white rounded-2xl border border-[var(--cream-200)] shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("step4")}
            className="w-full p-5 flex items-center justify-between text-left bg-[var(--cream-50)]/60 hover:bg-[var(--cream-100)]/80 transition-colors cursor-pointer border-b border-[var(--cream-200)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--green-950)] text-[var(--gold-400)] flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div>
                <h2 className="font-fraunces text-base font-bold text-[var(--ink-900)] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[var(--green-800)]" />
                  Dokumentasi Foto Serah Terima (Upload-on-Save)
                </h2>
                <p className="text-[11px] text-[var(--ink-500)]">
                  Foto serah terima mushaf. Otomatis dikompresi WebP dan di-dedup SHA-256.
                </p>
              </div>
            </div>
            {openSections.step4 ? (
              <ChevronUp className="w-4 h-4 text-[var(--ink-500)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--ink-500)]" />
            )}
          </button>

          {openSections.step4 && (
            <div className="p-6">
              <ImageUploader
                label="Foto Serah Terima Mushaf"
                file={selectedFile}
                onFileChange={(f: File | null) => setSelectedFile(f)}
                helperText="Upload foto serah terima mushaf. Otomatis dikompresi WebP."
              />
            </div>
          )}
        </div>

        {/* STICKY BOTTOM ACTION BAR (ARAH A) */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white/95 backdrop-blur-md border-t border-[var(--cream-200)] px-4 sm:px-8 py-3.5 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-[var(--ink-700)]">
            <span className="font-semibold text-[var(--green-950)] font-mono">
              {formData.mushaf_no ? `Mushaf #${formData.mushaf_no}` : "Mushaf Baru"}
            </span>
            <span className="text-[var(--cream-300)]">|</span>
            <span className="text-[var(--ink-600)]">
              {santriList.length} Santri Binaan
            </span>
            <span className="text-[var(--cream-300)]">|</span>
            <span className="text-[var(--ink-600)]">
              {selectedFile ? "1 Foto Siap Unggah" : "Tanpa Foto"}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Link
              href="/admin/infak"
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-[var(--ink-700)] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </Link>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmitWithStatus("draft")}
              className="px-4 py-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Simpan Sebagai Draft
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmitWithStatus("published")}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[var(--green-950)] text-white hover:bg-[var(--green-900)] text-xs font-semibold transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-[var(--gold-400)]" />
              <span>{loading ? "Menyimpan..." : "Terbitkan Sekarang"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
