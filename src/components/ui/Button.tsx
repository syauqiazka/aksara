"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)] focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-6 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] shadow-[0_4px_14px_rgba(17,74,28,0.35)] hover:shadow-[0_6px_20px_rgba(17,74,28,0.45)]",
    gold:
      "bg-gold-gradient text-[var(--green-950)] font-semibold shadow-[0_4px_16px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_24px_rgba(212,175,55,0.6)] hover:brightness-105",
    secondary:
      "border border-[var(--gold-500)] text-[var(--green-900)] hover:bg-[var(--gold-500)]/10 hover:border-[var(--gold-400)]",
    ghost:
      "text-[var(--green-800)] hover:bg-[var(--green-800)]/10",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}

