import Image from "next/image";
import Link from "next/link";
import { shop } from "@/data/shop";
import { AskWhatsApp } from "./AskWhatsApp";
import { IconYouTube, IconInstagram, IconFacebook, IconHome, IconGrid, IconPin, IconWhatsApp } from "./Icons";

export function SiteFooter() {
  return <footer className="ftr mw-footer"><div className="wrap">
    <div className="mw-footer-top"><div><Link className="logo" href="/"><i><Image src="/images/mobile-world-logo-79e75645.webp" alt="" width={100} height={100} sizes="40px" /></i><span>MOBILE WORLD<s>Mobile · Laptop · Electronics · Home Appliances</s></span></Link><p>आपकी ज़रूरत का सामान।<br />आपकी अपनी दुकान।</p></div>
      <div><h2>Explore कीजिए</h2><Link href="/products">Products और comparison</Link><Link href="/products?view=shortlist">मेरी shortlist</Link><Link href="/posts">Tech Blog और Guides</Link><Link href="/about">हमारा सफ़र</Link><Link href="/team">हमारी Team</Link></div>
      <div><h2>आपकी मदद के लिए</h2><Link href="/finance">EMI और Finance</Link><Link href="/returns">Return और Exchange</Link><Link href="/repairing">Mobile Repairing</Link><Link href="/after-sales-support">ख़रीदने के बाद Support</Link><Link href="/contact">Contact और शिकायत</Link></div>
      <div><h2>हमसे जुड़े रहिए</h2><a href={shop.phone.tel}>{shop.phone.display}</a><Link href="/visit">Gurudwara Road, NIT Faridabad</Link><span>10 AM–10 PM</span><small>हर महीने की आख़िरी तारीख़ को बंद</small><div className="soc"><a href={shop.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram पर Mobile World"><IconInstagram /></a><a href={shop.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube पर Mobile World"><IconYouTube /></a><a href={shop.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook पर Mobile World"><IconFacebook /></a><a href={shop.social.whatsappChannel} target="_blank" rel="noopener noreferrer" aria-label="Mobile World का WhatsApp Channel"><IconWhatsApp /></a></div></div>
    </div>
    <div className="mw-footer-bottom"><span>© {new Date().getFullYear()} {shop.name} · {shop.registeredName}</span><div><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><span>Content: {shop.authorName}</span></div></div>
  </div></footer>;
}

export function MobileBar() {
  return <nav className="mbar" aria-label="जल्दी पहुँचिए"><Link href="/"><IconHome />Home</Link><Link href="/products"><IconGrid />Products</Link><AskWhatsApp /><a href={shop.social.googleMaps} target="_blank" rel="noopener noreferrer"><IconPin />रास्ता</a></nav>;
}
