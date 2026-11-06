"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Building2, Heart, Award, Cpu, CheckCircle2 } from "lucide-react";
import { programsContent } from "@/content/programs";
import Badge from "@/components/ui/Badge";

export default function HomeProgramsTab() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const categories = [
    { id: "all", label: "Semua Pilar" },
    { id: "Spiritual", label: "Pilar Spiritual" },
    { id: "Sosial", label: "Pilar Sosial" },
    { id: "Pendidikan", label: "Pilar Pendidikan" },
    { id: "Teknologi", label: "Pilar Teknologi" },
  ];

  const filtered = programsContent.filter((prog) => {
    if (activeFilter === "all") return true;
    return prog.pillar.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <div className="space-y-10">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeFilter === cat.id
                ? "bg-[var(--green-800)] text-[var(--gold-300)] shadow-lg scale-105 border border-[var(--gold-500)]/40"
                : "bg-[var(--cream-100)] text-[var(--ink-600)] border border-[var(--cream-200)] hover:bg-[var(--cream-200)]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((prog) => (
          <div
            key={prog.slug}
            className="bg-[var(--cream-50)] rounded-3xl overflow-hidden border border-[var(--cream-200)] hover:border-[var(--gold-500)]/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Photo Banner with Mihrab Shape & Overlay */}
              <div className="relative h-60 w-full overflow-hidden bg-[var(--green-950)] shape-mihrab">
                <Image
                  src={prog.heroImage}
                  alt={prog.title}
                  fill
                  className={`${
                    prog.slug === "buss-quran" ? "object-cover object-top" : "object-cover"
                  } group-hover:scale-105 transition-transform duration-500`}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-950)]/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge variant="pesantren">{prog.pillar}</Badge>
                </div>
                {prog.pricePerUnit && (
                  <div className="absolute bottom-4 right-4 bg-gold-gradient text-[var(--green-950)] text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {prog.pricePerUnit}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="font-serif text-2xl font-bold text-[var(--ink-900)] mb-2 group-hover:text-[var(--green-800)] transition-colors">
                  {prog.title}
                </h3>
                <p className="text-sm text-[var(--ink-600)] leading-relaxed mb-4 line-clamp-3">
                  {prog.shortDesc}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-[var(--cream-200)]">
                  {prog.impactPoints.slice(0, 2).map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-[var(--ink-600)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--green-700)] flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                href={`/program/${prog.slug}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold bg-[var(--green-800)] text-[var(--cream-50)] hover:bg-[var(--green-700)] transition-colors shadow-sm"
              >
                <span>Pelajari Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

