import type { Metadata } from "next";
import { CineHero } from "@/components/CineHero";
import { HomeBody } from "@/components/HomeBody";
import { shop } from "@/data/shop";

/* /showcase — bilkul wahi home page, lekin cinematic.
   Content ka ek hi source hai (`components/HomeBody.tsx`), isliye home page
   par jo bhi jud'ta hai wo yahan apne aap aa jaata hai. Upar scroll wala
   video hero lagta hai aur poore page par `.cine` ki gehri, 3D wali chaal. */

export const metadata: Metadata = {
  title: "Mobile World, NIT Faridabad | scroll karke poori dukaan dekhiye",
  description:
    "Mobile World, Jawahar Colony ka cinematic version — wahi dukaan, wahi saamaan, "
    + "scroll ke saath chalti hui. Roz 10 se 10, saaton din.",
  alternates: { canonical: `${shop.siteUrl}/` },
  // Yeh page home page ka hi doosra roop hai. Dono ko index karvaana
  // duplicate content ban jaata aur asli home page ki local ranking girata.
  robots: { index: false, follow: true },
};

export default function Showcase() {
  return (
    <div className="cine">
      <CineHero />
      <div className="wrap">
        <HomeBody current="/showcase" />
      </div>
    </div>
  );
}
