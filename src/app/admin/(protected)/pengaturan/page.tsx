"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/db/api";
import { BankAccount, ContactInfo } from "@/lib/db/types";
import { Save, CheckCircle2, HardDrive, ArrowRight } from "lucide-react";
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

  useEffect(() => {
    const load = async () => {
      const accounts = await db.getBankAccounts();
      const info = await db.getContactInfo();
      setBankAccounts(accounts);
      setContact(info);
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.updateContactInfo(contact);
    await db.updateBankAccounts(bankAccounts);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-4 border-b border-[var(--cream-200)]">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
          Pengaturan Situs Yayasan
        </h1>
        <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-1">
          Perbarui nomor rekening donasi resmi, kontak WhatsApp, dan alamat lembaga.
        </p>
      </div>

            {/* Storage Maintenance Card */}
      <div className="p-5 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[var(--green-900)] text-[var(--gold-400)] flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-[var(--ink-900)]">
              Penyimpanan & File Media
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
        <div className="p-4 rounded-2xl bg-[var(--green-800)]/15 border border-[var(--green-800)] text-xs text-[var(--green-800)] font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Pengaturan berhasil disimpan!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Contact info */}
        <div className="p-8 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] space-y-4">
          <h3 className="font-serif text-lg font-bold text-[var(--ink-900)]">
            Kontak & Layanan Donatur
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
                Email Resmi
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
          <h3 className="font-serif text-lg font-bold text-[var(--ink-900)]">
            Rekening Bank Resmi
          </h3>

          {bankAccounts.map((acc, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[var(--cream-50)] border border-[var(--cream-200)] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink-600)]">Nama Bank</label>
                  <input
                    type="text"
                    value={acc.bank}
                    onChange={(e) => {
                      const updated = [...bankAccounts];
                      updated[idx].bank = e.target.value;
                      setBankAccounts(updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--cream-100)] border border-[var(--cream-200)] text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink-600)]">Nomor Rekening</label>
                  <input
                    type="text"
                    value={acc.number}
                    onChange={(e) => {
                      const updated = [...bankAccounts];
                      updated[idx].number = e.target.value;
                      setBankAccounts(updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--cream-100)] border border-[var(--cream-200)] font-mono text-xs font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-600)]">Atas Nama Rekening</label>
                <input
                  type="text"
                  value={acc.holder}
                  onChange={(e) => {
                    const updated = [...bankAccounts];
                    updated[idx].holder = e.target.value;
                    setBankAccounts(updated);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--cream-100)] border border-[var(--cream-200)] text-xs"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-full text-xs font-semibold bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
}

