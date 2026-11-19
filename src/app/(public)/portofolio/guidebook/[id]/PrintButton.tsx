"use client";

import { Printer, Download } from "lucide-react";

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-medium border border-white/10 cursor-pointer"
        title="Cetak Dokumen"
      >
        <Printer className="w-3.5 h-3.5 text-[var(--gold-400)]" />
        <span>Cetak Dokumen</span>
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--gold-500)] hover:bg-[var(--gold-400)] text-[var(--green-950)] transition-colors text-xs font-bold cursor-pointer shadow-sm"
        title="Simpan / Unduh sebagai PDF"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Simpan PDF</span>
      </button>
    </div>
  );
}
