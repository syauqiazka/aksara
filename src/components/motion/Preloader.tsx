"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show only on first visit in the current session
    const hasVisited = sessionStorage.getItem("sahabat_aksara_visited");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasVisited || prefersReducedMotion) {
      return;
    }

    setVisible(true);
    sessionStorage.setItem("sahabat_aksara_visited", "true");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setVisible(false);
        },
      });

      // 1. Draw gold ring
      if (circleRef.current) {
        tl.fromTo(
          circleRef.current,
          { strokeDashoffset: 380 },
          { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }
        );
      }

      // 2. Reveal text & insignia
      if (contentRef.current) {
        tl.fromTo(
          contentRef.current,
          { opacity: 0, scale: 0.9, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" },
          "-=0.3"
        );
      }

      // 3. Pause for readability
      tl.to({}, { duration: 0.4 });

      // 4. Split curtains vertically
      tl.to(contentRef.current, { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" });

      if (topCurtainRef.current && bottomCurtainRef.current) {
        tl.to(
          topCurtainRef.current,
          { yPercent: -100, duration: 0.7, ease: "power3.inOut" },
          "-=0.1"
        );
        tl.to(
          bottomCurtainRef.current,
          { yPercent: 100, duration: 0.7, ease: "power3.inOut" },
          "<"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center overflow-hidden"
      role="status"
      aria-label="Memuat Yayasan Sahabat Aksara"
    >
      {/* Top half curtain */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-[var(--green-950)] border-b border-[var(--gold-500)]/30 z-10"
      />
      {/* Bottom half curtain */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[var(--green-950)] border-t border-[var(--gold-500)]/30 z-10"
      />

      {/* Central insignia and logo drawing */}
      <div ref={contentRef} className="relative z-20 flex flex-col items-center text-center p-6">
        <div className="relative w-28 h-28 flex items-center justify-center mb-4">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
            {/* Background ring */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(212, 175, 55, 0.2)"
              strokeWidth="2"
            />
            {/* Drawing gold ring */}
            <circle
              ref={circleRef}
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="var(--gold-400)"
              strokeWidth="2.5"
              strokeDasharray="380"
              strokeDashoffset="380"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-3xl font-bold text-gold-gradient tracking-widest">
              SA
            </span>
          </div>
        </div>

        <h1 className="font-serif text-xl sm:text-2xl font-bold text-[var(--cream-50)] tracking-wide">
          Sahabat Aksara
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-400)] mt-1 font-sans">
          Satu Mushaf, Sejuta Pahala Abadi
        </p>

        <button
          onClick={() => setVisible(false)}
          className="mt-6 text-[11px] text-[var(--sage-300)] hover:text-[var(--gold-300)] underline underline-offset-4 focus:outline-none"
        >
          Lewati Intro &rarr;
        </button>
      </div>
    </div>
  );
}

