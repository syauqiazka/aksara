"use client";

import { useState } from "react";
import { Copy, Check, Building2, Info } from "lucide-react";
import { BankAccount } from "@/lib/db/types";

export default function BankAccountsList({ initialAccounts }: { initialAccounts: BankAccount[] }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (num: string, idx: number) => {
    if (!num) return;
    navigator.clipboard.writeText(num);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const validAccounts = (initialAccounts || []).filter(
    (a) => a && a.number && a.number.trim().length > 0
  );

  if (validAccounts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[var(--green-950)] text-[var(--cream-50)] border border-[var(--gold-500)]/30 text-center shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-[var(--green-900)] text-[var(--gold-400)] flex items-center justify-center mx-auto mb-4 border border-[var(--gold-500)]/30">
          <Info className="w-6 h-6" />
        </div>
        <h4 className="font-serif text-xl font-bold text-[var(--cream-50)]">
          Informasi rekening segera diumumkan
        </h4>
        <p className="text-sm text-[var(--cream-200)]/80 mt-2 max-w-md mx-auto leading-relaxed">
          Penyaluran dan konfirmasi transfer infak saat ini dikoordinasikan langsung bersama pengurus yayasan melalui layanan WhatsApp atau email resmi demi transparansi pencatatan amanah.
        </p>
      </div>
    );
  }

  // Tentukan lebar card secara dinamis:
  // - 1 rekening -> pas di tengah (center) dengan lebar proporsional
  // - 2 rekening -> berdampingan (side-by-side) di tablet/desktop
  // - 3+ rekening -> multi-kolom responsif dan tetap rata tengah (justify-center)
  const getCardWidthClass = (total: number) => {
    if (total === 1) {
      return "w-full max-w-md sm:max-w-lg";
    }
    if (total === 2) {
      return "w-full max-w-md md:w-[calc(50%-1rem)] lg:max-w-[450px]";
    }
    return "w-full max-w-md md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] lg:max-w-[390px]";
  };

  return (
    <div className="flex flex-wrap justify-center gap-6 lg:gap-8 max-w-6xl mx-auto w-full">
      {validAccounts.map((acc, idx) => (
        <div
          key={idx}
          onClick={() => handleCopy(acc.number, idx)}
          role="button"
          tabIndex={0}
          title="Klik untuk menyalin nomor rekening"
          aria-label={`Salin nomor rekening ${acc.bank} ${acc.number}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCopy(acc.number, idx);
            }
          }}
          className={`group relative p-6 sm:p-8 rounded-3xl bg-[var(--green-950)] text-[var(--cream-50)] border-2 border-[var(--gold-500)]/40 hover:border-[var(--gold-400)] shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between select-none ${getCardWidthClass(
            validAccounts.length
          )}`}
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="font-semibold text-sm sm:text-base text-[var(--gold-300)] flex items-center gap-2">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--gold-400)] flex-shrink-0" />
                <span className="truncate">{acc.bank}</span>
              </span>
              {copiedIndex === idx ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--gold-400)] bg-[var(--green-900)] px-3 py-1 rounded-full border border-[var(--gold-500)]/40 animate-in fade-in zoom-in-95 duration-200">
                  <Check className="w-3.5 h-3.5" />
                  Nomor Tersalin!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--sage-300)] group-hover:text-[var(--gold-300)] transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                  Klik Salin
                </span>
              )}
            </div>

            <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-wider text-[var(--cream-50)] my-3 break-all sm:break-normal">
              {acc.number}
            </div>

            <div className="text-xs sm:text-sm text-[var(--sage-300)] space-y-0.5">
              <p>
                Atas Nama: <span className="font-semibold text-[var(--cream-100)]">{acc.holder}</span>
              </p>
              {acc.branch ? (
                <p>
                  Cabang: <span className="text-[var(--cream-200)]">{acc.branch}</span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--gold-500)]/20 flex items-center justify-between text-[11px]">
            <span className="text-[var(--sage-300)] hidden sm:inline">Sentuh / klik untuk salin</span>
            <span className="uppercase tracking-wider text-[var(--gold-400)] font-semibold ml-auto">
              Kanal Infak Resmi Terdaftar
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
