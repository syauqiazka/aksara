import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/lib/db/api";
import InfakJinanDetailView from "@/components/sections/InfakJinanDetailView";
import PageHeader from "@/components/ui/PageHeader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await db.getPublicInfakJinanDetail(id);

  if (!data) {
    return {
      title: "Detail Donasi Mushaf Tidak Ditemukan | Sahabat Aksara",
    };
  }

  const { donation } = data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sahabataksara.id";
  const photo = donation.photos?.[0]?.url
    ? (donation.photos[0].url.startsWith("http") ? donation.photos[0].url : `${siteUrl}${donation.photos[0].url}`)
    : `${siteUrl}/images/infak-mushaf-custom.jpg`;

  return {
    title: `Mushaf Ke-${donation.mushaf_no} (${donation.display_donor_name}) | Data Sebaran Sahabat Aksara`,
    description: `Detail transparansi penyaluran Mushaf Ke-${donation.mushaf_no} dari ${donation.display_donor_name} untuk santri di ${donation.pesantren_name}.`,
    alternates: {
      canonical: `/data-sebaran/infak-jinan/${id}`,
    },
    openGraph: {
      title: `Mushaf Ke-${donation.mushaf_no} (${donation.display_donor_name})`,
      description: `Transparansi progres hafalan santri penerima Mushaf Ke-${donation.mushaf_no} di ${donation.pesantren_name}.`,
      url: `/data-sebaran/infak-jinan/${id}`,
      images: [{ url: photo }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Mushaf Ke-${donation.mushaf_no} (${donation.display_donor_name})`,
      description: `Verifikasi amanah mushaf santri di ${donation.pesantren_name}.`,
      images: [photo],
    },
  };
}

export default async function InfakJinanDetailPage({ params }: PageProps) {
  const { id } = await params;
  const data = await db.getPublicInfakJinanDetail(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full bg-[var(--cream-50)] min-h-screen">
      {/* 1. Page Header Terpadu */}
      <PageHeader
        eyebrow="Transparansi Penyaluran Donasi Mushaf"
        title={`Detail Penyaluran Mushaf ke-${data.donation.mushaf_no}`}
        subtitle={`Verifikasi amanah infak mushaf dari ${data.donation.display_donor_name} untuk para santri di ${data.donation.pesantren_name}.`}
        breadcrumbs={[
          { label: "Data Sebaran", href: "/data-sebaran" },
          { label: `Mushaf ke-${data.donation.mushaf_no}` },
        ]}
      />

      {/* 2. Main Detail View */}
      <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <InfakJinanDetailView
          donation={data.donation}
          santri={data.santri}
        />
      </div>
    </div>
  );
}
