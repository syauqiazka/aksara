import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Amiri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";
import CustomCursor from "@/components/motion/CustomCursor";
import PageTransition from "@/components/motion/PageTransition";
import Preloader from "@/components/motion/Preloader";

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
    default: "Yayasan Sahabat Aksara: Menebar Cahaya Al-Qur'an & Inovasi Teknologi",
    template: "%s | Yayasan Sahabat Aksara",
  },
  description:
    "Yayasan Ajirasa Aksara Semesta (Sahabat Aksara) adalah lembaga nirlaba dalam 4 pilar: Spiritual, Sosial, Pendidikan, dan Teknologi. Berkhidmat menyalurkan mushaf Al-Qur'an, memakmurkan masjid, dan mencetak generasi Qur'ani yang mandiri.",
  keywords: [
    "Yayasan Sahabat Aksara",
    "Yayasan Ajirasa Aksara Semesta",
    "Infak Al-Qur'an Jinan",
    "BUSS Al-Qur'an",
    "Geber Masjid",
    "Tasmi 30 Juz Bil-Ghoib",
    "Yatim Berdikari",
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
    title: "Yayasan Sahabat Aksara: Menebar Cahaya Al-Qur'an & Inovasi Teknologi",
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
    icon: [
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
    "slogan": "Keberkahan Al-Qur'an dan kemajuan teknologi untuk melahirkan generasi yang cerdas, berakhlak mulia, serta mandiri.",
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
        <Preloader />
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          <main id="main-content" className="flex-grow flex flex-col w-full relative">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
