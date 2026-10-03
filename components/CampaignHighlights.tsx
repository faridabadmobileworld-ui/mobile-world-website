import Image from "next/image";
import { shop } from "@/data/shop";
import { slideEnquiry } from "@/data/storefront";
import { IconArrow, IconFacebook, IconInstagram, IconWhatsApp, IconYouTube } from "./Icons";

export function FestivalHighlights() {
  return <section className="festival-section" id="festival-highlights" aria-labelledby="festival-title">
    <div className="shopping-section-heading"><div><p className="shopping-overline">DIWALI SPECIAL · ख़ुशियों के साथ</p><h2 id="festival-title">इस बार, कुछ ख़ास।</h2></div></div>
    <div className="festival-grid">
      <article className="festival-card festival-travel">
        <div className="festival-image"><Image src="/images/mw-diwali-2026.webp" alt="माँ वैष्णो देवी helicopter यात्रा और Diwali gifts का campaign artwork" fill sizes="(max-width:767px) 160vw, 850px" /></div>
        <div className="festival-copy"><p className="shopping-overline">DIWALI CAMPAIGN</p><h3>माँ वैष्णो देवी यात्रा वाली ख़ुशी।</h3><p>Couples के लिए helicopter यात्रा और Fridge, Washing Machine, TV व Oven जैसे campaign prizes की जानकारी लीजिए।</p><a className="mw-text-link" href={slideEnquiry("Diwali campaign की dates, भागीदारी, prize selection और यात्रा की पूरी शर्तों")} target="_blank" rel="noopener noreferrer">पूरी शर्तें जानिए <IconArrow /></a></div>
      </article>
      <article className="festival-card">
        <div className="festival-image"><Image src="/images/mw-festival-gifts-2026.webp" alt="Trolley bag, cycle, soundbar और smartwatch का festival gift display" fill sizes="(max-width:767px) 160vw, 850px" /></div>
        <div className="festival-copy"><p className="shopping-overline">GIFTS और ACCESSORY OFFERS</p><h3>आपकी ख़रीदारी, आपकी ख़ुशी।</h3><p>Gifts, Apple/Samsung charger offers और दूसरे festival benefits की current eligibility हमारी team से समझिए।</p><a className="mw-text-link" href={slideEnquiry("मेरे चुने हुए product पर festival gifts और accessory offers की eligibility")} target="_blank" rel="noopener noreferrer">मेरे product पर क्या लागू है? <IconArrow /></a></div>
      </article>
    </div>
    <p className="festival-terms">Campaign visuals सांकेतिक हैं। Gifts, participation, dates और stock की पुष्टि दुकान से कीजिए।</p>
  </section>;
}

export function CampaignSocial() {
  const links = [
    { name: "Instagram", description: "दुकान की झलक", href: shop.social.instagram, Icon: IconInstagram },
    { name: "YouTube", description: "Products को करीब से देखिए", href: shop.social.youtube, Icon: IconYouTube },
    { name: "Facebook", description: "हमारे साथ जुड़े रहिए", href: shop.social.facebook, Icon: IconFacebook },
    { name: "WhatsApp Channel", description: "नई updates देखिए", href: shop.social.whatsappChannel, Icon: IconWhatsApp },
  ];
  return <section className="campaign-social" aria-labelledby="social-title">
    <div><p className="shopping-overline">MOBILE WORLD · जुड़े रहिए</p><h2 id="social-title">दुकान की ख़बरें, आपकी screen पर।</h2><p>नई ख़ुशियाँ, product videos और हमारी रोज़ की छोटी-बड़ी बातें।</p></div>
    <div className="campaign-social-links">{links.map(({name, description, href, Icon}) => <a key={name} href={href} target="_blank" rel="noopener noreferrer"><Icon /><span><b>{name}</b><small>{description}</small></span><IconArrow /></a>)}</div>
  </section>;
}
