import Image from "next/image";
import Link from "next/link";
import { IconArrow, IconWhatsApp } from "@/components/Icons";
import { slideEnquiry } from "@/data/storefront";
import "./current-offers.css";

export function CurrentOffers() {
  return <section id="current-offers" className="current-offers" aria-labelledby="current-offers-title">
    <div className="current-offers-heading"><div><p className="offers-overline">MOBILE WORLD · नई पेशकश</p><h2 id="current-offers-title">नए phones. ख़ास offers.</h2><p>Redmi की sale शुरू है। vivo की pre-booking पर मिलने वाले benefits भी जानिए।</p></div><a className="offers-help" href={slideEnquiry("Redmi 17C और vivo V80 के current offers")} target="_blank" rel="noopener noreferrer"><IconWhatsApp/> अपनी eligibility पूछिए</a></div>
    <div className="current-offers-grid">
      <article className="offer-card offer-redmi" aria-labelledby="redmi-sale-title">
        <header className="offer-card-heading"><div><span className="offer-brand">XIAOMI · REDMI</span><h3 id="redmi-sale-title">REDMI 17C <small>5G</small></h3></div><span className="offer-status"><i aria-hidden="true"/>Sale शुरू</span></header>
        <figure className="offer-image"><Image src="/images/redmi-17c-sale-offer-oct2026.png" alt="REDMI 17C 5G के front, Coffee Brew और Purple Dawn views — official product reference से तैयार campaign artwork" width={1536} height={1024} sizes="(max-width: 760px) calc(100vw - 62px), (max-width: 1100px) 45vw, 560px" loading="eager"/></figure>
        <div className="offer-card-content">
          <p className="offer-kicker">IDFC FIRST BANK · FINANCE OFFER</p><div className="offer-main-benefit"><strong>₹17</strong><div><b>Customer PF*</b><span>8|0 scheme पर</span></div></div>
          <p className="offer-important">₹17 Customer PF की राशि है। यह phone की कीमत या पूरा payable amount नहीं है।</p>
          <div className="offer-specs" aria-label="Redmi 17C के highlights"><span>6000mAh battery</span><span>Up to 120Hz display</span><span>50MP camera</span></div>
          <div className="offer-validity"><span>Offer की validity</span><strong>14 November 2026 तक</strong></div>
          <details className="offer-conditions"><summary>Finance offer की शर्तें समझिए</summary><p>यह Customer PF offer REDMI 17C 5G की IDFC FIRST Bank 8|0 scheme पर है। Down payment, EMI, अन्य charges, documents और eligibility की पुष्टि दुकान पर कीजिए। Finance approval lender तय करता है। चुनने से पहले total payable amount और सभी लागू शर्तें समझ लीजिए।</p></details>
          <div className="offer-actions"><a className="offer-cta" href={slideEnquiry("REDMI 17C 5G की sale और IDFC FIRST Bank 8|0 scheme के ₹17 Customer PF offer, EMI, down payment व eligibility")} target="_blank" rel="noopener noreferrer">Offer की जानकारी लीजिए <IconArrow/></a><a className="offer-source" href="https://www.mi.com/in/product/redmi-17c-5g/" target="_blank" rel="noopener noreferrer">Official specifications ↗</a></div>
        </div>
      </article>
      <article className="offer-card offer-vivo" aria-labelledby="vivo-prebook-title">
        <header className="offer-card-heading"><div><span className="offer-brand">vivo · V SERIES</span><h3 id="vivo-prebook-title">vivo V80 <small>5G</small></h3></div><span className="offer-status"><i aria-hidden="true"/>Pre-booking</span></header>
        <figure className="offer-image"><Image src="/images/vivo-v80-prebooking-oct2026.png" alt="vivo V80 के Sunrise Anthem, Horizon Blue, Stellar Black और front views — official product reference से तैयार campaign artwork" width={1536} height={1024} sizes="(max-width: 760px) calc(100vw - 62px), (max-width: 1100px) 45vw, 560px" loading="eager"/></figure>
        <div className="offer-card-content">
          <p className="offer-kicker">PRE-BOOKING BENEFITS · LIVE DEMO उपलब्ध</p><div className="offer-main-benefit"><strong>10%</strong><div><b>Cashback*</b><span>Credit card offer</span></div></div>
          <div className="offer-benefits"><div><strong>1 + 1</strong><span>साल warranty benefit*</span></div><div><strong>FREE</strong><span>Premium backpack*</span></div><div><strong>₹101</strong><span>Down payment offer*</span></div></div>
          <p className="offer-important">ये benefits pre-booking पर हैं। Booking से पहले bank/card eligibility और finance की लागू शर्तें जानिए।</p>
          <details className="offer-conditions"><summary>Pre-booking की शर्तें समझिए</summary><p>10% cashback के लिए लागू bank, credit card, transaction type, cashback limit और मिलने का समय दुकान से confirm कीजिए। ₹101 down payment finance eligibility और lender approval पर निर्भर है; यह phone की पूरी कीमत नहीं है।</p><p>1+1 साल warranty/extended warranty benefit संबंधित brand या offer programme की शर्तों के अनुसार है—दुकान की अलग warranty नहीं। Free backpack, offer period, variant और delivery की पुष्टि pre-booking से पहले कीजिए।</p></details>
          <div className="offer-actions"><a className="offer-cta" href={slideEnquiry("vivo V80 की pre-booking, 10% credit card cashback, 1+1 साल warranty benefit, free backpack और ₹101 down payment की eligibility व शर्तें")} target="_blank" rel="noopener noreferrer">Pre-booking के लिए बात कीजिए <IconArrow/></a><Link className="offer-source" href="/visit">Live demo देखने आइए <IconArrow/></Link></div>
        </div>
      </article>
    </div>
    <p className="offers-footnote">*Offers की शर्तें लागू हैं। Variant, stock, bank/finance eligibility और benefits की पुष्टि हमारी team से कीजिए। Product artwork सांकेतिक है; actual device और लागू offer को अंतिम मानें।</p>
  </section>;
}
