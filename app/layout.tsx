import type { Metadata, Viewport } from "next";
import { shop } from "@/data/shop";
import "./globals.css";

/**
 * पूरी site की default metadata।
 * हर page अपना title और description इसके ऊपर override करेगा।
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
};

/** Mobile-first site है — zoom बंद नहीं करना, accessibility के लिए ज़रूरी। */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body className="antialiased text-[15px] sm:text-base">{children}</body>
    </html>
  );
}
