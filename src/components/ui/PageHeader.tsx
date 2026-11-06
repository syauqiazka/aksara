import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import React from "react";
import IslamicCornerOrnament from "@/components/ui/IslamicCornerOrnament";

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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sahabataksara.id";
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: siteUrl,
      },
      ...breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: crumb.label,
        ...(crumb.href ? { item: `${siteUrl}${crumb.href}` } : {}),
      })),
    ],
  };

  return (
    <section className="relative pt-32 pb-16 sm:pb-20 bg-[var(--green-950)] text-[var(--cream-50)] border-b border-[var(--gold-500)]/20 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* 1. Authentic Islamic Geometric Pattern Background Texture */}
      <div
        className="absolute inset-0 bg-islamic-pattern opacity-25 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 75%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 75%, transparent 100%)",
        }}
      />

      {/* 2. Background Ambient Glow */}
      <div className="absolute -top-32 right-10 w-96 h-96 bg-[var(--green-800)]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-10 w-96 h-96 bg-[var(--gold-500)]/12 rounded-full blur-3xl pointer-events-none" />

      {/* 3. Islamic Star Mandala Watermark Silhouette (Right Flank) */}
      <div className="absolute -right-20 sm:-right-12 top-1/2 -translate-y-1/2 w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] opacity-25 sm:opacity-30 pointer-events-none select-none will-change-transform animate-spin-slow">
        <Image
          src="/images/ornaments/islamic-star-mandala.webp"
          alt=""
          fill
          className="object-contain drop-shadow-[0_0_35px_rgba(212,175,55,0.25)]"
        />
      </div>

      {/* 4. Corner Arabesque Accents */}
      <div className="absolute top-24 left-4 opacity-25 pointer-events-none select-none hidden sm:block">
        <IslamicCornerOrnament size={85} />
      </div>
      <div className="absolute top-24 right-4 opacity-25 pointer-events-none select-none -scale-x-100 hidden sm:block">
        <IslamicCornerOrnament size={85} />
      </div>

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

