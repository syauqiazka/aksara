"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // SVG Elements
  const outerRingRef = useRef<SVGCircleElement>(null);
  const innerRingRef = useRef<SVGCircleElement>(null);
  const bookRef = useRef<SVGPathElement>(null);
  const globeRef = useRef<SVGGElement>(null);
  const palmsRef = useRef<SVGGElement>(null);
  const sproutRef = useRef<SVGGElement>(null);

  // Typography Elements
  const titleRef = useRef<HTMLHeadingElement>(null);
  const acronymRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const handleComplete = () => {
    setVisible(false);

    // Shift focus to main content without scroll jump
    setTimeout(() => {
      const mainContent =
        document.getElementById("main-content") || document.querySelector("main");
      if (mainContent) {
        mainContent.setAttribute("tabindex", "-1");
        mainContent.focus({ preventScroll: true });
      }
    }, 50);
  };

  const handleSkip = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    if (curtainRef.current) {
      gsap.to(curtainRef.current, {
        yPercent: -100,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: handleComplete,
      });
    } else {
      handleComplete();
    }
  };

  // Selalu tampilkan animasi pembuka logo setiap kali halaman di-refresh / dimuat
  useEffect(() => {
    setVisible(true);
    setMounted(true);
  }, []);

  // Phase 2: Once visible and DOM elements are mounted, run GSAP animation
  useEffect(() => {
    if (!visible) return;

    let prefersReducedMotion = false;
    if (typeof window !== "undefined" && window.matchMedia) {
      prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    // If user prefers reduced motion: 300ms gentle fade without transform
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.3,
            onComplete: handleComplete,
          });
        } else {
          handleComplete();
        }
      }, 300);
      return () => clearTimeout(timer);
    }

    // Full ~5.0s timeline with GSAP
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: handleComplete,
      });
      timelineRef.current = tl;

      // Initial States
      if (outerRingRef.current) gsap.set(outerRingRef.current, { strokeDashoffset: 560 });
      if (innerRingRef.current) gsap.set(innerRingRef.current, { strokeDashoffset: 510 });
      if (bookRef.current) gsap.set(bookRef.current, { opacity: 0, scale: 0.85, transformOrigin: "50% 50%" });
      if (globeRef.current) gsap.set(globeRef.current, { opacity: 0, scale: 0.7, transformOrigin: "50% 50%" });
      if (palmsRef.current) gsap.set(palmsRef.current, { opacity: 0, y: 15 });
      if (sproutRef.current) gsap.set(sproutRef.current, { opacity: 0, scaleY: 0, transformOrigin: "50% 100%" });
      if (titleRef.current) gsap.set(titleRef.current, { opacity: 0, y: 12 });
      if (acronymRef.current) gsap.set(acronymRef.current, { opacity: 0, letterSpacing: "0.35em" });
      if (tagRef.current) gsap.set(tagRef.current, { opacity: 0 });

      // 1. Double Gold Rings Draw (0.0s -> 1.25s)
      tl.to(
        outerRingRef.current,
        {
          strokeDashoffset: 0,
          duration: 1.25,
          ease: "power2.inOut",
        },
        0
      );

      tl.to(
        innerRingRef.current,
        {
          strokeDashoffset: 0,
          duration: 1.15,
          ease: "power2.inOut",
        },
        0.15
      );

      // 2. Logo Elements Sequential Reveal: Tangan, Buku, Globe, Tunas (0.8s -> 2.4s)
      tl.to(
        palmsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "back.out(1.5)",
        },
        0.8
      );

      tl.to(
        bookRef.current,
        {
          opacity: 0.45,
          scale: 1,
          duration: 0.75,
          ease: "power2.out",
        },
        1.1
      );

      tl.to(
        globeRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.4)",
        },
        1.4
      );

      tl.to(
        sproutRef.current,
        {
          opacity: 1,
          scaleY: 1,
          duration: 0.75,
          ease: "elastic.out(1, 0.6)",
        },
        1.8
      );

      // 3. Brand Identity & Acronym AKSARA Reveal (2.3s -> 3.4s)
      tl.to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
        },
        2.3
      );

      tl.to(
        acronymRef.current,
        {
          opacity: 1,
          letterSpacing: "0.22em",
          duration: 0.8,
          ease: "power3.out",
        },
        2.6
      );

      tl.to(
        tagRef.current,
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        2.9
      );

      // 4. Elegantly Fade Content (4.3s -> 4.55s)
      tl.to(
        contentRef.current,
        {
          opacity: 0,
          y: -15,
          duration: 0.25,
          ease: "power2.in",
        },
        4.3
      );

      // 5. Green Curtain Wipe Up (4.55s -> 5.1s = exactly 5.1s total)
      tl.to(
        curtainRef.current,
        {
          yPercent: -100,
          duration: 0.55,
          ease: "power4.inOut",
        },
        4.55
      );
    }, containerRef);

    return () => {
      ctx.revert();
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [visible]);

  if (!visible) return null;

  const preloaderContent = (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label="Animasi Pembuka Yayasan Sahabat Aksara"
    >
      {/* Skip Button - 44px touch target, positioned top-right */}
      <button
        onClick={handleSkip}
        type="button"
        aria-label="Lewati animasi intro"
        className="fixed top-5 right-5 sm:top-7 sm:right-7 z-[1000000] min-w-[44px] min-h-[44px] px-4 py-2 rounded-full bg-[var(--green-900)]/80 hover:bg-[var(--green-900)] border border-[var(--gold-500)]/40 hover:border-[var(--gold-400)] text-[var(--gold-300)] hover:text-[var(--gold-200)] text-xs font-semibold tracking-wider transition-all backdrop-blur-md shadow-lg flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)] cursor-pointer active:scale-[0.98]"
      >
        <span>Lewati</span>
        <span aria-hidden="true" className="text-sm">✕</span>
      </button>

      {/* Main Full-Screen Green Curtain (Wipe Up) */}
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-[var(--green-950)] flex items-center justify-center z-10"
      >
        {/* Central Logo & Inscription */}
        <div
          ref={contentRef}
          className="relative z-20 flex flex-col items-center text-center px-4 max-w-md w-full"
        >
          {/* SVG Animated Emblem (Double Rings + Palms + Mushaf + Globe + Sprout) */}
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center mb-6">
            <svg
              className="w-full h-full drop-shadow-2xl"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 1. Double Gold Concentric Rings */}
              <circle
                ref={outerRingRef}
                cx="100"
                cy="100"
                r="88"
                stroke="var(--gold-400)"
                strokeWidth="2"
                strokeDasharray="560"
                strokeDashoffset="560"
                strokeLinecap="round"
                className="opacity-95"
              />
              <circle
                ref={innerRingRef}
                cx="100"
                cy="100"
                r="81"
                stroke="var(--gold-500)"
                strokeWidth="1.2"
                strokeDasharray="510"
                strokeDashoffset="510"
                strokeLinecap="round"
                className="opacity-60"
              />

              {/* 2. Open Book / Mushaf Silhouette (Background) */}
              <path
                ref={bookRef}
                d="M 52 118 Q 100 134 100 148 Q 100 134 148 118 Q 152 82 100 96 Q 48 82 52 118 Z"
                fill="url(#goldSheen)"
                stroke="var(--gold-400)"
                strokeWidth="1.2"
                className="opacity-40"
              />

              {/* 3. Globe / Bumi (Tengah) */}
              <g ref={globeRef} className="origin-center">
                <circle
                  cx="100"
                  cy="114"
                  r="26"
                  fill="var(--green-900)"
                  stroke="var(--gold-400)"
                  strokeWidth="1.8"
                />
                <ellipse
                  cx="100"
                  cy="114"
                  rx="14"
                  ry="26"
                  stroke="var(--gold-500)"
                  strokeWidth="1"
                  strokeOpacity="0.75"
                />
                <line
                  x1="74"
                  y1="114"
                  x2="126"
                  y2="114"
                  stroke="var(--gold-500)"
                  strokeWidth="1"
                  strokeOpacity="0.75"
                />
                <path
                  d="M 80 102 Q 100 107 120 102"
                  stroke="var(--gold-500)"
                  strokeWidth="0.8"
                  strokeOpacity="0.6"
                />
                <path
                  d="M 80 126 Q 100 121 120 126"
                  stroke="var(--gold-500)"
                  strokeWidth="0.8"
                  strokeOpacity="0.6"
                />
              </g>

              {/* 4. Dua Telapak Tangan yang Memangku (Palms Cradling the Globe) */}
              <g ref={palmsRef}>
                <path
                  d="M 54 116 C 58 138, 76 156, 98 160 C 82 154, 68 140, 64 122 Z"
                  fill="var(--gold-400)"
                  className="opacity-90"
                />
                <path
                  d="M 146 116 C 142 138, 124 156, 102 160 C 118 154, 132 140, 136 122 Z"
                  fill="var(--gold-400)"
                  className="opacity-90"
                />
                <path
                  d="M 68 142 Q 100 166 132 142"
                  stroke="var(--gold-400)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>

              {/* 5. Tunas Muda Bertumbuh (Sprout of Hope) */}
              <g ref={sproutRef}>
                <path
                  d="M 100 88 L 100 66"
                  stroke="var(--gold-300)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 100 74 C 90 70, 84 58, 88 52 C 94 56, 98 64, 100 70 Z"
                  fill="var(--gold-300)"
                />
                <path
                  d="M 100 70 C 102 64, 106 56, 112 52 C 116 58, 110 70, 100 74 Z"
                  fill="var(--gold-300)"
                />
                <circle cx="100" cy="62" r="3" fill="var(--gold-200)" />
              </g>

              {/* Gradient definitions */}
              <defs>
                <linearGradient id="goldSheen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--gold-300)" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="var(--gold-500)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="var(--gold-600)" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Typography */}
          <h1
            ref={titleRef}
            className="font-serif text-2xl sm:text-3xl font-bold text-[var(--cream-50)] tracking-wide"
          >
            Sahabat Aksara
          </h1>

          <div
            ref={acronymRef}
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-[var(--gold-400)] mt-2 font-mono"
          >
            A K S A R A
          </div>

          <p
            ref={tagRef}
            className="text-[11px] uppercase tracking-[0.16em] text-[var(--sage-300)] mt-2 font-sans"
          >
            Spiritual, Sosial, Pendidikan, dan Teknologi
          </p>
        </div>
      </div>
    </div>
  );

  if (mounted && typeof document !== "undefined") {
    return createPortal(preloaderContent, document.body);
  }

  return preloaderContent;
}
