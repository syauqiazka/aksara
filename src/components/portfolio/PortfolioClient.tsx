"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Radio,
  Wallet,
  BookCheck,
  ScanFace,
  Building2,
  UsersRound,
  CheckCircle2,
  Layers,
  FileText,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import { PortfolioApp } from "@/content/portfolio";
import GuidebookModal from "./GuidebookModal";
import PosterModal from "./PosterModal";

const iconMap: Record<string, React.ElementType> = {
  Radio,
  Wallet,
  BookCheck,
  ScanFace,
  Building2,
  UsersRound,
};

interface PortfolioClientProps {
  apps: PortfolioApp[];
}

export default function PortfolioClient({ apps }: PortfolioClientProps) {
  const [selectedGuidebookApp, setSelectedGuidebookApp] = useState<PortfolioApp | null>(null);
  const [selectedPosterApp, setSelectedPosterApp] = useState<PortfolioApp | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {apps.map((app) => {
          const IconComponent = iconMap[app.mockupIcon] || Layers;
          const hasActionFeatures = app.hasGuidebook || app.hasPoster;

          return (
            <div
              key={app.id}
              className="bg-[var(--cream-100)] rounded-3xl p-7 sm:p-8 border border-[var(--cream-200)] hover:border-[var(--gold-500)] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top status bar & category */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--green-700)]">
                    {app.category}
                  </span>
                  <span className="text-xs px-3.5 py-1 rounded-full font-medium bg-[var(--cream-200)] text-[var(--ink-700)] border border-[var(--cream-300)]">
                    Segera Dirilis
                  </span>
                </div>

                {/* App Title & Identity */}
                <div className="flex items-start gap-4 sm:gap-5 mb-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[var(--green-950)] relative overflow-hidden flex-shrink-0 shadow-lg border border-[var(--gold-500)]/40 group-hover:scale-105 transition-transform flex items-center justify-center">
                    {app.logoImage ? (
                      <Image
                        src={app.logoImage}
                        alt={app.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 64px, 80px"
                      />
                    ) : (
                      <IconComponent className="w-8 h-8 sm:w-9 sm:h-9 text-[var(--gold-400)]" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
                      {app.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--gold-700)] font-medium mt-0.5">
                      {app.tagline}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[var(--ink-600)] leading-relaxed mb-6 font-sans">
                  {app.description}
                </p>

                {/* Key Features */}
                <div className="space-y-2 pt-4 border-t border-[var(--cream-200)]">
                  <div className="text-[11px] uppercase tracking-wider text-[var(--ink-500)] font-bold mb-2">
                    Fitur Unggulan:
                  </div>
                  {app.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[var(--ink-800)]">
                      <CheckCircle2 className="w-4 h-4 text-[var(--green-700)] flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* THE REQUESTED PARTNERSHIP CALLOUT BOX (For Bank Saku Digital, E-AbsensiQu, SapawargaQu) */}
                {app.partnershipNote && (
                  <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[var(--gold-400)]/20 via-[var(--gold-500)]/15 to-[var(--gold-400)]/20 border-2 border-[var(--gold-500)]/40 text-[var(--ink-900)] space-y-1.5 shadow-xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--gold-800)]">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--gold-600)]" />
                      <span>Paket Kemitraan Dakwah</span>
                    </div>
                    <p className="text-xs sm:text-[13px] font-bold text-[var(--green-950)] leading-snug">
                      &ldquo;{app.partnershipNote}&rdquo;
                    </p>
                    <p className="text-[11px] text-[var(--ink-700)] leading-relaxed">
                      Termasuk pendampingan aktivasi sistem, buku panduan operasional (Guidebook), serta materi sosialisasi poster resmi.
                    </p>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-6 space-y-3">
                {hasActionFeatures && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* BUTTON 1: UNDUH / LIHAT GUIDEBOOK (PDF PREVIEW) */}
                    <button
                      type="button"
                      onClick={() => setSelectedGuidebookApp(app)}
                      className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 bg-[var(--green-900)] text-[var(--cream-50)] hover:bg-[var(--green-800)] transition-all shadow-xs group/btn cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-[var(--gold-400)] group-hover/btn:scale-110 transition-transform" />
                      <span>Lihat Guidebook (PDF)</span>
                    </button>

                    {/* BUTTON 2: FITUR DOWNLOAD POSTER (BERSEBELAHAN DENGAN GUIDEBOOK) */}
                    <button
                      type="button"
                      onClick={() => setSelectedPosterApp(app)}
                      className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 bg-white text-[var(--green-950)] border-2 border-[var(--gold-500)]/40 hover:border-[var(--gold-500)] hover:bg-[var(--cream-50)] transition-all shadow-xs group/btn cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-[var(--green-800)] group-hover/btn:scale-110 transition-transform" />
                      <span>Unduh Poster</span>
                    </button>
                  </div>
                )}

                {/* PLAY STORE STATUS */}
                <div className="w-full py-2.5 rounded-xl text-center text-xs font-medium bg-[var(--cream-200)]/70 text-[var(--ink-600)] border border-[var(--cream-300)]/60">
                  Tautan Unduh Play Store Segera Dirilis
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: GUIDEBOOK PDF PREVIEW MODAL */}
      <GuidebookModal
        app={selectedGuidebookApp}
        isOpen={Boolean(selectedGuidebookApp)}
        onClose={() => setSelectedGuidebookApp(null)}
      />

      {/* MODAL 2: POSTER DOWNLOAD & PREVIEW MODAL */}
      <PosterModal
        app={selectedPosterApp}
        isOpen={Boolean(selectedPosterApp)}
        onClose={() => setSelectedPosterApp(null)}
      />
    </>
  );
}
