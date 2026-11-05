import Link from "next/link";
import { ChevronRight } from "lucide-react";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  eyebrow,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <section className="relative pt-32 pb-16 sm:pb-20 bg-[var(--green-950)] text-[var(--cream-50)] border-b border-[var(--gold-500)]/20 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-32 right-10 w-80 h-80 bg-[var(--green-800)]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-10 w-80 h-80 bg-[var(--gold-500)]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--cream-200)]/70">
            <li>
              <Link
                href="/"
                className="hover:text-[var(--gold-300)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--gold-400)] rounded px-1"
              >
                Beranda
              </Link>
            </li>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <li key={idx} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[var(--gold-500)]/50 flex-shrink-0" />
                  {isLast || !crumb.href ? (
                    <span className="text-[var(--gold-400)] font-medium line-clamp-1" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="hover:text-[var(--gold-300)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--gold-400)] rounded px-1 line-clamp-1"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Content & Eyebrow */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            {eyebrow && (
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold-400)] font-semibold">
                {eyebrow}
              </div>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--cream-50)] leading-tight [text-wrap:balance]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-[var(--cream-100)]/90 leading-relaxed font-sans pt-1">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex-shrink-0 flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

