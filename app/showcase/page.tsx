import type { Metadata } from "next";
import { JourneyScroll } from "@/components/JourneyScroll";
import { HomeBody } from "@/components/HomeBody";
import { shop } from "@/data/shop";

/* /showcase — bilkul wahi home page, lekin cinematic.
   Content ka ek hi source hai (`components/HomeBody.tsx`), isliye home page
   par jo bhi jud'ta hai wo yahan apne aap aa jaata hai. Upar scroll wala
   video hero lagta hai aur poore page par `.cine` ki gehri, 3D wali chaal. */

export const metadata: Metadata = {
  title: "हमारा सफ़र — Mobile World, NIT Faridabad",
  description:
    "1973 की किराना दुकान से आज के showroom तक — scroll के साथ चलती हुई दुकान की "
    + "कहानी, और पूरी दुकान एक ही page पर। रोज़ 10 से 10, सातों दिन।",
  alternates: { canonical: `${shop.siteUrl}/` },
  // Yeh page home page ka hi doosra roop hai. Dono ko index karvaana
  // duplicate content ban jaata aur asli home page ki local ranking girata.
  robots: { index: false, follow: true },
};

export default function Showcase() {
  return (
    <div className="cine">
      {/* ऊपर सफ़र ही hero है — owner की भेजी तीन videos (1973 · 2006 · 2016)।
          इसीलिए नीचे HomeBody को दोबारा वही हिस्सा नहीं दिखाना है।
          पुराना cinematic hero (`components/CineHero.tsx` +
          `public/showcase/assets/hero-scrub.mp4`) repo में जस का तस पड़ा है —
          owner कहें तो एक line में वापस लग जाएगा। */}
      <div className="wrap">
        <JourneyScroll hero />
        <HomeBody current="/showcase" journey={false} />
      </div>
    </div>
  );
}
