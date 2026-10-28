import { publicCampaigns } from "@/lib/campaigns/store";
import { campaignIsLive } from "@/lib/campaigns/core";
import Link from "next/link";
import { localBusinessSchema, jsonLdScript } from "@/data/schema";
import { ShoppingHero } from "@/components/ShoppingHero";
import { HomeProductVideo } from "@/components/HomeProductVideo";
import { ShoppingCategories } from "@/components/ShoppingCategories";
import { HomeBody } from "@/components/HomeBody";
import { LatestPost } from "@/components/LatestPost";
import { CampaignSocial, FestivalHighlights } from "@/components/CampaignHighlights";
import { FestivalFlightScene } from "./FestivalFrame";
import { SpinWheel } from "./SpinWheel";
import { CurrentOffers } from "./CurrentOffers";

/* Home page ka saara content ab `components/HomeBody.tsx` mein hai, taaki
   `/showcase` bhi bilkul wahi content dikha sake — do jagah likhe bina. */

export const revalidate = 60;
export default async function Home() {
  const campaigns = await publicCampaigns();
  const live = (id: keyof typeof campaigns.items) => campaignIsLive(campaigns.items[id]);
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(localBusinessSchema()) }} />

      <ShoppingHero hiddenCampaigns={[...(!live("diwali") ? ["diwali"] : []), ...(!live("gifts") ? ["gifts"] : [])]} />
      <div className="wrap shopping-home">
        <ShoppingCategories />
        <HomeBody current="/" section="discovery" />
        <CurrentOffers settings={campaigns} />
        <SpinWheel enabled={live("spin")} note={campaigns.items.spin.note} />
      </div>
      <HomeProductVideo />
      <div className="wrap shopping-home">
        <section id="mobile-world-rap" className="mw-rap-highlight" aria-labelledby="mw-rap-title">
          <div className="mw-rap-heading">
            <p className="mw-rap-kicker">MOBILE WORLD ORIGINAL · OFFICIAL RAP</p>
            <h2 id="mw-rap-title">अपनी कहानी। अपना Rap।</h2>
            <p>1973 की छोटी Kiryana Store से आज की Mobile World तक—परिवार की मेहनत और आपके भरोसे का सफ़र, अब एक गाने में।</p>
            <span className="mw-rap-hint">पूरा गाना इसी player में सुनिए और देखिए।</span>
            <Link className="mw-rap-story" href="/posts/mobile-world-faridabad-official-rap-song">इस गाने के पीछे की कहानी पढ़िए →</Link>
          </div>
          <div className="mw-rap-embed">
            <iframe
              src="https://www.youtube-nocookie.com/embed/OhNIewPYwuY?rel=0&playsinline=1"
              title="Mobile World Faridabad Rap Song | 1973 से आज तक भरोसे का सफ़र"
              width={1280}
              height={720}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>
        {live("diwali") && <FestivalFlightScene />}
        <FestivalHighlights settings={campaigns} />
        <LatestPost />
        <HomeBody current="/" section="details" />
        <CampaignSocial />
      </div>
    </>
  );
}
