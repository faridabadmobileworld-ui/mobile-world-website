import type { Metadata, Viewport } from "next";
import { shop } from "@/data/shop";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter, MobileBar } from "@/components/SiteFooter";
import { ArtSprite } from "@/components/ArtSprite";
import "./globals.css";

/**
 * पूरी site की default metadata।
 * हर page अपना title और description इसके ऊपर override करेगा।
 *
 * Icons यहाँ नहीं लिखे — `app/icon.png` और `app/apple-icon.png` रखी हैं,
 * Next.js उन्हीं से <link> tags बना देता है।
 */
export const metadata: Metadata = {
  metadataBase: new URL(shop.siteUrl),
  title: {
    default: `${shop.name}, ${shop.address.city} — ${shop.tagline}`,
    template: `%s | ${shop.name}`,
  },
  // Google 155–160 अक्षर के बाद काट देता है, इसलिए हर description उतनी ही रखिए।
  description:
    `Mobile, Laptop, TV, AC, Fridge, Washing Machine और घर का बाक़ी सामान — ` +
    `${shop.name}, ${shop.address.road}, ${shop.address.locality}, ${shop.address.city}।`,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: shop.name,
    locale: "hi_IN",
    url: "/",
    title: `${shop.name}, ${shop.address.city} — ${shop.tagline}`,
    description: `हर बड़ा brand, एक ही counter। ${shop.address.road}, ${shop.address.locality}।`,
    images: [{
      url: "/og-image.jpg", width: 1200, height: 630,
      alt: `${shop.name} — ${shop.address.locality}, ${shop.address.city}`,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${shop.name}, ${shop.address.city} — ${shop.tagline}`,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/** Mobile-first site है — zoom बंद नहीं करना, accessibility के लिए ज़रूरी। */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5B3FD9",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi">
      <body>
        <a className="skip" href="#main">सीधे content पर जाइए</a>
        {/*
          पीछे वाली परत — पूरी site के नीचे टिकी रहती है और धीरे-धीरे हिलती है।
          ऊपर का सारा content इसके ऊपर अपने-अपने डिब्बों में चलता है।
          (Owner, 2 Sep 2026: "2 layers ho — ek background wali, ek scrolling wali")
        */}
        <div className="bgfx" aria-hidden="true" />
        {/* ऊपर पतली सी पट्टी — page कितना पढ़ लिया, वो दिखाती है। */}
        <div className="prog" aria-hidden="true" />
        <ArtSprite />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <MobileBar />
      </body>
    </html>
  );
}
