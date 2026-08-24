import type { Metadata, Viewport } from "next";
import { shop } from "@/data/shop";
import "./globals.css";

/**
 * पूरी site की default metadata।
 * हर page अपना title और description इसके ऊपर override करेगा।
 *
 * Icons यहाँ नहीं लिखे — `app/icon.png` और `app/apple-icon.png` रखी हैं,
 * Next.js उन्हीं से <link> tags बना देता है (यही उसके docs की सलाह है)।
 */
export const metadata: Metadata = {
  metadataBase: new URL(shop.siteUrl),
  title: {
    default: `${shop.name} — Mobile, Laptop aur Home Appliances, NIT Faridabad`,
    template: `%s | ${shop.name}`,
  },
  description:
    `${shop.name}, ${shop.address.locality}, ${shop.address.city} — mobiles, laptops, ` +
    `televisions, air conditioners, washing machines aur home appliances. ` +
    `Dukaan par aakar dekhiye ya call kijiye.`,

  alternates: { canonical: "/" },

  // इसके बिना WhatsApp, Instagram या Facebook पर link भेजने पर सिर्फ़ ख़ाली
  // text box दिखता है — कोई तस्वीर नहीं। दुकान का ज़्यादातर traffic वहीं से
  // आता है, इसलिए ये ज़रूरी है।
  openGraph: {
    type: "website",
    siteName: shop.name,
    locale: "hi_IN",
    url: "/",
    title: `${shop.name} — Electronics Store, ${shop.address.city}`,
    description: `Har bada brand, ek counter. ${shop.address.road}, ${shop.address.locality}.`,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${shop.name} — ${shop.address.locality}, ${shop.address.city}`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${shop.name} — Electronics Store, ${shop.address.city}`,
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/** Mobile-first site है — zoom बंद नहीं करना, accessibility के लिए ज़रूरी। */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5B3FD9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
