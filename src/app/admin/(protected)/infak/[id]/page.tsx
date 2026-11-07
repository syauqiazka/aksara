"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  AlertCircle,
  Copy,
} from "lucide-react";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { InfakJinanRecord, InfakJinanSantri } from "@/lib/db/types";
import { QURAN_SURAHS, getSuggestedJuz, validateAyatNumber } from "@/lib/quran-surahs";
import { cleanNumericString } from "@/lib/numeric-utils";
import { infakJinanSchema, formatZodError, formatHumanError } from "@/lib/validation/schemas";

export default function AdminEditInfakPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [record, setRecord] = useState<InfakJinanRecord | null>(null);

  const [formData, setFormData] = useState({
    mushaf_no: "",
    donor_name: "",
    show_donor_name: false,
    donor_origin: "",
    donor_phone: "",
    dedication_name: "",
    pesantren_name: "",
    address: "",
    distributed_at: "",
    maps_url: "",
    status: "published" as "published" | "draft",
  });

  // State untuk quick update hafalan santri
  const [selectedSantriId, setSelectedSantriId] = useState<string>("");
  const [updateDate, setUpdateDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [updateSurahNo, setUpdateSurahNo] = useState<number>(2);
  const [updateAyat, setUpdateAyat] = useState<string>("252");
  const [updateJuz, setUpdateJuz] = useState<string>("2");
  const [isJuzManual, setIsJuzManual] = useState<boolean>(false);
  const [ayatError, setAyatError] = useState<string>("");
  const [updateNotes, setUpdateNotes] = useState<string>("");

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/infak");
      const list: InfakJinanRecord[] = await res.json();
      const found = list.find((i) => i.id === id);
      if (found) {
        setRecord(found);
        setFormData({
          mushaf_no: found.mushaf_no.toString(),
          donor_name: found.donor_name,
          show_donor_name: Boolean(found.show_donor_name),
          donor_origin: found.donor_origin,
          donor_phone: found.donor_phone || "",
          dedication_name: found.dedication_name,
          pesantren_name: found.pesantren_name,
          address: found.address,
          distributed_at: found.distributed_at,
          maps_url: found.maps_url || "",
          status: found.status,
        });

        if (found.santri_list && found.santri_list.length > 0) {
          setSelectedSantriId(found.santri_list[0].id);
        }
      }
    } catch {
      setError("Gagal memuat detail data dari server");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSurahChange = (surahNo: number) => {
    setUpdateSurahNo(surahNo);
    let err = "";
    if (updateAyat) {
      const val = validateAyatNumber(surahNo, updateAyat);
      if (!val.valid) err = val.message || "Ayat tidak valid";
    }
    setAyatError(err);
    if (!isJuzManual && updateAyat && !err) {
      setUpdateJuz(getSuggestedJuz(surahNo, updateAyat).toString());
    }
  };

  const handleAyatChange = (raw: string) => {
    const cleaned = cleanNumericString(raw, false);
    setUpdateAyat(cleaned);
    let err = "";
    if (cleaned) {
      const val = validateAyatNumber(updateSurahNo, cleaned);
      if (!val.valid) err = val.message || "Ayat tidak valid";
    }
    setAyatError(err);
    if (!isJuzManual && cleaned && !err) {
      setUpdateJuz(getSuggestedJuz(updateSurahNo, cleaned).toString());
    }
  };

  const handleJuzChange = (raw: string) => {
    const cleaned = cleanNumericString(raw, false);
    setUpdateJuz(cleaned);
    setIsJuzManual(true);
  };

  const handleResetJuzAuto = () => {
    const auto = getSuggestedJuz(updateSurahNo, updateAyat || 1).toString();
    setUpdateJuz(auto);
    setIsJuzManual(false);
  };

  const handleCopyLastUpdate = (santri: InfakJinanSantri) => {
    if (santri.hafalan_updates && santri.hafalan_updates.length > 0) {
      const last = santri.hafalan_updates[santri.hafalan_updates.length - 1];
      setUpdateSurahNo(last.surah_no);
      setUpdateAyat(last.ayat.toString());
      setUpdateJuz(last.juz.toString());
      setIsJuzManual(false);
      setAyatError("");
      setUpdateNotes(last.notes || "");
      setSuccess(`Nilai terakhir santri "${santri.name}" disalin. Silakan sesuaikan ayat & tanggal.`);
    } else {
      setError("Belum ada riwayat sebelumnya untuk santri ini.");
    }
  };

  const handleSaveDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const rawMushafNo = parseInt(formData.mushaf_no, 10);
    const candidatePayload = {
      ...formData,
      mushaf_no: isNaN(rawMushafNo) ? 0 : rawMushafNo,
      donor_phone: formData.donor_phone || null,
      maps_url: formData.maps_url || null,
      photos: record?.photos || [],
      santri_list: record?.santri_list || [],
    };

    const clientValidation = infakJinanSchema.safeParse(candidatePayload);
    if (!clientValidation.success) {
      setError(formatZodError(clientValidation.error));
      setSaving(false);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    try {
      const res = await fetch("/api/admin/infak", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...candidatePayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui donasi");

      setSuccess("Data donasi berhasil diperbarui.");
      router.refresh();
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddHafalanUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const val = validateAyatNumber(updateSurahNo, updateAyat);
    if (!val.valid) {
      setError(val.message || "Ayat tidak valid");
      return;
    }

    try {
      const res = await fetch("/api/admin/infak/santri/hafalan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          santriId: selectedSantriId,
          updated_on: updateDate,
          surah_no: updateSurahNo,
          ayat: parseInt(updateAyat, 10) || 1,
          juz: parseInt(updateJuz, 10) || 1,
          notes: updateNotes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambah update hafalan");

      setSuccess("Update hafalan bulanan santri berhasil disimpan.");
      setUpdateNotes("");
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah update hafalan");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-xs text-[var(--ink-500)]">
        Memuat detail donasi mushaf...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--cream-200)]">
        <Link
          href="/admin/infak"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--ink-600)] hover:text-[var(--ink-900)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Donasi</span>
        </Link>
        <span className="text-xs font-mono font-bold text-[var(--green-900)]">
          Mushaf #{formData.mushaf_no}
        </span>
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

      {success && (
        <div
          role="status"
          className="p-4 rounded-xl bg-[var(--green-50)] border border-[var(--green-200)] text-xs text-[var(--green-900)] font-medium"
        >
          {success}
        </div>
      )}

      {/* FORM 1: EDIT DONASI */}
      <div className="bg-[var(--cream-50)] rounded-3xl border border-[var(--cream-200)] p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--green-950)]">
            Edit Data Donasi Mushaf #{formData.mushaf_no}
          </h1>
          <p className="text-xs text-[var(--ink-600)] mt-1">
            Ubah identitas pewakaf, pesantren tujuan, dedikasi, atau status publikasi.
          </p>
        </div>

        <form onSubmit={handleSaveDonation} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                Mushaf Ke- *
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
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                Nama Donatur *
              </label>
              <Input
                type="text"
                required
                value={formData.donor_name}
                onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                Asal Wilayah *
              </label>
              <Input
                type="text"
                required
                value={formData.donor_origin}
                onChange={(e) => setFormData({ ...formData, donor_origin: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                Nomor HP Donatur (ADMIN SAJA)
              </label>
              <Input
                type="text"
                value={formData.donor_phone}
                onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="show_name"
                checked={formData.show_donor_name}
                onChange={(e) => setFormData({ ...formData, show_donor_name: e.target.checked })}
                className="w-4 h-4 rounded text-[var(--green-800)] cursor-pointer"
              />
              <label htmlFor="show_name" className="text-xs text-[var(--ink-800)] cursor-pointer">
                Tampilkan nama donatur di publik (bukan &quot;Hamba Allah&quot;)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
              Dedikasi Atas Nama *
            </label>
            <Input
              type="text"
              required
              value={formData.dedication_name}
              onChange={(e) => setFormData({ ...formData, dedication_name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                Pesantren Tujuan *
              </label>
              <Input
                type="text"
                required
                value={formData.pesantren_name}
                onChange={(e) => setFormData({ ...formData, pesantren_name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                Tanggal Penyaluran *
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
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                Tautan Google Maps
              </label>
              <Input
                type="url"
                value={formData.maps_url}
                onChange={(e) => setFormData({ ...formData, maps_url: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                Status *
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "published" | "draft" })}
                options={[
                  { value: "published", label: "Published" },
                  { value: "draft", label: "Draft" },
                ]}
              />
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[var(--gold-400)]" />
              <span>{saving ? "Menyimpan..." : "Simpan Perubahan Donasi"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* FORM 2: QUICK UPDATE PROGRES HAFALAN SANTRI */}
      <div className="bg-[var(--cream-50)] rounded-3xl border border-[var(--cream-200)] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-[var(--cream-200)] pb-4">
          <h2 className="font-serif text-xl font-bold text-[var(--green-950)]">
            Input Pembaruan Hafalan Santri Bulanan
          </h2>
          <p className="text-xs text-[var(--ink-600)] mt-1">
            Tambah catatan capaian surah &amp; ayat baru untuk santri penerima mushaf ini.
          </p>
        </div>

        {record?.santri_list && record.santri_list.length > 0 ? (
          <form onSubmit={handleAddHafalanUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                  Pilih Santri *
                </label>
                <Select
                  value={selectedSantriId}
                  onChange={(e) => setSelectedSantriId(e.target.value)}
                  options={record.santri_list.map((s) => ({
                    value: s.id,
                    label: `${s.name} (Hafalan Terakhir: ${s.latest_surah || "-"})`,
                  }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                  Tanggal Pembaruan *
                </label>
                <Input
                  type="date"
                  required
                  value={updateDate}
                  onChange={(e) => setUpdateDate(e.target.value)}
                />
              </div>
            </div>

            {/* Quick button Salin update bulan lalu */}
            {selectedSantriId && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const s = record.santri_list.find((x) => x.id === selectedSantriId);
                    if (s) handleCopyLastUpdate(s);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[var(--cream-300)] bg-[var(--cream-100)] text-[var(--ink-800)] text-[11px] font-semibold hover:bg-[var(--cream-200)] transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-[var(--gold-700)]" />
                  <span>Salin update bulan lalu</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                  Surah Terkini *
                </label>
                <Select
                  value={updateSurahNo.toString()}
                  onChange={(e) => handleSurahChange(parseInt(e.target.value, 10))}
                  options={QURAN_SURAHS.map((q) => ({
                    value: q.number.toString(),
                    label: `${q.number}. ${q.nameLatin} (${q.totalAyat} ayat)`,
                  }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                  Ayat Terkini *
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={updateAyat}
                  onChange={(e) => handleAyatChange(e.target.value)}
                  placeholder="Contoh: 7"
                  error={ayatError}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[var(--ink-800)]">
                    Juz (Otomatis, Bisa Diedit) *
                  </label>
                  {isJuzManual && (
                    <button
                      type="button"
                      onClick={handleResetJuzAuto}
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
                  required
                  value={updateJuz}
                  onChange={(e) => handleJuzChange(e.target.value)}
                  placeholder="Contoh: 1"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-800)] mb-1">
                Catatan Pengasuh (Opsional)
              </label>
              <Input
                type="text"
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
                placeholder="Misal: Ujian tasmi' mutqin juz 2, tajwid lancar"
              />
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[var(--green-900)] text-[var(--cream-50)] hover:bg-[var(--green-800)] transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 text-[var(--gold-400)]" />
                <span>Simpan Update Hafalan</span>
              </button>
            </div>
          </form>
        ) : (
          <p className="text-xs text-[var(--ink-600)] italic">
            Donasi ini belum memiliki santri penerima.
          </p>
        )}

        {/* Tabel Santri Saat Ini */}
        {record?.santri_list && record.santri_list.length > 0 && (
          <div className="pt-6 border-t border-[var(--cream-200)] space-y-3">
            <h3 className="font-serif text-sm font-bold text-[var(--ink-900)]">
              Riwayat Santri Terdaftar Pada Mushaf #{formData.mushaf_no}
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-[var(--cream-200)] bg-[var(--cream-50)]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--green-950)] text-[var(--cream-50)] text-[11px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">No.</th>
                    <th className="py-2.5 px-4">Nama Santri</th>
                    <th className="py-2.5 px-3">HP (Admin)</th>
                    <th className="py-2.5 px-4">Surat &amp; Ayat</th>
                    <th className="py-2.5 px-3">Juz</th>
                    <th className="py-2.5 px-3 text-center">Total Riwayat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--cream-200)]">
                  {record.santri_list.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-[var(--cream-100)]">
                      <td className="py-3 px-3 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-[var(--green-950)]">{s.name}</td>
                      <td className="py-3 px-3 font-mono text-[var(--ink-600)]">{s.phone || "-"}</td>
                      <td className="py-3 px-4 font-medium">{s.latest_surah || "-"} {s.latest_ayat ? `(${s.latest_ayat})` : ""}</td>
                      <td className="py-3 px-3 font-bold text-[var(--gold-700)]">Juz {s.latest_juz || "-"}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-[var(--cream-200)] text-[var(--ink-700)] font-bold text-[10px]">
                          {s.hafalan_updates?.length || 0} catatan
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
