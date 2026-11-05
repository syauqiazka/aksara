"use client";

import { useState, useEffect } from "react";
import { BankAccount, ContactInfo } from "@/lib/db/types";
import {
  Save,
  CheckCircle2,
  HardDrive,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Plus,
  Trash2,
  Building2,
} from "lucide-react";
import Link from "next/link";

export default function AdminSettingsPage() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [contact, setContact] = useState<ContactInfo>({
    whatsapp: "",
    phone: "",
    email: "",
    address: "",
  });
  const [saved, setSaved] = useState(false);

  // Admin Account & Credentials State
  const [activeAdminEmail, setActiveAdminEmail] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [authSaving, setAuthSaving] = useState<boolean>(false);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.bankAccounts)) setBankAccounts(data.bankAccounts);
          if (data.contactInfo) setContact(data.contactInfo);
        }
      } catch (err) {
        console.error("Gagal memuat pengaturan:", err);
      }

      // Fetch active admin email
      try {
        const res = await fetch("/api/admin/auth/update-credentials");
        if (res.ok) {
          const data = await res.json();
          if (data.email) {
            setActiveAdminEmail(data.email);
            setNewEmail(data.email);
          }
        }
      } catch (err) {
        console.error("Failed to fetch admin email:", err);
      }
    };
    load();
  }, []);

  const handleAddBank = () => {
    setBankAccounts((prev) => [
      ...prev,
      {
        bank: "Bank BCA",
        number: "",
        holder: "Yayasan Ajirasa Aksara Semesta",
        branch: "Kantor Cabang",
      },
    ]);
  };

  const handleRemoveBank = (idx: number) => {
    setBankAccounts((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsFeedback(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bankAccounts, contactInfo: contact }),
      });
      if (res.ok) {
        setSaved(true);
        setSettingsFeedback({
          type: "success",
          message: "Daftar rekening bank dan informasi kontak resmi berhasil disimpan serta disinkronkan ke publik!",
        });
        setTimeout(() => setSaved(false), 3000);
      } else {
        const errData = await res.json().catch(() => ({}));
        setSettingsFeedback({
          type: "error",
          message: errData.error || "Gagal menyimpan pengaturan ke server.",
        });
      }
    } catch {
      setSettingsFeedback({
        type: "error",
        message: "Terjadi kesalahan jaringan saat menyimpan pengaturan.",
      });
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!currentPassword) {
      setAuthError("Harap masukkan kata sandi saat ini untuk konfirmasi keamanan.");
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setAuthError("Kata sandi baru minimal harus 8 karakter.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setAuthError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setAuthSaving(true);
    try {
      const res = await fetch("/api/admin/auth/update-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newEmail,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Gagal memperbarui kredensial.");
      } else {
        setAuthSuccess("Kredensial akun admin berhasil diperbarui!");
        setActiveAdminEmail(data.email || newEmail);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setAuthSuccess(null), 4000);
      }
    } catch {
      setAuthError("Terjadi gangguan jaringan. Silakan coba kembali.");
    } finally {
      setAuthSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="pb-4 border-b border-[var(--cream-200)]">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
          Pengaturan Situs Yayasan
        </h1>
        <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-1">
          Perbarui nomor rekening donasi resmi, kontak lembaga, dan kredensial akses admin.
        </p>
      </div>

      {/* 1. Kredensial & Keamanan Akun Admin */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--green-900)] text-[var(--gold-400)] flex items-center justify-center shrink-0 shadow-xs">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-[var(--ink-900)]">
              Kredensial &amp; Keamanan Akun Admin
            </h2>
            <p className="text-xs text-[var(--ink-600)]">
              Kelola alamat email login dan kata sandi pengurus yayasan.
            </p>
          </div>
        </div>

        {activeAdminEmail && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-xs text-[var(--ink-700)]">
            <ShieldCheck className="w-4 h-4 text-[var(--green-700)] shrink-0" />
            <span>Akun login aktif: </span>
            <strong className="text-[var(--green-900)] font-mono">{activeAdminEmail}</strong>
          </div>
        )}

        {authSuccess && (
          <div className="p-4 rounded-2xl bg-[var(--green-800)]/15 border border-[var(--green-800)] text-xs text-[var(--green-900)] font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[var(--green-800)] shrink-0" />
            <span>{authSuccess}</span>
          </div>
        )}

        {authError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateCredentials} className="space-y-4">
          <div>
            <label
              htmlFor="new-admin-email"
              className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-1 flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[var(--gold-700)]" />
              <span>Email Admin Baru</span>
            </label>
            <input
              id="new-admin-email"
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="admin@sahabataksara.id"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm font-medium focus:ring-2 focus:ring-[var(--gold-400)] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="current-admin-password"
              className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-1 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[var(--gold-700)]" />
              <span>Kata Sandi Saat Ini (Wajib untuk Verifikasi)</span>
            </label>
            <div className="relative">
              <input
                id="current-admin-password"
                type={showCurrentPassword ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama Anda"
                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm font-medium focus:ring-2 focus:ring-[var(--gold-400)] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-500)] hover:text-[var(--ink-800)] p-1 cursor-pointer"
                aria-label={showCurrentPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label
                htmlFor="new-admin-password"
                className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-1 flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-[var(--gold-700)]" />
                <span>Kata Sandi Baru (Opsional)</span>
              </label>
              <div className="relative">
                <input
                  id="new-admin-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 karakter (kosongkan jika tidak diubah)"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm font-medium focus:ring-2 focus:ring-[var(--gold-400)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-500)] hover:text-[var(--ink-800)] p-1 cursor-pointer"
                  aria-label={showNewPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-admin-password"
                className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-1 flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-[var(--gold-700)]" />
                <span>Konfirmasi Kata Sandi Baru</span>
              </label>
              <input
                id="confirm-admin-password"
                type={showNewPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                disabled={!newPassword}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm font-medium disabled:opacity-50 focus:ring-2 focus:ring-[var(--gold-400)] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={authSaving}
              className="px-6 py-2.5 rounded-full text-xs font-semibold bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              <KeyRound className="w-4 h-4" />
              <span>{authSaving ? "Menyimpan..." : "Perbarui Akun Admin"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* 2. Storage Maintenance Card */}
      <div className="p-5 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[var(--green-900)] text-[var(--gold-400)] flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-[var(--ink-900)]">
              Penyimpanan &amp; File Media
            </h3>
            <p className="text-xs text-[var(--ink-600)]">
              Pindai dan bersihkan file foto yatim yang tidak lagi terhubung ke data yayasan.
            </p>
          </div>
        </div>
        <Link
          href="/admin/pengaturan/storage"
          className="px-4 py-2 rounded-full border border-[var(--cream-300)] text-xs font-semibold text-[var(--ink-800)] hover:bg-[var(--cream-200)] transition-colors flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>Buka Pembersih Storage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-[var(--green-800)]/15 border border-[var(--green-800)] text-xs text-[var(--green-800)] font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Pengaturan situs berhasil disimpan!</span>
        </div>
      )}

      {/* 3. General Site Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Contact info */}
        <div className="p-8 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] space-y-4">
          <h3 className="font-serif text-lg font-bold text-[var(--ink-900)]">
            Kontak &amp; Layanan Donatur
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-1">
                WhatsApp Konfirmasi
              </label>
              <input
                type="text"
                value={contact.whatsapp}
                onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-1">
                Email Resmi Publik
              </label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--ink-900)] mb-1">
              Alamat Kantor Sekretariat
            </label>
            <input
              type="text"
              value={contact.address}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-sm"
            />
          </div>
        </div>

        {/* Bank accounts */}
        <div className="p-8 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--cream-200)] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[var(--gold-600)]" />
                <h3 className="font-serif text-lg font-bold text-[var(--ink-900)]">
                  Rekening Bank Resmi
                </h3>
              </div>
              <p className="text-xs text-[var(--ink-600)] mt-1">
                Kelola rekening yayasan untuk kanal donasi. Seluruh rekening aktif otomatis ditampilkan di halaman donasi publik.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddBank}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Rekening Bank</span>
            </button>
          </div>

          {bankAccounts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[var(--cream-50)] border border-dashed border-[var(--cream-300)] text-center space-y-2">
              <Building2 className="w-8 h-8 text-[var(--ink-400)] opacity-40 mx-auto" />
              <p className="text-xs font-medium text-[var(--ink-600)]">
                Belum ada rekening bank yang didaftarkan.
              </p>
              <button
                type="button"
                onClick={handleAddBank}
                className="text-xs font-bold text-[var(--green-800)] hover:text-[var(--gold-700)] inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambahkan Rekening Pertama</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bankAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[var(--cream-50)] border border-[var(--cream-200)] shadow-xs space-y-4 relative group"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--cream-200)]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[var(--green-950)] text-[var(--gold-300)] text-xs font-mono font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-[var(--ink-900)]">
                        {acc.bank ? acc.bank : `Rekening #${idx + 1}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBank(idx)}
                      title="Hapus rekening ini"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--terracotta-500)] hover:bg-[var(--terracotta-50)] hover:text-[var(--terracotta-600)] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`bank-name-${idx}`} className="block text-[11px] font-semibold text-[var(--ink-700)] mb-1">
                        Nama Bank
                      </label>
                      <input
                        id={`bank-name-${idx}`}
                        type="text"
                        placeholder="Contoh: Bank BCA, Bank BSI, Bank Mandiri"
                        value={acc.bank}
                        onChange={(e) => {
                          const updated = [...bankAccounts];
                          updated[idx].bank = e.target.value;
                          setBankAccounts(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--cream-100)] border border-[var(--cream-200)] text-xs font-medium focus:outline-hidden focus:border-[var(--green-700)] focus:ring-1 focus:ring-[var(--green-700)]"
                      />
                      {/* Bank Presets Pill */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {["Bank BCA", "Bank BSI", "Bank Mandiri", "Bank BRI", "Bank BNI", "Bank Muamalat"].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              const updated = [...bankAccounts];
                              updated[idx].bank = preset;
                              setBankAccounts(updated);
                            }}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--cream-200)]/60 text-[var(--ink-700)] hover:bg-[var(--gold-500)]/20 hover:text-[var(--gold-800)] transition-colors cursor-pointer"
                          >
                            {preset.replace("Bank ", "")}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor={`bank-number-${idx}`} className="block text-[11px] font-semibold text-[var(--ink-700)] mb-1">
                        Nomor Rekening
                      </label>
                      <input
                        id={`bank-number-${idx}`}
                        type="text"
                        placeholder="Contoh: 1234567890"
                        value={acc.number}
                        onChange={(e) => {
                          const updated = [...bankAccounts];
                          updated[idx].number = e.target.value;
                          setBankAccounts(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--cream-100)] border border-[var(--cream-200)] font-mono text-xs font-bold text-[var(--green-950)] focus:outline-hidden focus:border-[var(--green-700)] focus:ring-1 focus:ring-[var(--green-700)]"
                      />
                      <span className="text-[10px] text-[var(--ink-500)] mt-1 block">
                        Pastikan nomor rekening tepat agar donatur dapat menyalin dengan akurat.
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`bank-holder-${idx}`} className="block text-[11px] font-semibold text-[var(--ink-700)] mb-1">
                        Atas Nama Rekening
                      </label>
                      <input
                        id={`bank-holder-${idx}`}
                        type="text"
                        placeholder="Contoh: Yayasan Ajirasa Aksara Semesta"
                        value={acc.holder}
                        onChange={(e) => {
                          const updated = [...bankAccounts];
                          updated[idx].holder = e.target.value;
                          setBankAccounts(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--cream-100)] border border-[var(--cream-200)] text-xs focus:outline-hidden focus:border-[var(--green-700)] focus:ring-1 focus:ring-[var(--green-700)]"
                      />
                    </div>

                    <div>
                      <label htmlFor={`bank-branch-${idx}`} className="block text-[11px] font-semibold text-[var(--ink-700)] mb-1">
                        Kantor Cabang
                      </label>
                      <input
                        id={`bank-branch-${idx}`}
                        type="text"
                        placeholder="Contoh: KC Cirebon / Kantor Cabang"
                        value={acc.branch}
                        onChange={(e) => {
                          const updated = [...bankAccounts];
                          updated[idx].branch = e.target.value;
                          setBankAccounts(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--cream-100)] border border-[var(--cream-200)] text-xs focus:outline-hidden focus:border-[var(--green-700)] focus:ring-1 focus:ring-[var(--green-700)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {settingsFeedback && (
          <div
            className={`p-4 rounded-2xl flex items-start gap-3 border ${
              settingsFeedback.type === "success"
                ? "bg-[var(--green-900)] text-[var(--gold-300)] border-[var(--gold-500)]/40"
                : "bg-[var(--terracotta-50)] text-[var(--terracotta-700)] border-[var(--terracotta-200)]"
            }`}
          >
            {settingsFeedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-[var(--gold-400)] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[var(--terracotta-600)] shrink-0 mt-0.5" />
            )}
            <p className="text-xs font-semibold leading-relaxed">{settingsFeedback.message}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={settingsSaving}
            className="px-8 py-3 rounded-full text-xs font-semibold bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{settingsSaving ? "Menyimpan Pengaturan..." : "Simpan Semua Pengaturan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
