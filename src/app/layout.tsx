import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Amiri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";
import CustomCursor from "@/components/motion/CustomCursor";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sahabataksara.id"),
  title: {
    default: "Yayasan Sahabat Aksara — Satu Mushaf, Sejuta Pahala Abadi",
    template: "%s | Yayasan Sahabat Aksara",
  },
  description:
    "Lembaga nirlaba dengan 4 pilar utama: Spiritual, Sosial, Pendidikan, dan Teknologi. Berkhidmat menyalurkan mushaf Al-Qur'an, membersihkan masjid, dan membina generasi mandiri berkarakter Qur'ani.",
  keywords: [
    "Yayasan Sahabat Aksara",
    "Wakaf Al-Quran",
    "Infak Quran Custom Nama",
    "Geber Masjid",
    "Bersih Masjid",
    "Tasmi 30 Juz",
    "Sedekah Jariyah",
    "Pemberdayaan Umat",
  ],
  authors: [{ name: "Yayasan Sahabat Aksara" }],
  creator: "Yayasan Sahabat Aksara",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Yayasan Sahabat Aksara",
    title: "Yayasan Sahabat Aksara — Satu Mushaf, Sejuta Pahala Abadi",
    description:
      "Lembaga nirlaba yang berkhidmat dalam 4 pilar utama: Spiritual, Sosial, Pendidikan, dan Teknologi untuk membangun peradaban umat yang mulia dan mandiri.",
    images: [
      {
        url: "/images/logo-sahabat-aksara.jpg",
        width: 1024,
        height: 1024,
        alt: "Logo Yayasan Sahabat Aksara",
      },
    ],
  },
  icons: {
    icon: "/images/logo-sahabat-aksara.jpg",
    apple: "/images/logo-sahabat-aksara.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "Yayasan Sahabat Aksara",
    "alternateName": "Yayasan Ajirasa Aksara Semesta",
    "url": "https://sahabataksara.id",
    "logo": "https://sahabataksara.id/images/logo-sahabat-aksara.jpg",
    "description": "Lembaga nirlaba dengan 4 pilar: Spiritual, Sosial, Pendidikan, dan Teknologi.",
    "slogan": "Satu mushaf, sejuta pahala abadi.",
    "areaServed": "Indonesia",
    "nonprofitStatus": "Nonprofit501c3"
  };

  return (
    <html lang="id" className={`${fraunces.variable} ${plusJakarta.variable} ${amiri.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--cream-50)] text-[var(--ink-900)] antialiased selection:bg-[var(--gold-500)] selection:text-[var(--green-950)]">
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
