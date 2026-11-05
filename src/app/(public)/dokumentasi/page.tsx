import Image from "next/image";
import { db } from "@/lib/db/api";
import PageHeader from "@/components/ui/PageHeader";
import { ImageIcon, Calendar } from "lucide-react";

export const metadata = {
  title: "Galeri Dokumentasi Program | Yayasan Sahabat Aksara",
  description:
    "Arsip dokumentasi visual serah terima mushaf Al-Qur'an, kegiatan Geber Bersih Masjid, majlis tasmi' 30 juz, dan santunan yatim Yayasan Sahabat Aksara.",
};

export default async function DokumentasiPage() {
  const gallery = await db.getGalleryItems();

  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] text-[var(--ink-900)]">
      {/* 1. PAGE HEADER RESMI */}
      <PageHeader
        eyebrow="Arsip Visual Pengabdian"
        title="Galeri Dokumentasi Aksi Nyata Lapangan"
        subtitle="Momen otentik serah terima mushaf Jinan, pemakmuran rumah Allah, majlis tasmi' Al-Qur'an 30 juz, serta kebersamaan santri di berbagai penjuru nusantara."
        breadcrumbs={[{ label: "Dokumentasi" }]}
      />

      {/* 2. GALLERY GRID SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--cream-200)] pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
              Rekam Jejak Amanah Tersalurkan
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-1">
              Menampilkan {gallery.length} foto kegiatan lapangan terverifikasi.
            </p>
          </div>
        </div>

        {gallery.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] text-center max-w-md mx-auto space-y-3">
            <ImageIcon className="w-10 h-10 text-[var(--ink-400)] opacity-40 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[var(--ink-900)]">
              Belum Ada Foto Dokumentasi
            </h3>
            <p className="text-xs text-[var(--ink-600)]">
              Foto kegiatan sedang dalam proses kurasi oleh tim media yayasan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallery.map((item) => (
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
    </div>
  );
}
