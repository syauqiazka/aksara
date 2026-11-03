import Image from "next/image";
import { db } from "@/lib/db/api";
import { organizationContent } from "@/content/organization";
import {
  HeartHandshake,
  Sparkles,
  Copy,
  CheckCircle2,
  Phone,
  AlertTriangle,
  Building,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import BankAccountsList from "@/components/sections/BankAccountsList";

export const metadata = {
  title: "Info Donasi, Rekening & Dokumentasi Program",
  description:
    "Rekening resmi infak Yayasan Sahabat Aksara, konfirmasi donasi via WhatsApp, kampanye tanggap bencana tematik, dan galeri dokumentasi penyaluran.",
};

export default async function DonasiPage() {
  const bankAccounts = await db.getBankAccounts();
  const campaigns = await db.getThemedCampaigns();
  const gallery = await db.getGalleryItems();
  const contact = await db.getContactInfo();

  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)] pt-20">
      {/* 1. Hero Header */}
      <section className="relative py-20 bg-[var(--green-950)] text-[var(--cream-50)] px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-islamic-stars opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--green-900)] border border-[var(--gold-500)]/40 text-[var(--gold-300)] text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-[var(--gold-400)]" />
            <span>Kanal Donasi & Amanah Jariyah</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold [text-wrap:balance]">
            Salurkan Amal Jariyah untuk Sejuta Pahala Abadi
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[var(--cream-100)]/90 max-w-2xl mx-auto leading-relaxed">
            Semua transaksi dikelola secara profesional dan transparan. Konfirmasikan infak Anda agar dicatat pada nomor mushaf dan pelaporan resmi.
          </p>
        </div>
      </section>

      {/* 2. Rekening Resmi & Konfirmasi WhatsApp */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-700)]">
            Kanal Transfer Bank Resmi
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] mt-2">
            Rekening Yayasan Terverifikasi
          </h2>
          <p className="text-sm text-[var(--ink-600)] mt-2">
            Salin nomor rekening dengan satu klik untuk memudahkan transfer melalui mobile banking.
          </p>
        </div>

        {/* Client-side Bank Account List with Instant Copy */}
        <BankAccountsList initialAccounts={bankAccounts} />

        {/* WhatsApp Confirmation Banner */}
        <div className="mt-12 p-8 rounded-3xl bg-[var(--green-900)] text-[var(--cream-50)] border-2 border-[var(--gold-500)]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold text-[var(--cream-50)]">
              Sudah Melakukan Transfer Donasi?
            </h3>
            <p className="text-sm text-[var(--cream-100)]/90 max-w-xl">
              Konfirmasikan bukti transfer dan kirimkan nama custom yang ingin dicetak pada cover mushaf melalui kontak resmi layanan donatur kami.
            </p>
          </div>
          <a
            href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}?text=Assalamu'alaikum%20Sahabat%20Aksara,%20saya%20sudah%20melakukan%20transfer%20donasi...`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-lg flex-shrink-0"
          >
            <Phone className="w-5 h-5 text-[var(--green-950)]" />
            <span>Konfirmasi via WhatsApp</span>
          </a>
        </div>
      </section>

      {/* 3. Donasi Tematik (Tanggap Bencana) */}
      <section className="py-20 bg-[var(--cream-100)] px-4 sm:px-6 lg:px-8 border-y border-[var(--cream-200)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--terracotta-500)]">
                Tanggap Darurat Kemanusiaan
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] mt-2">
                Donasi Tematik Kebencanaan
              </h2>
            </div>
            <p className="text-sm text-[var(--ink-600)] max-w-md">
              Aksi siaga darurat logistik, obat-obatan, dan tempat bernaung bagi saudara-saudara kita yang tertimpa musibah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {campaigns.map((camp) => {
              const progress = Math.min(
                Math.round((camp.collected_idr / (camp.target_idr || 1)) * 100),
                100
              );
              return (
                <div
                  key={camp.id}
                  className="bg-[var(--cream-50)] rounded-3xl p-8 border border-[var(--cream-200)] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--terracotta-500)]">
                        {camp.disaster_type} &bull; {camp.location}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold ${
                          camp.status === "aktif"
                            ? "bg-[var(--green-800)] text-[var(--gold-300)]"
                            : "bg-[var(--cream-200)] text-[var(--ink-600)]"
                        }`}
                      >
                        {camp.status === "aktif" ? "Sedang Berjalan" : "Penyaluran Selesai"}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-[var(--ink-900)] mb-3">
                      {camp.title}
                    </h3>

                    <p className="text-sm text-[var(--ink-600)] leading-relaxed mb-6">
                      {camp.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[var(--green-800)]">
                          Terkumpul: Rp {camp.collected_idr.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[var(--ink-600)]">
                          Target: Rp {camp.target_idr.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[var(--cream-200)] overflow-hidden">
                        <div
                          className="h-full bg-gold-gradient rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-right text-[11px] font-bold text-[var(--gold-700)]">
                        {progress}% Terpenuhi
                      </div>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}?text=Saya%20ingin%20berdonasi%20untuk%20kampanye:%20${encodeURIComponent(camp.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-full text-center text-xs font-bold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm"
                  >
                    Salurkan Bantuan untuk Kampanye Ini
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Galeri Dokumentasi Program */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-700)]">
            Bukti Nyata Pengabdian
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] mt-2">
            Galeri Dokumentasi Program
          </h2>
          <p className="text-sm text-[var(--ink-600)] mt-2">
            Momen serah terima mushaf, majlis tasmi&apos;, dan kebersamaan bersama santri tahfidz di berbagai daerah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden border border-[var(--cream-200)] bg-[var(--green-950)] aspect-[4/3] shadow-md hover:shadow-2xl transition-all"
            >
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-950)]/90 via-[var(--green-950)]/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-[var(--cream-50)]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold-400)] mb-1">
                  {item.program} &bull; {item.date}
                </div>
                <h4 className="font-serif text-lg font-bold leading-snug">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-xs text-[var(--cream-200)]/80 mt-1 line-clamp-2">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

