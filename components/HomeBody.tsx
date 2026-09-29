import Image from "next/image";
import Link from "next/link";
import { shop, brands } from "@/data/shop";
import { livePosts, storePhotos } from "@/data/content";
import { phoneModels } from "@/data/catalog";
import { PhoneFinder } from "./PhoneFinder";
import { IconArrow, IconWhatsApp, IconPin, IconPhone } from "./Icons";
import { LiveBadge } from "./StoreStatus";

export function HomeBody({ journey = true }: { current?: string; journey?: boolean }) {
  const guideSlugs = ["new-phones", "best-laptops-students", "phone-exchange-guide"];
  const guides = guideSlugs.flatMap((slug) => livePosts().filter((p) => p.slug === slug));
  const guideImages = ["/images/model-iphone16.png", "/images/laptop-for-study-and-office-a146b020.webp", "/images/purana-aur-naya-phone-counter-par.webp"];
  return <>
    <section className="mw-section" id="selected-models">
      <div className="shopping-section-heading"><div><p className="shopping-overline">करीब से देखिए · SELECTED MODELS</p><h2>आपकी अगली पसंद, यहाँ से।</h2></div><Link href="/products">Models compare कीजिए <IconArrow /></Link></div>
      <div className="mw-model-grid">
        {phoneModels.map((p) => <Link href={`/products?model=${p.id}`} className="mw-model-card mw-featured" key={p.id}>
          <div className="mw-model-media"><Image src={p.image} alt={p.imageAlt} width={800} height={600} sizes="(max-width:700px) 85vw, 380px" /><span className="mw-brand">{p.brand}</span><span className="mw-round-arrow" aria-hidden="true"><IconArrow /></span></div>
          <div className="mw-model-body"><h3>{p.name}</h3><p>{p.note}</p><div className="mw-featured-bottom"><span>{p.processor}</span><b>जानकारी देखिए <IconArrow /></b></div></div>
        </Link>)}
      </div>
      <div className="mw-brands"><span>अपना brand चुनिए</span><p>{brands.map((b) => b.name).join(" · ")}</p></div>
    </section>

    <PhoneFinder />

import Image from "next/image";
import Link from "next/link";
import { shop, brands } from "@/data/shop";
import { livePosts, storePhotos } from "@/data/content";
import { availablePhoneModels, upcomingPhoneModels } from "@/data/catalog";
import { PhoneFinder } from "./PhoneFinder";
import { IconArrow, IconWhatsApp, IconPin, IconPhone } from "./Icons";
import { LiveBadge } from "./StoreStatus";

export function HomeBody({ journey = true }: { current?: string; journey?: boolean }) {
  const guideSlugs = ["new-phones", "best-laptops-students", "phone-exchange-guide"];
  const guides = guideSlugs.flatMap((slug) => livePosts().filter((p) => p.slug === slug));
  const guideImages = ["/images/iphone-display-at-the-mobile-world-counter-346d3e71.webp", "/images/laptop-for-study-and-office-a146b020.webp", "/images/purana-aur-naya-phone-counter-par.webp"];
  const featuredModels = availablePhoneModels.slice(0, 6);
  return <>
    <section className="mw-section" id="selected-models">
      <div className="shopping-section-heading"><div><p className="shopping-overline">करीब से देखिए · SELECTED MODELS</p><h2>आपकी अगली पसंद, यहाँ से।</h2></div><Link href="/products">Models compare कीजिए <IconArrow /></Link></div>
      <div className="mw-model-grid">
        {featuredModels.map((p) => <Link href={`/products?model=${p.id}`} className="mw-model-card mw-featured" key={p.id}>
          <div className="mw-model-media"><Image src={p.image} alt={p.imageAlt} width={800} height={600} sizes="(max-width:700px) 85vw, 380px" /><span className="mw-brand">{p.brand}</span><span className="mw-round-arrow" aria-hidden="true"><IconArrow /></span></div>
          <div className="mw-model-body"><h3>{p.name}</h3><p>{p.note}</p><div className="mw-featured-bottom"><span>{p.processor}</span><b>जानकारी देखिए <IconArrow /></b></div></div>
        </Link>)}
      </div>

      {upcomingPhoneModels.length > 0 && <div className="mw-upcoming-strip" aria-label="Upcoming models"><span>Upcoming</span>{upcomingPhoneModels.map((p) => <Link key={p.id} href={`/products?model=${p.id}`}>{p.name} · details बाद में</Link>)}</div>}
      <div className="mw-brands"><span>अपना brand चुनिए</span><p>{brands.map((b) => b.name).join(" · ")}</p></div>
    </section>

    <PhoneFinder />

    <section className="mw-section">
      <div className="shopping-section-heading"><div><p className="shopping-overline">ख़रीदारी के साथ · हमारी SERVICES</p><h2>हर अगले क़दम पर, मदद।</h2></div></div>
      <div className="mw-service-grid">
        {[
          {n:"01", title:"आसान EMI की जानकारी", body:"Card EMI, paper finance और ज़रूरी documents समझिए। Approval bank या lender तय करता है।", href:"/finance", link:"EMI की जानकारी लीजिए", mark:"₹"},
          {n:"02", title:"पुराने phone से नया upgrade", body:"दुकान पर phone की जाँच के बाद exchange value पता कीजिए। पहले ज़रूरी तैयारी समझ लीजिए।", href:"/returns", link:"Exchange समझिए", mark:"↗"},
          {n:"03", title:"Repair और बाद की मदद", body:"Phone में परेशानी या settings में मदद चाहिए? अपनी दिक़्क़त बताइए और team से बात कीजिए।", href:"/repairing", link:"Repairing की जानकारी", mark:"+"},
        ].map((s) => <Link className="mw-service-card" href={s.href} key={s.n}><div className="mw-service-top"><span>{s.mark}</span><small>{s.n}</small></div><h3>{s.title}</h3><p>{s.body}</p><b>{s.link}<IconArrow /></b></Link>)}
      </div>
    </section>

    <section className="mw-community" aria-labelledby="community-title">
      <div className="mw-community-copy"><p className="shopping-overline">MOBILE WORLD · अपने लोगों के साथ</p><h2 id="community-title">सिर्फ़ ख़रीदारी नहीं,<br />एक पहचान भी।</h2><p>दुकान पर मिलिए, products देखिए और अपनी ज़रूरत पर खुलकर बात कीजिए। हमारे साथ जुड़े परिवार ही हमारे सफ़र का हिस्सा हैं।</p><a className="mw-text-link" href={shop.social.googleMaps} target="_blank" rel="noopener noreferrer">Google पर ग्राहकों के अनुभव पढ़िए <IconArrow /></a>{journey && <div className="mw-story-mini"><span>1973 से परिवार का business · 2016 से Mobile World</span><Link href="/about">हमारा सफ़र जानिए <IconArrow /></Link></div>}</div>
      <div className="mw-community-photos">{[storePhotos[3],storePhotos[2]].map((p) => <figure key={p.src}><Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(max-width:700px) 45vw, 280px" /><figcaption>{p.title} · Mobile World</figcaption></figure>)}</div>
    </section>

    <section className="mw-section">
      <div className="shopping-section-heading"><div><p className="shopping-overline">ख़रीदने से पहले · उपयोगी GUIDES</p><h2>थोड़ी जानकारी। बेहतर फ़ैसला।</h2></div><Link href="/posts">सभी guides <IconArrow /></Link></div>
      <div className="mw-guide-grid">{guides.map((p, i) => <Link className="mw-guide" href={`/posts/${p.slug}`} key={p.slug}><div className="mw-guide-image"><Image src={guideImages[i]} alt={p.title} width={800} height={530} sizes="(max-width:700px) 90vw, 380px" /></div><div><span>GUIDE · ख़रीदारी से पहले</span><h3>{p.title}</h3><b>Guide पढ़िए <IconArrow /></b></div></Link>)}</div>
    </section>

    <section className="mw-visit" id="visit" aria-labelledby="visit-title">
      <div className="mw-visit-image"><Image src={storePhotos[1].src} alt="Gurudwara Road पर Mobile World का असली storefront" width={720} height={340} sizes="(max-width:700px) 94vw, 550px" /><span><IconPin /> Jawahar Colony · NIT Faridabad</span></div>
      <div className="mw-visit-copy"><p className="shopping-overline">ONLINE देखिए · STORE पर मिलिए</p><h2 id="visit-title">आपकी अपनी Mobile World.</h2><p>Product को हाथ में देखिए। अपनी पसंद की तुलना कीजिए। फिर फ़ैसला लीजिए।</p><address>{shop.address.street}, {shop.address.landmark}, {shop.address.locality}, {shop.address.city}, {shop.address.state} – {shop.address.postalCode}</address><div className="mw-hours"><LiveBadge /><span>10:00 AM–10:00 PM · महीने की आख़िरी तारीख़ को बंद</span></div><div className="btns"><a className="shopping-primary" href={shop.social.googleMaps} target="_blank" rel="noopener noreferrer"><IconPin /> रास्ता देखिए</a><a className="shopping-secondary" href={shop.phone.tel}><IconPhone /> Call कीजिए</a></div><a className="mw-text-link mw-visit-chat" href={shop.phone.whatsapp} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> आने से पहले stock पूछ लीजिए</a></div>
    </section>
  </>;
}
    <section className="mw-section">
      <div className="shopping-section-heading"><div><p className="shopping-overline">ख़रीदारी के साथ · हमारी SERVICES</p><h2>हर अगले क़दम पर, मदद।</h2></div></div>
      <div className="mw-service-grid">
        {[
          {n:"01", title:"आसान EMI की जानकारी", body:"Card EMI, paper finance और ज़रूरी documents समझिए। Approval bank या lender तय करता है।", href:"/finance", link:"EMI की जानकारी लीजिए", mark:"₹"},
          {n:"02", title:"पुराने phone से नया upgrade", body:"दुकान पर phone की जाँच के बाद exchange value पता कीजिए। पहले ज़रूरी तैयारी समझ लीजिए।", href:"/returns", link:"Exchange समझिए", mark:"↗"},
          {n:"03", title:"Repair और बाद की मदद", body:"Phone में परेशानी या settings में मदद चाहिए? अपनी दिक़्क़त बताइए और team से बात कीजिए।", href:"/repairing", link:"Repairing की जानकारी", mark:"+"},
        ].map((s) => <Link className="mw-service-card" href={s.href} key={s.n}><div className="mw-service-top"><span>{s.mark}</span><small>{s.n}</small></div><h3>{s.title}</h3><p>{s.body}</p><b>{s.link}<IconArrow /></b></Link>)}
      </div>
    </section>

    <section className="mw-community" aria-labelledby="community-title">
      <div className="mw-community-copy"><p className="shopping-overline">MOBILE WORLD · अपने लोगों के साथ</p><h2 id="community-title">सिर्फ़ ख़रीदारी नहीं,<br />एक पहचान भी।</h2><p>दुकान पर मिलिए, products देखिए और अपनी ज़रूरत पर खुलकर बात कीजिए। हमारे साथ जुड़े परिवार ही हमारे सफ़र का हिस्सा हैं।</p><a className="mw-text-link" href={shop.social.googleMaps} target="_blank" rel="noopener noreferrer">Google पर ग्राहकों के अनुभव पढ़िए <IconArrow /></a>{journey && <div className="mw-story-mini"><span>1973 से परिवार का business · 2016 से Mobile World</span><Link href="/about">हमारा सफ़र जानिए <IconArrow /></Link></div>}</div>
      <div className="mw-community-photos">{[storePhotos[3],storePhotos[2]].map((p) => <figure key={p.src}><Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(max-width:700px) 45vw, 280px" /><figcaption>{p.title} · Mobile World</figcaption></figure>)}</div>
    </section>

    <section className="mw-section">
      <div className="shopping-section-heading"><div><p className="shopping-overline">ख़रीदने से पहले · उपयोगी GUIDES</p><h2>थोड़ी जानकारी। बेहतर फ़ैसला।</h2></div><Link href="/posts">सभी guides <IconArrow /></Link></div>
      <div className="mw-guide-grid">{guides.map((p, i) => <Link className="mw-guide" href={`/posts/${p.slug}`} key={p.slug}><div className="mw-guide-image"><Image src={guideImages[i]} alt={p.title} width={800} height={530} sizes="(max-width:700px) 90vw, 380px" /></div><div><span>GUIDE · ख़रीदारी से पहले</span><h3>{p.title}</h3><b>Guide पढ़िए <IconArrow /></b></div></Link>)}</div>
    </section>

    <section className="mw-visit" id="visit" aria-labelledby="visit-title">
      <div className="mw-visit-image"><Image src={storePhotos[1].src} alt="Gurudwara Road पर Mobile World का असली storefront" width={720} height={340} sizes="(max-width:700px) 94vw, 550px" /><span><IconPin /> Jawahar Colony · NIT Faridabad</span></div>
      <div className="mw-visit-copy"><p className="shopping-overline">ONLINE देखिए · STORE पर मिलिए</p><h2 id="visit-title">आपकी अपनी Mobile World.</h2><p>Product को हाथ में देखिए। अपनी पसंद की तुलना कीजिए। फिर फ़ैसला लीजिए।</p><address>{shop.address.street}, {shop.address.landmark}, {shop.address.locality}, {shop.address.city}, {shop.address.state} – {shop.address.postalCode}</address><div className="mw-hours"><LiveBadge /><span>10:00 AM–10:00 PM · महीने की आख़िरी तारीख़ को बंद</span></div><div className="btns"><a className="shopping-primary" href={shop.social.googleMaps} target="_blank" rel="noopener noreferrer"><IconPin /> रास्ता देखिए</a><a className="shopping-secondary" href={shop.phone.tel}><IconPhone /> Call कीजिए</a></div><a className="mw-text-link mw-visit-chat" href={shop.phone.whatsapp} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> आने से पहले stock पूछ लीजिए</a></div>
    </section>
  </>;
}
