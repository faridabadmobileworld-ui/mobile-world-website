import { localBusinessSchema, jsonLdScript } from "@/data/schema";
import { ShoppingHero } from "@/components/ShoppingHero";
import { ShoppingCategories } from "@/components/ShoppingCategories";
import { HomeBody } from "@/components/HomeBody";
import { LatestPost } from "@/components/LatestPost";
import { CampaignSocial, FestivalHighlights } from "@/components/CampaignHighlights";
import { FestivalFlightScene } from "./FestivalFrame";
import { SpinWheel } from "./SpinWheel";
import { CurrentOffers } from "./CurrentOffers";

/* Home page ka saara content ab `components/HomeBody.tsx` mein hai, taaki
   `/showcase` bhi bilkul wahi content dikha sake — do jagah likhe bina. */

export default function Home() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(localBusinessSchema()) }} />

      <ShoppingHero />
      <section id="mobile-world-video" className="mw-home-video" aria-label="Mobile World का product video">
        <video
          className="mw-home-video-player"
          controls
          playsInline
          preload="metadata"
          poster="/images/mobile-world-product-video-poster.jpg"
          width={854}
          height={480}
          aria-label="Mobile World product video — Play दबाकर original sound के साथ देखिए"
        >
          <source src="/videos/mobile-world-products-original-128.mp4" type="video/mp4" />
          आपका browser यह video नहीं चला पा रहा है। <a href="/videos/mobile-world-products-original-128.mp4">Video खोलिए</a>।
        </video>
      </section>
      <div className="wrap shopping-home">
        <CurrentOffers />
        <FestivalFlightScene />
        <SpinWheel />
        <LatestPost />
        <ShoppingCategories />
        <FestivalHighlights />
        <HomeBody current="/" />
        <CampaignSocial />
      </div>
    </>
  );
}
