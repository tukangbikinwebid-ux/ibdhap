import type { Metadata } from "next";
import { Comfortaa, Tajawal } from "next/font/google";
import "./globals.css";
import PWAInstaller from "./components/PWAInstaller";
import AppWrapper from "./components/AppWrapper";
import NavigationWrapper from "./navigation-wrapper";
import ReduxProvider from "@/providers/redux";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IbadahApp - Aplikasi Ibadah Muslim",
  description:
    "Aplikasi ibadah lengkap untuk umat Muslim dengan jadwal sholat, qibla, Al-Quran dan fitur ibadah lainnya",
  keywords: [
    "ibadah",
    "muslim",
    "islam",
    "sholat",
    "qibla",
    "quran",
    "jadwal sholat",
    "aplikasi islam",
  ],
  authors: [{ name: "NadiTechno" }],
  creator: "NadiTechno",
  publisher: "NadiTechno",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ibadahapp.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "IbadahApp - Aplikasi Ibadah Muslim",
    description:
      "Aplikasi ibadah lengkap untuk umat Muslim dengan jadwal sholat, qibla, Al-Quran dan fitur ibadah lainnya",
    url: "https://ibadahapp.com",
    siteName: "IbadahApp",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "IbadahApp Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IbadahApp - Aplikasi Ibadah Muslim",
    description:
      "Aplikasi ibadah lengkap untuk umat Muslim dengan jadwal sholat, qibla, Al-Quran dan fitur ibadah lainnya",
    images: ["/icons/icon-512x512.png"],
  },
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
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IbadahApp",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "msapplication-TileColor": "#059669",
    "theme-color": "#059669",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#059669" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="IbadahApp" />
        <meta name="msapplication-TileColor" content="#059669" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />
      </head>
      <body className={`${comfortaa.variable} ${tajawal.variable} antialiased`}>
        <ReduxProvider>
          <AppWrapper>{children}</AppWrapper>
          <NavigationWrapper />
          <PWAInstaller />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
            }}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}
