import { MetadataRoute } from "next";
import { programsContent } from "@/content/programs";
import { db } from "@/lib/db/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sahabataksarasemesta.org";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/program`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portofolio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/data-sebaran`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/laporan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/donasi`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dokumentasi`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic program routes from static content
  const programRoutes: MetadataRoute.Sitemap = programsContent.map((p) => ({
    url: `${baseUrl}/program/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Dynamic report routes & jinan routes from database
  let reportRoutes: MetadataRoute.Sitemap = [];
  let jinanRoutes: MetadataRoute.Sitemap = [];

  try {
    const [reports, jinan] = await Promise.all([
      db.getReports(true),
      db.getPublicInfakJinan(),
    ]);

    reportRoutes = reports.map((r) => ({
      url: `${baseUrl}/laporan/${r.slug}`,
      lastModified: new Date(r.updated_at || r.created_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    jinanRoutes = jinan.map((j) => ({
      url: `${baseUrl}/data-sebaran/infak-jinan/${j.id}`,
      lastModified: new Date(j.distributed_at || new Date()),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (err) {
    console.warn("[sitemap] Failed to load dynamic database routes:", err);
  }

  return [...staticRoutes, ...programRoutes, ...reportRoutes, ...jinanRoutes];
}
