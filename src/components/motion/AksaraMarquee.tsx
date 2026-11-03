"use client";

import { useState } from "react";
import { organizationContent } from "@/content/organization";

export default function AksaraMarquee() {
  const [activeItem, setActiveItem] = useState<{ letter: string; word: string; desc: string } | null>(null);

  const items = organizationContent.acronymMeaning;
  // Repeat items for seamless marquee
  const repeatedItems = [...items, ...items, ...items];

  return (
    <section className="relative py-8 bg-[var(--green-900)] border-y border-[var(--gold-500)]/30 overflow-hidden select-none">
      <div className="absolute inset-0 bg-islamic-pattern opacity-30 pointer-events-none" />

      {/* Marquee Track */}
      <div className="relative flex whitespace-nowrap overflow-x-hidden group">
        <div className="flex animate-[marquee_38s_linear_infinite] group-hover:[animation-play-state:paused] gap-8 py-2">
          {repeatedItems.map((item, idx) => (
            <button
              key={`${item.letter}-${idx}`}
              onClick={() => setActiveItem(item)}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--green-950)]/60 border border-[var(--gold-500)]/30 hover:border-[var(--gold-400)] transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
            >
              <span className="font-serif text-2xl font-black text-gold-gradient">
                {item.letter}
              </span>
              <span className="text-sm font-semibold tracking-wider text-[var(--cream-100)] uppercase font-sans">
                {item.word}
              </span>
              <span className="text-xs text-[var(--gold-400)]/80 italic font-serif">
                &mdash; {item.desc.slice(0, 32)}...
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Modal Drawer when an acronym item is clicked */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[var(--green-950)] border-2 border-[var(--gold-500)] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--green-900)] border border-[var(--gold-400)] mx-auto flex items-center justify-center mb-4">
              <span className="font-serif text-3xl font-extrabold text-gold-gradient">
                {activeItem.letter}
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[var(--cream-50)] mb-1">
              {activeItem.word}
            </h3>
            <div className="w-12 h-0.5 bg-[var(--gold-500)] mx-auto mb-4" />
            <p className="text-sm text-[var(--cream-100)] leading-relaxed mb-6">
              {activeItem.desc}
            </p>
            <button
              onClick={() => setActiveItem(null)}
              className="px-6 py-2.5 rounded-full text-xs font-semibold bg-gold-gradient text-[var(--green-950)] hover:brightness-110"
            >
              Tutup Penjelasan
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

