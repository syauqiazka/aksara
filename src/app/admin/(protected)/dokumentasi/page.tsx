"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/lib/db/api";
import { GalleryItem } from "@/lib/db/types";
import { Image as ImageIcon, PlusCircle } from "lucide-react";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await db.getGalleryItems();
        setItems(list);
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
            Galeri Dokumentasi Program
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-1">
            Arsip foto serah terima mushaf, majlis tasmi&apos;, dan aksi lapangan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl overflow-hidden border border-[var(--cream-200)] bg-[var(--cream-100)] shadow-sm"
          >
            <div className="relative h-44 w-full bg-[var(--green-950)]">
              <Image src={item.image_url} alt={item.title} fill className="object-cover" />
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-[var(--gold-700)]">
                {item.program} &bull; {item.date}
              </span>
              <h4 className="font-serif font-bold text-sm text-[var(--ink-900)]">
                {item.title}
              </h4>
              {item.caption && (
                <p className="text-xs text-[var(--ink-600)] line-clamp-2">{item.caption}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

