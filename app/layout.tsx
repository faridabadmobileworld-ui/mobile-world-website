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
    default: `${shop.name} — ${shop.tagline}, ${shop.address.city}`,
    template: `%s | ${shop.name}`,
  },
  description:
    `${shop.name} — ${shop.tagline}। ${shop.address.road}, ${shop.address.locality}, ` +
    `${shop.address.city}। Smartphone, Laptop, TV, AC, Refrigerator, Washing Machine, ` +
    `Inverter और घर का बाक़ी सामान। दुकान पर आइए या WhatsApp पर पूछ लीजिए।`,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: shop.name,
    locale: "hi_IN",
    url: "/",
    title: `${shop.name} — ${shop.tagline}, ${shop.address.city}`,
    description: `हर बड़ा brand, एक ही counter। ${shop.address.road}, ${shop.address.locality}।`,
    images: [{
      url: "/og-image.jpg", width: 1200, height: 630,
      alt: `${shop.name} — ${shop.address.locality}, ${shop.address.city}`,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${shop.name} — ${shop.tagline}, ${shop.address.city}`,
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
        <ArtSprite />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <MobileBar />
      </body>
    </html>
  );
}
