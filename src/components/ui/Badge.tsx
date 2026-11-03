import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "pesantren" | "masjid" | "madrasah" | "thematic" | "neutral" | "gold";
  className?: string;
}

export default function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  const variantStyles = {
    pesantren: "bg-[var(--green-900)] text-[var(--gold-300)] border border-[var(--gold-500)]/30",
    masjid: "bg-[var(--gold-500)]/15 text-[var(--gold-700)] border border-[var(--gold-500)]/40",
    madrasah: "bg-[var(--teal-600)]/15 text-[var(--teal-600)] border border-[var(--teal-600)]/30",
    thematic: "bg-[var(--terracotta-500)]/15 text-[var(--terracotta-500)] border border-[var(--terracotta-500)]/30",
    neutral: "bg-[var(--cream-200)] text-[var(--ink-600)] border border-[var(--cream-200)]",
    gold: "bg-gold-gradient text-[var(--green-950)] font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

