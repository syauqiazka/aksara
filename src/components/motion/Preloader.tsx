"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { hasAppLoaded, markAppLoaded } from "@/lib/motion/splash-state";
import IslamicCornerOrnament from "@/components/ui/IslamicCornerOrnament";

export default function Preloader() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Only show splash on initial cold load or browser reload (F5 / Ctrl+R)
  const [visible, setVisible] = useState(() => !isAdmin && !hasAppLoaded());

  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const emblemRef = useRef<HTMLDivElement>(null);
  const logoImgRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mandalaRef = useRef<HTMLDivElement>(null);

  // SVG Concentric Accent Rings
  const outerRingRef = useRef<SVGCircleElement>(null);
  const innerRingRef = useRef<SVGCircleElement>(null);

  // Typography Elements
  const titleRef = useRef<HTMLHeadingElement>(null);
  const acronymRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const handleComplete = () => {
    markAppLoaded();
    setVisible(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }

    // Accessible focus shift without scrolling
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
        scale: 1.35,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: handleComplete,
      });
    } else {
      handleComplete();
    }
  };

  // Lock scroll while splash is active
  useEffect(() => {
    if (visible && typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [visible]);

  // Main animation orchestrator
  useEffect(() => {
    if (!visible) return;

    let prefersReducedMotion = false;
    if (typeof window !== "undefined" && window.matchMedia) {
      prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    // Reduced motion accessibility fallback: 300ms gentle fade
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

    // Full ~5.0s animation timeline
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: handleComplete,
      });
      timelineRef.current = tl;

      // 0. Grand Islamic Star Mandala Medallion Reveal & Celestial Spin (from user motif)
      if (mandalaRef.current) {
        tl.to(
          mandalaRef.current,
          {
            opacity: 0.42,
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          0.05
        );
        gsap.to(mandalaRef.current, {
          rotation: 360,
          duration: 90,
          repeat: -1,
          ease: "none",
        });
      }

      // 1. Double Gold Concentric Accent Rings Draw (0.05s -> 1.1s)
      if (outerRingRef.current) {
        tl.to(
          outerRingRef.current,
          {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: "power2.inOut",
          },
          0.05
        );
      }

      if (innerRingRef.current) {
        tl.to(
          innerRingRef.current,
          {
            strokeDashoffset: 0,
            duration: 1.0,
            ease: "power2.inOut",
          },
          0.12
        );
      }

      // 2. Authentic Logo Reveal: Scale in smoothly with soft opacity (0.15s -> 1.0s)
      if (logoImgRef.current) {
        tl.to(
          logoImgRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
          },
          0.15
        );
      }

      // 3. Ambient Gold Glow Bloom (0.5s -> 1.6s)
      if (glowRef.current) {
        tl.to(
          glowRef.current,
          {
            opacity: 0.85,
            duration: 1.1,
            ease: "power1.inOut",
          },
          0.5
        );
      }

      // 4. Metallic Light Sheen Glint Across the Emblem (1.1s -> 2.2s)
      if (sheenRef.current) {
        tl.fromTo(
          sheenRef.current,
          { xPercent: -120, opacity: 0 },
          {
            xPercent: 140,
            opacity: 0.45,
            duration: 1.0,
            ease: "power2.inOut",
          },
          1.1
        );
      }

      // 5. Typography Inscription (0.9s -> 2.1s)
      if (titleRef.current) {
        tl.to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
          },
          0.9
        );
      }

      if (acronymRef.current) {
        tl.to(
          acronymRef.current,
          {
            opacity: 1,
            letterSpacing: "0.32em",
            duration: 0.8,
            ease: "power2.out",
          },
          1.2
        );
      }

      if (tagRef.current) {
        tl.to(
          tagRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          1.5
        );
      }

      // 6. Living Ambient Breathing on Emblem (2.0s -> 2.8s)
      if (emblemRef.current) {
        tl.to(
          emblemRef.current,
          {
            scale: 1.03,
            duration: 0.8,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          2.0
        );
      }

      // 7. Cinematic Zoom-In Exit Transition (2.8s -> 3.55s)
      // Content & Emblem zoom in towards the camera/viewer
      if (contentRef.current) {
        tl.to(
          contentRef.current,
          {
            scale: 1.85,
            opacity: 0,
            duration: 0.65,
            ease: "power2.in",
          },
          2.8
        );
      }

      // 8. Green Curtain expands and dissolves into the home page
      if (curtainRef.current) {
        tl.to(
          curtainRef.current,
          {
            scale: 1.35,
            opacity: 0,
            duration: 0.75,
            ease: "power2.inOut",
          },
          2.8
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [visible]);

  // If not visible, unmount completely
  if (!visible) return null;

  return (
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

      {/* Main Full-Screen Green Curtain (Wipes Up at exit) */}
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-[var(--green-950)] flex items-center justify-center z-10 overflow-hidden"
      >
        {/* Authentic Islamic Geometric Lattice Pattern Texture */}
        <div
          className="absolute inset-0 bg-islamic-pattern opacity-25 pointer-events-none"
          style={{
            maskImage:
              "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.15) 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.15) 100%)",
          }}
        />

        {/* 4 Corner Islamic Arabesque Ornaments */}
        <div className="absolute top-4 left-4 opacity-40 pointer-events-none select-none">
          <IslamicCornerOrnament size={110} />
        </div>
        <div className="absolute top-4 right-4 opacity-40 pointer-events-none select-none -scale-x-100">
          <IslamicCornerOrnament size={110} />
        </div>
        <div className="absolute bottom-4 left-4 opacity-40 pointer-events-none select-none -scale-y-100">
          <IslamicCornerOrnament size={110} />
        </div>
        <div className="absolute bottom-4 right-4 opacity-40 pointer-events-none select-none -scale-x-100 -scale-y-100">
          <IslamicCornerOrnament size={110} />
        </div>

        {/* Central Logo & Inscription */}
        <div
          ref={contentRef}
          className="relative z-20 flex flex-col items-center text-center px-4 max-w-md w-full"
        >
          {/* Authentic Logo Emblem - 100% exact to official Sahabat Aksara brand identity */}
          <div
            ref={emblemRef}
            className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center mb-6 will-change-transform"
          >
            {/* Grand Islamic Star Mandala Medallion (Silhouette Watermark) */}
            <div
              ref={mandalaRef}
              className="absolute -inset-14 sm:-inset-20 pointer-events-none select-none flex items-center justify-center will-change-transform mix-blend-screen"
              style={{ opacity: 0, transform: "scale(0.85)" }}
            >
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 drop-shadow-[0_0_25px_rgba(212,175,55,0.35)]">
                <Image
                  src="/images/ornaments/islamic-star-mandala.webp"
                  alt="Motif Ornamen Bintang Geometri Islami Sahabat Aksara"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Ambient gold aura glow */}
            <div
              ref={glowRef}
              className="absolute -inset-2 rounded-full bg-[var(--gold-400)]/25 blur-xl pointer-events-none"
              style={{ opacity: 0 }}
            />

            {/* Concentric gold SVG rings */}
            <svg
              className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] pointer-events-none"
              viewBox="0 0 240 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                ref={outerRingRef}
                cx="120"
                cy="120"
                r="110"
                stroke="var(--gold-400)"
                strokeWidth="2"
                strokeLinecap="round"
                className="opacity-90"
                style={{
                  strokeDasharray: 700,
                  strokeDashoffset: 700,
                }}
              />
              <circle
                ref={innerRingRef}
                cx="120"
                cy="120"
                r="103"
                stroke="var(--gold-500)"
                strokeWidth="1.2"
                strokeLinecap="round"
                className="opacity-60"
                style={{
                  strokeDasharray: 650,
                  strokeDashoffset: 650,
                }}
              />
            </svg>

            {/* Official Authentic Sahabat Aksara Seal */}
            <div
              ref={logoImgRef}
              className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-2xl drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)] will-change-transform"
              style={{ opacity: 0, transform: "scale(0.9)" }}
            >
              <Image
                src="/images/logo-sahabat-aksara-circle.png"
                alt="Logo Resmi Yayasan Sahabat Aksara"
                width={200}
                height={200}
                className="w-full h-full object-contain pointer-events-none select-none"
                priority
              />
              {/* Metallic Sheen Shimmer Effect */}
              <div
                ref={sheenRef}
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none will-change-transform"
                style={{
                  transform: "translateX(-120%) rotate(25deg)",
                  opacity: 0,
                }}
              />
            </div>
          </div>

          {/* Typography */}
          <h1
            ref={titleRef}
            className="font-serif text-2xl sm:text-3xl font-bold text-[var(--cream-50)] tracking-wide"
            style={{
              opacity: 0,
              transform: "translateY(14px)",
            }}
          >
            Sahabat Aksara
          </h1>

          <div
            ref={acronymRef}
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[var(--gold-400)] mt-2 font-mono"
            style={{
              opacity: 0,
            }}
          >
            A K S A R A
          </div>

          <p
            ref={tagRef}
            className="text-[11px] uppercase tracking-[0.16em] text-[var(--sage-300)] mt-2 font-sans"
            style={{
              opacity: 0,
              transform: "translateY(8px)",
            }}
          >
            Spiritual, Sosial, Pendidikan, dan Teknologi
          </p>
        </div>
      </div>
    </div>
  );
}
