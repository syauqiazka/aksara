"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "secondary" | "secondary-dark" | "ghost";
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
    "inline-flex items-center justify-center font-medium rounded-full cursor-pointer select-none transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-400)] focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-6 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 border border-white/10",
    gold:
      "bg-gold-gradient text-[var(--green-950)] font-semibold shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:brightness-105 hover:-translate-y-0.5 border border-[var(--gold-400)]/40",
    secondary:
      "border border-[var(--gold-500)] text-[var(--green-900)] bg-transparent hover:bg-[var(--gold-500)]/10 hover:border-[var(--gold-400)] hover:-translate-y-0.5 shadow-xs",
    "secondary-dark":
      "border border-[var(--gold-400)]/80 text-[var(--cream-50)] bg-transparent hover:bg-[var(--gold-500)]/15 hover:text-[var(--gold-300)] hover:border-[var(--gold-300)] hover:-translate-y-0.5 shadow-xs",
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

