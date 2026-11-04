"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  BookOpen,
  Clock,
  X,
  ImageIcon,
} from "lucide-react";
import {
  PublicInfakJinanRecord,
  PublicInfakJinanSantri,
  HafalanUpdate,
} from "@/lib/db/types";

interface Props {
  donation: PublicInfakJinanRecord;
  santri: PublicInfakJinanSantri[];
}

export default function InfakJinanDetailView({ donation, santri }: Props) {
  const [activeSantriTimeline, setActiveSantriTimeline] = useState<PublicInfakJinanSantri | null>(null);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 1. Back button */}
      <div>
        <Link
          href="/data-sebaran"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--cream-100)] border border-[var(--cream-300)] text-[var(--green-950)] text-sm font-semibold hover:bg-[var(--cream-200)] transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Data Sebaran</span>
        </Link>
      </div>

      {/* 2. Top Donation Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-[var(--green-950)] to-[var(--green-900)] text-[var(--cream-50)] shadow-xl border border-[var(--gold-500)]/30 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--cream-100)]/10">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-[var(--gold-500)] text-[var(--green-950)] font-mono font-bold text-sm shadow-xs">
              Mushaf ke-{donation.mushaf_no}
            </span>
            <span className="text-xs text-[var(--sage-300)] flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-[var(--gold-400)]" />
              Tersalurkan: {donation.distributed_at}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {donation.photos && donation.photos.length > 0 && (
              <button
                onClick={() => setShowPhotoGallery(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--green-800)]/80 hover:bg-[var(--green-800)] text-[var(--cream-50)] text-xs font-semibold border border-[var(--gold-400)]/40 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[var(--gold-300)]" />
                <span>Foto Dokumentasi ({donation.photos.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Grid info donatur, dedikasi, dan pesantren */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          {/* Info Donatur */}
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[var(--gold-400)] font-semibold block">
              Donatur &amp; Asal
            </span>
            <p className="font-serif text-lg font-bold text-[var(--cream-50)]">
              {donation.display_donor_name}
            </p>
            <p className="text-xs text-[var(--sage-300)]">
              Wilayah Asal: <strong>{donation.donor_origin}</strong>
            </p>
          </div>

          {/* Info Dedikasi */}
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[var(--gold-400)] font-semibold block">
              Dedikasi Atas Nama
            </span>
            <p className="font-serif text-base font-medium italic text-[var(--gold-300)]">
              &ldquo;{donation.dedication_name}&rdquo;
            </p>
            <p className="text-xs text-[var(--sage-300)]">
              Pahala jariyah disalurkan untuk santri penghafal Al-Qur&apos;an.
            </p>
          </div>

          {/* Pesantren & Lokasi Maps */}
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[var(--gold-400)] font-semibold block">
              Pesantren Tujuan
            </span>
            <p className="font-serif text-base font-bold text-[var(--cream-50)]">
              {donation.pesantren_name}
            </p>
            <p className="text-xs text-[var(--sage-300)] line-clamp-2">
              {donation.address}
            </p>
            {donation.maps_url && (
              <a
                href={donation.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--gold-300)] hover:text-[var(--gold-400)] hover:underline pt-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Buka Titik di Google Maps</span>
              </a>
            )}
          </div>
        </div>

        {/* Ringkasan Jumlah Santri */}
        <div className="p-4 rounded-2xl bg-[var(--green-900)]/60 border border-[var(--gold-400)]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--gold-400)]" />
            <span>
              Mushaf ini tersalurkan kepada{" "}
              <strong className="text-[var(--gold-300)] text-sm">{donation.santri_count} Santri</strong>
            </span>
          </div>
          <span className="text-[var(--sage-300)] text-[11px]">
            Data hafalan diverifikasi dan diperbarui secara berkala oleh pengasuh pesantren
          </span>
        </div>
      </div>

      {/* 3. Section Santri Penerima */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[var(--green-950)]">
              Daftar Santri Penerima &amp; Progres Hafalan
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-600)]">
              Berikut santri binaan yang menerima mushaf ke-{donation.mushaf_no} beserta capaian surat, ayat, dan juz terkini.
            </p>
          </div>
        </div>

        {/* State Kosong */}
        {santri.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-[var(--ink-400)] opacity-40" />
            <h3 className="font-serif text-lg font-bold text-[var(--ink-900)]">
              Belum Ada Data Santri Terkait
            </h3>
            <p className="text-xs text-[var(--ink-600)] max-w-md mx-auto">
              Data alokasi santri penerima untuk mushaf ini sedang dalam proses verifikasi lapangan oleh tim Sahabat Aksara.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-3xl border border-[var(--cream-200)] shadow-sm bg-[var(--cream-50)]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[var(--green-950)] text-[var(--cream-50)] font-serif uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-4 text-center">No.</th>
                    <th className="py-4 px-6">Nama Santri</th>
                    <th className="py-4 px-6">Surat &amp; Ayat Terkini</th>
                    <th className="py-4 px-4 text-center">Juz</th>
                    <th className="py-4 px-6 text-center">Progres Bulanan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--cream-200)] text-[var(--ink-900)]">
                  {santri.map((s, idx) => (
                    <tr
                      key={s.id}
                      className="hover:bg-[var(--cream-100)] transition-colors group"
                    >
                      <td className="py-4 px-4 text-center font-mono text-[var(--ink-600)]">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-6 font-semibold text-[var(--green-950)] text-sm">
                        {s.santri_name}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-[var(--ink-900)]">
                          {s.latest_surah || "-"}
                        </div>
                        {s.latest_ayat && (
                          <div className="text-[10px] text-[var(--gold-700)] font-medium">
                            Ayat ke-{s.latest_ayat}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-[var(--gold-700)]">
                        {s.latest_juz ? `Juz ${s.latest_juz}` : "-"}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setActiveSantriTimeline(s)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--gold-500)] text-[var(--green-950)] text-xs font-semibold bg-[var(--cream-100)] hover:bg-gold-gradient transition-all shadow-xs"
                        >
                          <Clock className="w-3.5 h-3.5 text-[var(--gold-700)]" />
                          <span>Riwayat ({s.hafalan_updates.length})</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className="md:hidden space-y-4">
              {santri.map((s, idx) => (
                <div
                  key={s.id}
                  className="p-5 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--cream-200)]">
                    <span className="text-xs font-mono text-[var(--ink-600)]">
                      Santri #{idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--gold-500)] text-[var(--green-950)] font-bold text-xs shadow-xs">
                      {s.latest_juz ? `Juz ${s.latest_juz}` : "Juz -"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-bold text-[var(--green-950)]">
                      {s.santri_name}
                    </h3>
                    <p className="text-xs text-[var(--gold-700)] font-semibold">
                      Hafalan Terkini: {s.latest_surah || "-"} {s.latest_ayat ? `(Ayat ${s.latest_ayat})` : ""}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveSantriTimeline(s)}
                    className="w-full py-2.5 rounded-full bg-[var(--green-800)] text-[var(--cream-50)] text-xs font-semibold text-center hover:bg-[var(--green-700)] transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-[var(--gold-300)]" />
                    <span>Riwayat Progres Bulanan ({s.hafalan_updates.length})</span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 4. Modal Timeline Riwayat Bulanan Santri */}
      {activeSantriTimeline && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setActiveSantriTimeline(null)}
        >
          <div
            className="bg-[var(--cream-50)] rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto border border-[var(--gold-500)]/40 shadow-2xl p-6 sm:p-8 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-[var(--cream-200)]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--gold-700)] tracking-wider">
                  Riwayat Progres Hafalan Bulanan
                </span>
                <h3 className="font-serif text-xl font-bold text-[var(--green-950)] mt-0.5">
                  {activeSantriTimeline.santri_name}
                </h3>
                <p className="text-xs text-[var(--ink-600)]">
                  Mushaf ke-{donation.mushaf_no} &bull; {donation.pesantren_name}
                </p>
              </div>
              <button
                onClick={() => setActiveSantriTimeline(null)}
                className="p-2 rounded-full hover:bg-[var(--cream-200)] text-[var(--ink-600)] transition-colors"
                aria-label="Tutup riwayat hafalan"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline updates */}
            <div className="space-y-4 pt-2">
              {activeSantriTimeline.hafalan_updates.length === 0 ? (
                <p className="text-xs text-[var(--ink-600)] italic text-center py-4">
                  Belum ada catatan progres bulanan yang diunggah.
                </p>
              ) : (
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--gold-500)]/40">
                  {activeSantriTimeline.hafalan_updates.map((u: HafalanUpdate, idx: number) => (
                    <div key={u.id || idx} className="relative group text-xs">
                      <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--gold-500)] border-2 border-[var(--cream-50)]" />
                      <div className="p-4 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-200)] space-y-1.5">
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-[var(--green-950)] font-serif text-sm">
                            Surah {u.surah_name} (Ayat {u.ayat})
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--green-800)] text-[var(--cream-50)] font-bold">
                            Juz {u.juz}
                          </span>
                        </div>
                        <div className="text-[10px] text-[var(--ink-600)] flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[var(--green-700)]" />
                          <span>Pembaruan: {u.updated_on}</span>
                        </div>
                        {u.notes && (
                          <p className="text-[11px] text-[var(--ink-700)] italic pt-1 border-t border-[var(--cream-200)]/60">
                            &ldquo;{u.notes}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal Galeri Foto Donasi */}
      {showPhotoGallery && donation.photos && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowPhotoGallery(false)}
        >
          <div
            className="bg-[var(--cream-50)] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-[var(--gold-500)]/40 shadow-2xl p-6 sm:p-8 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--cream-200)]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--green-950)]">
                  Dokumentasi Serah Terima Mushaf #{donation.mushaf_no}
                </h3>
                <p className="text-xs text-[var(--ink-600)]">
                  {donation.pesantren_name} &bull; {donation.distributed_at}
                </p>
              </div>
              <button
                onClick={() => setShowPhotoGallery(false)}
                className="p-2 rounded-full hover:bg-[var(--cream-200)] text-[var(--ink-600)] transition-colors"
                aria-label="Tutup galeri foto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {donation.photos.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl overflow-hidden border border-[var(--cream-200)] bg-[var(--green-950)] space-y-2 p-2"
                >
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden">
                    <Image
                      src={p.url}
                      alt={p.caption || `Mushaf #${donation.mushaf_no}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  {p.caption && (
                    <p className="text-[11px] text-[var(--cream-100)] italic px-1">
                      {p.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

