import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import {
  GAME_BASE_PATH,
  getGamePortalUrl,
  SITE_URL,
} from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#170b0d",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Game Online Gratis Tanpa Download – TeknoGame",
    template: "%s | TeknoGame",
  },
  description:
    "Mainkan game online gratis tanpa download di TeknoGame! Nikmati game HTML5 arcade, petualangan, puzzle, balap, aksi, dan santai langsung di browser.",
  keywords: [
    "TeknoGame",
    "Game Online Gratis Tanpa Download",
    "game web",
    "game online gratis",
    "game html5 indonesia",
    "Tekno Game Teknotama",
    "PT Teknotama Prakarsa Mulia",
    "game peramban gratis",
    "game tanpa download",
    "arcade",
    "puzzle",
    "petualangan",
    "balap",
  ],
  authors: [{ name: "PT Teknotama Prakarsa Mulia", url: "https://teknotama.com" }],
  creator: "PT Teknotama Prakarsa Mulia",
  publisher: "PT Teknotama Prakarsa Mulia",
  alternates: {
    canonical: "https://www.teknotama.com/games/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: `${GAME_BASE_PATH}/TeknoGame_logo_red.png`, type: "image/png" }],
    shortcut: `${GAME_BASE_PATH}/TeknoGame_logo_red.png`,
    apple: `${GAME_BASE_PATH}/TeknoGame_logo_red.png`,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.teknotama.com/games/",
    siteName: "TeknoGame",
    title: "Game Online Gratis Tanpa Download – TeknoGame",
    description:
      "Jelajahi game HTML5 gratis: arcade, petualangan, puzzle, balap, dan aksi. Main langsung dari browser tanpa instalasi.",
    images: [
      {
        url: "https://www.teknotama.com/path-gambar-og-games.jpg",
        alt: "TeknoGame - Portal Game Online Gratis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Online Gratis Tanpa Download – TeknoGame",
    description:
      "Mainkan game HTML5 gratis langsung di browser. Pilih arcade, puzzle, petualangan, balap, dan lainnya.",
    images: ["https://www.teknotama.com/path-gambar-og-games.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} antialiased dark`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try {
              document.documentElement.dataset.theme =
                localStorage.getItem("teknogame-theme") === "dark" ? "dark" : "light";
              var savedLang = localStorage.getItem("teknogame-lang");
              if (savedLang === "en" || savedLang === "id") {
                document.documentElement.dataset.lang = savedLang;
                document.documentElement.lang = savedLang;
              } else {
                document.documentElement.dataset.lang = "id";
                document.documentElement.lang = "id";
              }
            } catch {
              document.documentElement.dataset.theme = "light";
              document.documentElement.dataset.lang = "id";
              document.documentElement.lang = "id";
            }`,
          }}
        />
        <title>Game Online Gratis Tanpa Download – TeknoGame</title>

        <meta name="description" content="Mainkan game online gratis tanpa download di TeknoGame! Nikmati game HTML5 arcade, petualangan, puzzle, balap, aksi, dan santai langsung di browser." />

        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        <link rel="canonical" href="https://www.teknotama.com/games/" />

        <meta property="og:type" content="website" />
        <meta property="og:locale" content="id_ID" />
        <meta property="og:site_name" content="TeknoGame" />
        <meta property="og:title" content="Game Online Gratis Tanpa Download – TeknoGame" />
        <meta property="og:description" content="Jelajahi game HTML5 gratis: arcade, petualangan, puzzle, balap, dan aksi. Main langsung dari browser tanpa instalasi." />
        <meta property="og:url" content="https://www.teknotama.com/games/" />
        <meta property="og:image" content="https://www.teknotama.com/path-gambar-og-games.jpg" />
        <meta property="og:image:alt" content="TeknoGame - Portal Game Online Gratis" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Game Online Gratis Tanpa Download – TeknoGame" />
        <meta name="twitter:description" content="Mainkan game HTML5 gratis langsung di browser. Pilih arcade, puzzle, petualangan, balap, dan lainnya." />
        <meta name="twitter:image" content="https://www.teknotama.com/path-gambar-og-games.jpg" />

        {/* SEO Improvement Baris Baru: Schema.org JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "TeknoGame",
              "alternateName": "Teknotama Games",
              "url": "https://www.teknotama.com/games/",
              "description":
                "Mainkan game online gratis tanpa download di TeknoGame! Nikmati game HTML5 arcade, petualangan, puzzle, balap, aksi, dan santai langsung di browser.",
              "inLanguage": "id-ID",
              "publisher": {
                "@type": "Organization",
                "name": "PT Teknotama Prakarsa Mulia",
                "url": "https://teknotama.com"
              }
            })
          }}
        />

        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://teknotama.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://teknotama.com" />

      </head>
      <body className="min-h-full text-[#fcf8f9]" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
        {/* Google AdSense Official Loader (afterInteractive agar tidak menggeser DOM <head> saat hydration) */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3146007647541379"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
