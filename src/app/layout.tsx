import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#051c14",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sahabataksara.id"),
  alternates: {
    canonical: "/",
  },
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
  authors: [{ name: "Yayasan Sahabat Aksara", url: "https://sahabataksara.id" }],
  creator: "Yayasan Sahabat Aksara",
  publisher: "Yayasan Ajirasa Aksara Semesta",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
  twitter: {
    card: "summary_large_image",
    title: "Yayasan Sahabat Aksara: Menebar Cahaya Al-Qur'an & Inovasi Teknologi",
    description:
      "Lembaga nirlaba yang berkhidmat dalam 4 pilar: Spiritual, Sosial, Pendidikan, dan Teknologi untuk peradaban umat mandiri.",
    images: ["/images/logo-sahabat-aksara.jpg"],
    creator: "@SahabatAksara",
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sahabataksara.id";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["NGO", "Organization"],
        "@id": `${siteUrl}/#organization`,
        "name": "Yayasan Sahabat Aksara",
        "alternateName": ["Yayasan Ajirasa Aksara Semesta", "Sahabat Aksara"],
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/images/logo-sahabat-aksara.jpg`,
          "width": 1024,
          "height": 1024,
        },
        "image": `${siteUrl}/images/logo-sahabat-aksara.jpg`,
        "description": "Yayasan Ajirasa Aksara Semesta (Sahabat Aksara) adalah lembaga nirlaba dalam 4 pilar: Spiritual, Sosial, Pendidikan, dan Teknologi.",
        "slogan": "Keberkahan Al-Qur'an dan kemajuan teknologi untuk melahirkan generasi yang cerdas, berakhlak mulia, serta mandiri.",
        "founder": {
          "@type": "Person",
          "name": "Ahmad Dahlan",
          "jobTitle": "Founder & Pembina Yayasan"
        },
        "email": "ajirasaaksarasemesta@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Bogor",
          "addressRegion": "Jawa Barat",
          "addressCountry": "ID"
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+62-822-6217-0018",
            "contactType": "Customer Service",
            "areaServed": "ID",
            "availableLanguage": ["id", "ar"]
          }
        ],
        "sameAs": [
          "https://www.instagram.com/sahabat_aksara_semesta?exln=enR1ZnBkZTA1enp6",
          "https://wa.me/6282262170018"
        ],
        "areaServed": "Indonesia",
        "knowsAbout": [
          "Infak Al-Qur'an Jinan",
          "Beasiswa BUSS Al-Qur'an",
          "Geber Gerakan Bersih Masjid",
          "Majlis Tasmi 30 Juz Bil-Ghoib",
          "Kemandirian Yatim Berdikari",
          "Pengembangan Aplikasi Dakwah"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Yayasan Sahabat Aksara",
        "description": "Portal Resmi Yayasan Sahabat Aksara: Transparansi Penyaluran Infak Mushaf & Program Dakwah Nusantara",
        "publisher": {
          "@id": `${siteUrl}/#organization`
        },
        "inLanguage": "id-ID",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/data-sebaran?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ]
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
