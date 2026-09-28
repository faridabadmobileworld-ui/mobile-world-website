import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { shop, legacy } from "@/data/shop";
import { MoreLinks } from "@/components/MoreLinks";
import { IconArrow } from "@/components/Icons";

export const metadata: Metadata = {title:"हमारा सफ़र — 1973 से परिवार का business",description:"1973 में Aggarwal Kiryana Store से शुरू हुआ परिवार का business सफ़र, 1996 में अगली पीढ़ी, 2006 में Communication और 2016 में Mobile World।",alternates:{canonical:"/about"}};
export default function About() {
  return <div className="wrap"><section className="mw-about-intro"><div><p className="shopping-overline">MOBILE WORLD · हमारा सफ़र</p><h1>हर सफ़र की शुरुआत<br />एक भरोसे से होती है। ❤️</h1>
    <p>हमारे परिवार का business सफ़र 1973 में Aggarwal Kiryana Store से शुरू हुआ।</p>
    <p>स्व. श्री बाबू लाल जी ने 1973 में एक छोटी सी Kiryana store और बहुत बड़ी ईमानदारी के साथ इस सफ़र की नींव रखी थी।</p>
    <p>साल 1996 में Tarun Gupta जी ने अपने आदरणीय पिताजी के साथ इस business को सँभाला और आगे बढ़ाया।</p>
    <p>इसके बाद 2006 में ज़रूरतें बदलीं, और यह सफ़र Aggarwal Kiryana &amp; Communication के रूप में आगे बढ़ा।</p>
    <p>और 2016 में इसी विरासत को आगे बढ़ाते हुए Mobile World की शुरुआत हुई।</p>
    <p>तब से लेकर आज तक, हमारे साथ जुड़े हर ग्राहक ने इस सफ़र को आगे बढ़ाने में अपना योगदान दिया है।</p>
    <p>हम उन सभी ग्राहकों का दिल से धन्यवाद करते हैं, जिन्होंने वर्षों से हम पर अपना भरोसा बनाए रखा और Mobile World को अपने परिवार का हिस्सा माना।</p></div>
    <aside className="mw-about-photo"><Image src="/images/mobile-world-storefront-on-gurudwara-road-ja-a182b026.webp" alt="Gurudwara Road पर Mobile World की दुकान" width={720} height={340} sizes="(max-width:760px) 90vw, 420px" /><h2>अपनी दुकान। अपनी Team.</h2><p>{shop.address.road}, {shop.address.locality}, {shop.address.city} — हमारी एक ही दुकान है। यहाँ मिलने वाले लोगों से परिचय कीजिए।</p><Link className="mw-text-link" href="/team">हमारी Team <IconArrow /></Link></aside></section>
    <ol className="mw-about-timeline" aria-label="परिवार के business के चार पड़ाव">{legacy.map((m) => <li key={m.year}><b>{m.year}</b><strong>{m.name}</strong><p>{m.body}</p></li>)}</ol><MoreLinks current="/about" /></div>;
}
