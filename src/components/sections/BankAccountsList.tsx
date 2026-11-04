"use client";

import { useState } from "react";
import { Copy, Check, Building2, Info } from "lucide-react";
import { BankAccount } from "@/lib/db/types";

export default function BankAccountsList({ initialAccounts }: { initialAccounts: BankAccount[] }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (num: string, idx: number) => {
    navigator.clipboard.writeText(num);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  if (!initialAccounts || initialAccounts.length === 0 || initialAccounts.every((a) => !a.number)) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[var(--green-950)] text-[var(--cream-50)] border border-[var(--gold-500)]/30 text-center shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-[var(--green-900)] text-[var(--gold-400)] flex items-center justify-center mx-auto mb-4 border border-[var(--gold-500)]/30">
          <Info className="w-6 h-6" />
        </div>
        <h4 className="font-serif text-xl font-bold text-[var(--cream-50)]">
          Informasi rekening segera diumumkan
        </h4>
        <p className="text-sm text-[var(--cream-200)]/80 mt-2 max-w-md mx-auto leading-relaxed">
          Bank BCA a.n. Yayasan Ajirasa Aksara Semesta. Penyaluran dan konfirmasi transfer infak saat ini dikoordinasikan langsung bersama pengurus yayasan melalui layanan WhatsApp atau email resmi demi transparansi pencatatan amanah.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {initialAccounts.map((acc, idx) => (
        <div
          key={idx}
          onClick={() => handleCopy(acc.number, idx)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleCopy(acc.number, idx)}
          className="group relative p-8 rounded-3xl bg-[var(--green-950)] text-[var(--cream-50)] border-2 border-[var(--gold-500)]/40 hover:border-[var(--gold-400)] shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="font-semibold text-sm text-[var(--gold-300)] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--gold-400)]" />
                {acc.bank}
              </span>
              {copiedIndex === idx ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--gold-400)] bg-[var(--green-900)] px-3 py-1 rounded-full border border-[var(--gold-500)]/40">
                  <Check className="w-3.5 h-3.5" />
                  Nomor Tersalin!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--sage-300)] group-hover:text-[var(--gold-300)]">
                  <Copy className="w-3.5 h-3.5" />
                  Klik Salin
                </span>
              )}
            </div>

            <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-wider text-[var(--cream-50)] my-3">
              {acc.number}
            </div>

            <div className="text-xs text-[var(--sage-300)] space-y-0.5">
              <p>Atas Nama: <span className="font-semibold text-[var(--cream-100)]">{acc.holder}</span></p>
              <p>Cabang: <span className="text-[var(--cream-200)]">{acc.branch}</span></p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--gold-500)]/20 text-right">
            <span className="text-[11px] uppercase tracking-wider text-[var(--gold-400)] font-semibold">
              Kanal Infaq Resmi Terdaftar
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
