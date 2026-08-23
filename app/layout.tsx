import type { Metadata, Viewport } from "next";
import { shop } from "@/data/shop";
import { fontVars } from "@/app/fonts";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyContactBar from "@/components/StickyContactBar";
import "./globals.css";

/**
 * पूरी site की default metadata।
 * हर page अपना title और description इसके ऊपर override करता है।
 */
export const metadata: Metadata = {
  metadataBase: new URL(shop.siteUrl),
  title: {
    default: `${shop.name} — Mobile, Laptop aur Home Appliances, NIT Faridabad`,
    template: `%s | ${shop.name}`,
  },
  description:
    `${shop.name}, ${shop.address.locality}, ${shop.address.city} — mobiles, laptops, ` +
    `televisions, air conditioners, washing machines aur home appliances.`,
  openGraph: {
    type: "website",
    locale: "hi_IN",
    siteName: shop.name,
    url: shop.siteUrl,
  },
};

/** Mobile-first site है — zoom बंद नहीं करना, accessibility के लिए ज़रूरी। */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={fontVars}>
      <body className="grain relative antialiased">
        <SiteNav />
        {children}
        <SiteFooter />
        <StickyContactBar />
      </body>
    </html>
  );
}
