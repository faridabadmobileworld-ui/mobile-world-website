import { localBusinessSchema, jsonLdScript } from "@/data/schema";
import { ShoppingHero } from "@/components/ShoppingHero";
import { ShoppingCategories } from "@/components/ShoppingCategories";
import { HomeBody } from "@/components/HomeBody";
import { LatestPost } from "@/components/LatestPost";
import { CampaignSocial, FestivalHighlights } from "@/components/CampaignHighlights";

/* Home page ka saara content ab `components/HomeBody.tsx` mein hai, taaki
   `/showcase` bhi bilkul wahi content dikha sake — do jagah likhe bina. */

export default function Home() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(localBusinessSchema()) }} />

      <ShoppingHero />
      <div className="wrap shopping-home">
        <LatestPost />
        <ShoppingCategories />
        <FestivalHighlights />
        <HomeBody current="/" />
        <CampaignSocial />
      </div>
    </>
  );
}
