"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { registerGSAP } from "@/lib/motion/register";

interface StatCounterProps {
  end: number;
  label: string;
  prefix?: string;
  suffix?: string;
  sublabel?: string;
}

export default function StatCounter({
  end,
  label,
  prefix = "",
  suffix = "",
  sublabel,
}: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayValue(end);
      return;
    }

    const { ScrollTrigger } = registerGSAP();
    const counter = { value: 0 };
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        gsap.to(counter, {
          value: end,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => setDisplayValue(Math.floor(counter.value)),
        });
      },
    });

    return () => trigger.kill();
  }, [end]);

  return (
    <div
      ref={containerRef}
      className="flex min-h-[148px] flex-col items-center justify-center px-3 text-center"
    >
      <div className="font-serif font-bold text-5xl sm:text-6xl lg:text-[4.25rem] leading-none text-gold-gradient tabular-nums tracking-tight">
        {prefix}
        {displayValue.toLocaleString("id-ID")}
        {suffix}
      </div>
      <div className="mt-4 max-w-[15rem] text-sm sm:text-base font-semibold leading-snug text-[var(--cream-100)]">
        {label}
      </div>
      {sublabel && (
        <div className="mt-2 max-w-[15rem] text-xs leading-relaxed text-[var(--sage-300)]">
          {sublabel}
        </div>
      )}
    </div>
  );
}
