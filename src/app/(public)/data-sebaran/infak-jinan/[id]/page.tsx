import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/lib/db/api";
import InfakJinanDetailView from "@/components/sections/InfakJinanDetailView";
import PageHeader from "@/components/ui/PageHeader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await db.getPublicInfakJinanDetail(id);

  if (!data) {
    return {
      title: "Detail Donasi Mushaf Tidak Ditemukan | Sahabat Aksara",
    };
  }

  const { donation } = data;
  return {
    title: `Mushaf Ke-${donation.mushaf_no} (${donation.display_donor_name}) | Data Sebaran Sahabat Aksara`,
    description: `Detail transparansi penyaluran Mushaf Ke-${donation.mushaf_no} dari ${donation.display_donor_name} untuk santri di ${donation.pesantren_name}.`,
    openGraph: {
      title: `Mushaf Ke-${donation.mushaf_no} (${donation.display_donor_name})`,
      description: `Transparansi progres hafalan santri penerima Mushaf Ke-${donation.mushaf_no} di ${donation.pesantren_name}.`,
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
