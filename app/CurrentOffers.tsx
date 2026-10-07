import Image from "next/image";
import Link from "next/link";
import { IconArrow } from "@/components/Icons";
import "./current-offers.css";

export function CurrentOffers() {
  return <section id="current-offers" className="current-offers" aria-labelledby="current-offers-title">
    <div className="current-offers-heading"><div><p className="offers-overline">MOBILE WORLD · नई पेशकश</p><h2 id="current-offers-title">नए phones. ख़ास offers.</h2><p>अपना अगला phone जानिए। पसंद आए, तो दुकान पर मिलिए।</p></div></div>
    <div className="current-offers-grid">
      <article className="offer-card offer-redmi" aria-labelledby="redmi-sale-title">
        <header className="offer-card-heading"><div><span className="offer-brand">XIAOMI · REDMI</span><h3 id="redmi-sale-title">REDMI 17C <small>5G</small></h3></div><span className="offer-status"><i aria-hidden="true"/>Sale शुरू</span></header>
        <Link className="offer-image" href="/posts/redmi-17c-5g-sale-offer-specifications-faridabad" aria-label="REDMI 17C की पूरी जानकारी पढ़िए"><Image src="/images/redmi-17c-sale-offer-oct2026.png" alt="REDMI 17C 5G के front, Coffee Brew और Purple Dawn views" width={1536} height={1024} sizes="(max-width: 760px) calc(100vw - 62px), (max-width: 1100px) 45vw, 560px" loading="eager"/></Link>
        <div className="offer-card-content">
          <p className="offer-kicker">IDFC FIRST BANK · 8|0 SCHEME</p>
          <div className="offer-main-benefit"><strong>₹17</strong><div><b>Processing Fee</b><span>के साथ नया REDMI 17C घर लाइए।</span></div></div>
          <div className="offer-specs" aria-label="Redmi 17C के highlights"><span>6000mAh battery</span><span>120Hz तक display</span><span>50MP camera</span></div>
          <p className="offer-summary">बड़ी screen, अपनी पसंद का colour और एक ख़ास finance offer।</p>
          <div className="offer-actions"><Link className="offer-cta" href="/posts/redmi-17c-5g-sale-offer-specifications-faridabad">Offer और phone को जानिए <IconArrow/></Link></div>
        </div>
      </article>
      <article className="offer-card offer-vivo" aria-labelledby="vivo-prebook-title">
        <header className="offer-card-heading"><div><span className="offer-brand">vivo · V SERIES</span><h3 id="vivo-prebook-title">vivo V80 <small>5G</small></h3></div><span className="offer-status"><i aria-hidden="true"/>Pre-booking</span></header>
        <Link className="offer-image" href="/posts/vivo-v80-prebooking-offers-specifications-faridabad" aria-label="vivo V80 की पूरी जानकारी पढ़िए"><Image src="/images/vivo-v80-prebooking-oct2026.png" alt="vivo V80 के Sunrise Anthem, Horizon Blue, Stellar Black और front views" width={1536} height={1024} sizes="(max-width: 760px) calc(100vw - 62px), (max-width: 1100px) 45vw, 560px" loading="eager"/></Link>
        <div className="offer-card-content">
          <p className="offer-kicker">PRE-BOOKING SPECIAL · LIVE DEMO उपलब्ध</p>
          <div className="offer-main-benefit"><strong>10%</strong><div><b>Cashback</b><span>Credit card offer पर</span></div></div>
          <div className="offer-benefits"><div><strong>1 + 1</strong><span>साल warranty benefit</span></div><div><strong>FREE</strong><span>Premium backpack</span></div><div><strong>₹101</strong><span>Down payment offer</span></div></div>
          <p className="offer-summary">Camera से colours तक, V80 को करीब से जानिए और अपना पसंदीदा variant चुनिए।</p>
          <div className="offer-actions"><Link className="offer-cta" href="/posts/vivo-v80-prebooking-offers-specifications-faridabad">Pre-booking benefits देखिए <IconArrow/></Link></div>
        </div>
      </article>
    </div>
  </section>;
}
