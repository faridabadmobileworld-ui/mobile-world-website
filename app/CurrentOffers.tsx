import { campaignIsLive, defaultCampaigns, type CampaignSettings } from "@/lib/campaigns/core";
import Image from "next/image";
import Link from "next/link";
import { IconArrow } from "@/components/Icons";
import "./current-offers.css";
import { oppoF35ProPost, redmi17CPost, vivoV80Post } from "@/data/phoneLaunchPosts";

export function CurrentOffers({ settings = defaultCampaigns() }: { settings?: CampaignSettings }) {
  const live = (id: "redmi" | "vivo" | "oppo") => campaignIsLive(settings.items[id]);
  if (!["redmi", "vivo", "oppo"].some(id => live(id as "redmi" | "vivo" | "oppo"))) return null;
  return <section id="current-offers" className="current-offers" aria-labelledby="current-offers-title">
    <div className="current-offers-heading"><div><p className="offers-overline">MOBILE WORLD · नई पेशकश</p><h2 id="current-offers-title">नए phones. ख़ास offers.</h2><p>अपना अगला phone जानिए। पसंद आए, तो दुकान पर मिलिए।</p></div></div>
    <div className="current-offers-grid">
      {live("redmi") && <article className="offer-card offer-redmi" aria-labelledby="redmi-sale-title">
        <header className="offer-card-heading"><div><span className="offer-brand">XIAOMI · REDMI</span><h3 id="redmi-sale-title">REDMI 17C <small>5G</small></h3></div><span className="offer-status"><i aria-hidden="true"/>Sale शुरू</span></header>
        <Link className="offer-image" href="/posts/redmi-17c-5g-sale-offer-specifications-faridabad" aria-label="REDMI 17C की पूरी जानकारी पढ़िए"><Image src={redmi17CPost.image} alt={redmi17CPost.alt} width={redmi17CPost.imageW} height={redmi17CPost.imageH} sizes="(max-width: 760px) calc(100vw - 62px), (max-width: 1100px) 45vw, 560px" loading="lazy"/></Link>
        <div className="offer-card-content">
          <p className="offer-kicker">IDFC FIRST BANK · 8|0 SCHEME</p>
          <div className="offer-main-benefit"><strong>₹17</strong><div><b>Processing Fee</b><span>के साथ नया REDMI 17C घर लाइए।</span></div></div>
          <div className="offer-specs" aria-label="Redmi 17C के highlights"><span>6000mAh battery</span><span>120Hz तक display</span><span>50MP camera</span></div>
          <p className="offer-summary">बड़ी screen, अपनी पसंद का colour और एक ख़ास finance offer।</p>
          <div className="offer-actions"><Link className="offer-cta" href="/posts/redmi-17c-5g-sale-offer-specifications-faridabad">Offer और phone को जानिए <IconArrow/></Link></div>
        </div>
        {settings.items.redmi.note && <p className="offer-summary">{settings.items.redmi.note}</p>}
      </article>}
      {live("vivo") && <article className="offer-card offer-vivo" aria-labelledby="vivo-prebook-title">
        <header className="offer-card-heading"><div><span className="offer-brand">vivo · V SERIES</span><h3 id="vivo-prebook-title">vivo V80 <small>5G</small></h3></div><span className="offer-status"><i aria-hidden="true"/>Pre-booking</span></header>
        <Link className="offer-image" href="/posts/vivo-v80-prebooking-offers-specifications-faridabad" aria-label="vivo V80 की पूरी जानकारी पढ़िए"><Image src={vivoV80Post.image} alt={vivoV80Post.alt} width={vivoV80Post.imageW} height={vivoV80Post.imageH} sizes="(max-width: 760px) calc(100vw - 62px), (max-width: 1100px) 45vw, 560px" loading="lazy"/></Link>
        <div className="offer-card-content">
          <p className="offer-kicker">PRE-BOOKING SPECIAL · LIVE DEMO उपलब्ध</p>
          <div className="offer-main-benefit"><strong>10%</strong><div><b>Cashback</b><span>Credit card offer पर</span></div></div>
          <div className="offer-benefits"><div><strong>1 + 1</strong><span>साल warranty benefit</span></div><div><strong>FREE</strong><span>Premium backpack</span></div><div><strong>₹101</strong><span>Down payment offer</span></div></div>
          <p className="offer-summary">Camera से colours तक, V80 को करीब से जानिए और अपना पसंदीदा variant चुनिए।</p>
          <div className="offer-actions"><Link className="offer-cta" href="/posts/vivo-v80-prebooking-offers-specifications-faridabad">Pre-booking benefits देखिए <IconArrow/></Link></div>
        </div>
        {settings.items.vivo.note && <p className="offer-summary">{settings.items.vivo.note}</p>}
      </article>}
      {live("oppo") && <article className="offer-card offer-oppo" aria-labelledby="oppo-launch-title">
        <header className="offer-card-heading"><div><span className="offer-brand">OPPO · F SERIES</span><h3 id="oppo-launch-title">F35 Pro <small>5G</small></h3></div><span className="offer-status"><i aria-hidden="true"/>नया launch</span></header>
        <Link className="offer-image" href={`/posts/${oppoF35ProPost.slug}`} aria-label="OPPO F35 Pro की पूरी जानकारी पढ़िए"><Image src={oppoF35ProPost.image} alt={oppoF35ProPost.alt} width={oppoF35ProPost.imageW} height={oppoF35ProPost.imageH} sizes="(max-width:760px) calc(100vw - 62px), (max-width:1100px) 45vw, 380px" /></Link>
        <div className="offer-card-content">
          <p className="offer-kicker">GROUP SELFIES · अपनों के साथ</p>
          <div className="offer-main-benefit"><strong>50MP</strong><div><b>Selfie camera</b><span>100° view और autofocus</span></div></div>
          <div className="offer-specs" aria-label="OPPO F35 Pro के highlights"><span>8000mAh battery</span><span>80W SUPERVOOC</span><span>144Hz तक AMOLED</span></div>
          <p className="offer-summary">Sunrise Orange, Wave Blue या Twilight Brown—अपने colour और RAM/storage options को जानिए।</p>
          <div className="offer-actions"><Link className="offer-cta" href={`/posts/${oppoF35ProPost.slug}`}>F35 Pro की पूरी जानकारी <IconArrow/></Link></div>
        </div>
        {settings.items.oppo.note && <p className="offer-summary">{settings.items.oppo.note}</p>}
      </article>}
    </div>
  </section>;
}
