"use client";

import Link from "next/link";

export default function AnnouncementTicker() {
  return (
    <div className="bg-[var(--green-950)] text-[var(--cream-100)] text-xs border-b border-[var(--gold-500)]/20 py-3 px-4 relative z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-3">
        <p className="font-medium leading-relaxed">
          Informasi program dan penyaluran Sahabat Aksara dapat dilihat melalui halaman data sebaran dan laporan.
        </p>
        <Link
          href="/data-sebaran"
          className="inline-flex min-h-11 items-center text-[var(--gold-300)] font-semibold underline underline-offset-4 hover:text-[var(--cream-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--green-950)]"
        >
          Lihat data penyaluran
        </Link>
      </div>
    </div>
  );
}
