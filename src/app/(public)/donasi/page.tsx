import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db/api";
import { Phone, Mail, ShieldCheck, ImageIcon, Calendar, ArrowRight, HeartHandshake } from "lucide-react";
import BankAccountsList from "@/components/sections/BankAccountsList";
import PageHeader from "@/components/ui/PageHeader";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Info Donasi & Rekening Resmi | Yayasan Sahabat Aksara",
  description:
    "Rekening resmi infak Yayasan Sahabat Aksara, konfirmasi donasi via WhatsApp, kampanye tanggap bencana tematik, dan panduan wakaf mushaf jariyah.",
  alternates: {
    canonical: "/donasi",
  },
  openGraph: {
    title: "Kanal Donasi & Rekening Resmi | Yayasan Sahabat Aksara",
    description:
      "Salurkan wakaf mushaf Al-Qur'an Jinan dan sedekah jariyah melalui rekening bank resmi Yayasan Ajirasa Aksara Semesta.",
    url: "/donasi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kanal Donasi & Rekening Resmi | Yayasan Sahabat Aksara",
    description: "Salurkan wakaf mushaf Al-Qur'an Jinan dan sedekah jariyah melalui rekening bank resmi.",
    images: ["/images/infak-mushaf-custom.jpg"],
  },
};

export default async function DonasiPage() {
  const [bankAccounts, campaigns, contact, gallery] = await Promise.all([
    db.getBankAccounts(),
    db.getThemedCampaigns(),
    db.getContactInfo(),
    db.getGalleryItems(),
  ]);

  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)]">
      {/* 1. PAGE HEADER RESMI */}
      <PageHeader
        eyebrow="Kanal Donasi &amp; Rekening Resmi"
        title="Salurkan Amal Jariyah untuk Sejuta Pahala Abadi"
        subtitle="Semua transaksi dikelola secara profesional, akuntabel, dan transparan. Konfirmasikan infak Anda agar dicatat pada nomor mushaf dan pelaporan resmi yayasan."
        breadcrumbs={[{ label: "Donasi" }]}
      />

      {/* 2. REKENING BANK RESMI & KONFIRMASI WHATSAPP */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-700)]">
            Kanal Transfer Bank Resmi
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] mt-2">
            Rekening Yayasan Terverifikasi
          </h2>
          <div className="w-16 h-1 bg-[var(--gold-600)] rounded-full mx-auto mt-4" />
          <p className="text-sm sm:text-base text-[var(--ink-600)] mt-4 leading-relaxed font-sans">
            Salin nomor rekening dengan satu klik untuk memudahkan transfer melalui ATM atau mobile banking Anda.
          </p>
        </div>

        {/* Client-side Bank Account List with Instant Copy */}
        <BankAccountsList initialAccounts={bankAccounts} />

        {/* WhatsApp Confirmation Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[var(--green-950)] text-[var(--cream-50)] border-2 border-[var(--gold-500)]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs uppercase tracking-wider text-[var(--gold-400)] font-semibold">
              Layanan Konfirmasi Cepat
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--cream-50)]">
              Sudah Melakukan Transfer Donasi?
            </h3>
            <p className="text-sm text-[var(--cream-200)]/90 max-w-xl leading-relaxed font-sans">
              Kirimkan bukti transfer dan cantumkan nama custom donatur / dedikasi keluarga yang ingin dicetak pada cover mushaf santri melalui layanan narahubung resmi.
            </p>
          </div>
          {contact.whatsapp ? (
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}?text=Assalamu'alaikum%20Sahabat%20Aksara,%20saya%20sudah%20melakukan%20transfer%20donasi...`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-sm sm:text-base bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-xl flex-shrink-0 transition-transform active:scale-95"
            >
              <Phone className="w-5 h-5 text-[var(--green-950)]" />
              <span>Konfirmasi via WhatsApp ({contact.whatsapp})</span>
            </a>
          ) : (
            <a
              href={`mailto:${contact.email}?subject=Konfirmasi%20Donasi%20Sahabat%20Aksara`}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-sm sm:text-base bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-xl flex-shrink-0"
            >
              <Mail className="w-5 h-5 text-[var(--green-950)]" />
              <span>Konfirmasi via Email</span>
            </a>
          )}
        </div>
      </section>

      {/* 3. DONASI TEMATIK KEBENCANAAN */}
      <section className="py-20 bg-[var(--cream-100)] px-4 sm:px-6 lg:px-8 border-y border-[var(--cream-200)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--cream-200)] pb-6">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--terracotta-500)] font-semibold">
                Tanggap Darurat Kemanusiaan
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] mt-2">
                Donasi Tematik Bencana Nusantara
              </h2>
            </div>
            <p className="text-sm text-[var(--ink-600)] max-w-md leading-relaxed font-sans">
              Aksi siaga darurat logistik, obat-obatan, dan sarana ibadah darurat bagi saudara-saudara kita yang tertimpa musibah di pelosok tanah air.
            </p>
          </div>

          {campaigns.length === 0 ? (
            <div className="p-16 rounded-3xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-center max-w-lg mx-auto space-y-3">
              <HeartHandshake className="w-12 h-12 text-[var(--ink-400)] opacity-40 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[var(--ink-900)]">
                Belum Ada Kampanye Tematik Aktif
              </h3>
              <p className="text-sm text-[var(--ink-600)] leading-relaxed font-sans">
                Saat ini seluruh alokasi diarahkan pada program reguler. Posko donasi tematik bencana akan dibuka segera saat terjadi situasi darurat di pelosok nusantara.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {campaigns.map((camp) => {
                const progress = Math.min(
                  Math.round((camp.collected_idr / (camp.target_idr || 1)) * 100),
                  100
                );
                return (
                  <div
                    key={camp.id}
                    className="bg-[var(--cream-50)] rounded-3xl p-6 sm:p-8 border border-[var(--cream-200)] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {camp.cover_url && (
                        <div className="relative aspect-16/9 rounded-2xl overflow-hidden border border-[var(--cream-200)] shadow-xs">
                          <Image
                            src={camp.cover_url}
                            alt={camp.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 550px"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--terracotta-500)]">
                          {camp.disaster_type}, {camp.location}
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

                      <h3 className="font-serif text-2xl font-bold text-[var(--ink-900)]">
                        {camp.title}
                      </h3>

                      <p className="text-sm text-[var(--ink-600)] leading-relaxed font-sans">
                        {camp.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-[var(--green-800)] font-mono">
                            Terkumpul: Rp {camp.collected_idr.toLocaleString("id-ID")}
                          </span>
                          <span className="text-[var(--ink-600)] font-mono">
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

                    <div className="pt-6">
                      <a
                        href={`https://wa.me/${contact.whatsapp ? contact.whatsapp.replace(/[^0-9]/g, "") : "6282262170018"}?text=Saya%20ingin%20berdonasi%20untuk%20kampanye:%20${encodeURIComponent(camp.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-full text-center text-xs font-bold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm block"
                      >
                        Salurkan Bantuan untuk Kampanye Ini
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. GALERI DOKUMENTASI PROGRAM RESMI */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[var(--cream-200)] pb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold-700)] font-semibold">
              Bukti Penyaluran Terverifikasi
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-900)] mt-2 [text-wrap:balance]">
              Dokumentasi Aksi Nyata di Lapangan
            </h2>
            <p className="text-sm text-[var(--ink-600)] max-w-xl mt-2 leading-relaxed font-sans">
              Rekam jejak visual serah terima mushaf Al-Qur&apos;an Jinan, kegiatan Geber Bersih Masjid, majlis tasmi&apos; 30 juz, serta penyaluran bantuan amanah para muhsinin.
            </p>
          </div>
          <Link
            href="/dokumentasi"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm flex-shrink-0"
          >
            <span>Buka Arsip Galeri Lengkap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {gallery.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] text-center max-w-md mx-auto space-y-3">
            <ImageIcon className="w-10 h-10 text-[var(--ink-400)] opacity-40 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[var(--ink-900)]">
              Belum Ada Foto Dokumentasi
            </h3>
            <p className="text-xs text-[var(--ink-600)]">
              Foto kegiatan serah terima sedang dalam kurasi berkala oleh pengurus yayasan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallery.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="group relative rounded-3xl overflow-hidden border border-[var(--cream-200)] bg-[var(--green-950)] aspect-[4/3] shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-950)]/90 via-[var(--green-950)]/25 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-[var(--cream-50)]">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold-400)] mb-1 flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.program} / {item.date}</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-[var(--cream-200)]/80 mt-1 line-clamp-2 font-sans">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. FIQIH & TRANSPARANSI PRIVASI DONASI */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        <div className="p-8 rounded-3xl bg-[var(--cream-100)] border border-[var(--gold-500)]/30 space-y-4">
          <div className="flex items-center gap-2.5 text-[var(--gold-700)] font-semibold text-sm">
            <ShieldCheck className="w-5 h-5 text-[var(--green-800)]" />
            <span>Kaidah Transparansi &amp; Fiqih Sedekah Jariyah</span>
          </div>
          <p className="text-sm text-[var(--ink-600)] leading-relaxed font-sans">
            Yayasan Sahabat Aksara menjunjung tinggi amanah donatur. Jika Anda menghendaki nama tidak ditampilkan pada tabel sebaran publik, sistem secara otomatis melabeli nama Anda sebagai <strong>&ldquo;Hamba Allah&rdquo;</strong>, namun nama dedikasi tetap tercetak penuh di sampul mushaf yang diterima oleh santri.
          </p>
        </div>

        {/* Mitra Resmi */}
        <div className="p-8 rounded-3xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-center space-y-2">
          <div className="text-xs uppercase tracking-widest text-[var(--gold-700)] font-semibold">
            Mitra Strategis Penyaluran
          </div>
          <h3 className="font-serif text-xl font-bold text-[var(--green-950)]">
            Madrasah Al-Huffazh Gedongan
          </h3>
          <p className="text-xs text-[var(--ink-600)] max-w-md mx-auto">
            Mitra pondok pesantren rujukan dalam pembinaan kader huffazh dan distribusi mushaf Al-Qur&apos;an.
          </p>
        </div>
      </section>
    </div>
  );
}
