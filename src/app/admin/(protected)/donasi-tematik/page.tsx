"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/db/api";
import { ThemedCampaign } from "@/lib/db/types";
import { HeartHandshake, PlusCircle, AlertCircle } from "lucide-react";

export default function AdminThemedCampaignsPage() {
  const [campaigns, setCampaigns] = useState<ThemedCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await db.getThemedCampaigns();
        setCampaigns(list);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--cream-200)]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
            Donasi Tematik (Tanggap Bencana)
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-1">
            Kelola kampanye aksi darurat gempa, banjir, karhutla, dan erupsi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="p-6 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[var(--terracotta-500)]">
                {camp.disaster_type} &bull; {camp.location}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  camp.status === "aktif"
                    ? "bg-[var(--green-800)] text-[var(--gold-300)]"
                    : "bg-[var(--cream-200)] text-[var(--ink-600)]"
                }`}
              >
                {camp.status}
              </span>
            </div>

            <h3 className="font-serif text-xl font-bold text-[var(--ink-900)]">
              {camp.title}
            </h3>

            <p className="text-xs text-[var(--ink-600)] leading-relaxed">
              {camp.description}
            </p>

            <div className="pt-2 border-t border-[var(--cream-200)] flex justify-between text-xs font-semibold">
              <span>Terkumpul: Rp {camp.collected_idr.toLocaleString("id-ID")}</span>
              <span>Target: Rp {camp.target_idr.toLocaleString("id-ID")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

