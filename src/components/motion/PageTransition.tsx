"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const transitionRef = useRef<HTMLDivElement>(null);

  // Scroll restoration: pastikan scroll selalu kembali ke puncak (0, 0) saat rute berpindah
  useEffect(() => {
    // Immediate scroll reset
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return (
    <div
      key={pathname}
      ref={transitionRef}
      className="page-transition-container flex-grow flex flex-col w-full"
    >
      {children}
    </div>
  );
}

