"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function HomeFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Bagaimana cara mencantumkan nama donatur atau keluarga pada cover Al-Qur'an?",
      a: "Setelah menentukan jumlah mushaf yang ingin Anda infakkan (Rp 200.000/mushaf), cantumkan nama pewakaf atau almarhum/almarhumah keluarga di formulir donasi atau konfirmasi WhatsApp. Tim percetakan resmi kami akan mencetak nama tersebut secara permanen pada cover mushaf standar Kementerian Agama RI.",
    },
    {
      q: "Apakah penyaluran Al-Qur'an dan aksi Geber Masjid benar-benar transparan?",
      a: "Ya. Setiap mushaf memiliki nomor seri tercatat dan aksi pembersihan masjid diverifikasi oleh pengurus DKM setempat. Data penyaluran dipublikasikan real-time di halaman Data Sebaran lengkap dengan tanggal, jumlah, dan foto berita acara serah terima.",
    },
    {
      q: "Dapatkah saya mengajukan masjid di lingkungan saya untuk dibersihkan oleh tim Geber Masjid?",
      a: "Tentu. Anda dapat mendaftarkan masjid atau musholla melalui tautan program Geber Masjid atau langsung menghubungi narahubung kami. Tim relawan akan melakukan verifikasi kebutuhan dan menjadwalkan aksi di akhir pekan bersama masyarakat setempat.",
    },
    {
      q: "Apakah beasiswa santri tahfidz dan Majlis Tasmi' 30 Juz dipungut biaya?",
      a: "Tidak. Seluruh santri binaan yang lolos seleksi mendapatkan beasiswa penuh (100% gratis) berupa biaya asrama, kitab, pembinaan adab huffazh, dan sertifikasi sanad resmi yang didanai dari program infak kafalah donatur.",
    },
    {
      q: "Ke mana dana infak saya ditransfer?",
      a: "Donasi disalurkan ke rekening bank resmi yayasan: Bank Syariah Indonesia (BSI) nomor 7283829102 dan Bank Mandiri nomor 1370029384721. Anda dapat menyalin nomor rekening dengan 1-klik di bagian donasi situs ini.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-[var(--cream-200)] bg-[var(--cream-100)] overflow-hidden transition-all duration-300 shadow-sm"
          >
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-[var(--ink-900)] hover:text-[var(--green-800)] transition-colors focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[var(--gold-700)] flex-shrink-0" />
                <span>{faq.q}</span>
              </span>
              <ChevronDown
                className={`w-5 h-5 text-[var(--ink-400)] transform transition-transform duration-300 flex-shrink-0 ${
                  isOpen ? "rotate-180 text-[var(--green-800)]" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-sm text-[var(--ink-600)] leading-relaxed border-t border-[var(--cream-200)] animate-in fade-in duration-200">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

