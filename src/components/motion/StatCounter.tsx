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

export default function StatCounter({ end, label, prefix = "", suffix = "", sublabel }: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const { ScrollTrigger } = registerGSAP();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayValue(end);
      return;
    }

    const obj = { val: 0 };
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        gsap.to(obj, {
          val: end,
          duration: 2.2,
          ease: "power2.out",
          onUpdate: () => {
            setDisplayValue(Math.floor(obj.val));
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [end]);

  return (
    <div ref={containerRef} className="flex flex-col items-center sm:items-start text-center sm:text-left">
      <div className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-gold-gradient tabular-numbers tracking-tight">
        {prefix}
        {displayValue.toLocaleString("id-ID")}
        {suffix}
      </div>
      <div className="text-sm sm:text-base font-semibold text-[var(--cream-100)] mt-1">
        {label}
      </div>
      {sublabel && (
        <div className="text-xs text-[var(--sage-300)] mt-0.5">
          {sublabel}
        </div>
      )}
    </div>
  );
}

