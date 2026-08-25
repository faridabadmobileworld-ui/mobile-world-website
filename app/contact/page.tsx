import type { Metadata } from "next";
import { shop } from "@/data/shop";
import { serviceCards, ask, whatsappGeneral } from "@/data/content";
import { IconArrow, IconWhatsApp, IconPhone, IconPin } from "@/components/Icons";
import { LiveBadge } from "@/components/StoreStatus";

export const metadata: Metadata = {
  title: "Contact & support",
  description:
    `${shop.name} se baat kijiye — ${shop.phone.display}. Repair, EMI, exchange, ` +
    `delivery aur installation ke sawaal WhatsApp par seedhe pooch lijiye.`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  const services = serviceCards.filter((s) => shop.services[s.key]);

  return (
    <div className="wrap">
      <section className="sec">
        <div className="shead"><h1>Contact &amp; support</h1></div>
        <p style={{ color: "var(--ink-2)", maxWidth: "62ch", margin: "0 0 18px" }}>
          Koi form nahi hai. Seedhe call kijiye ya WhatsApp par likh dijiye — usi counter
          se jawab milega jahan se saamaan jaata hai.
        </p>

        <div className="cband rv in">
          <h2>Abhi baat kijiye</h2>
          <p style={{ marginBottom: 4 }}><LiveBadge /></p>
          <p>Roz subah 10 baje se raat 10 baje tak, saaton din.</p>
          <div className="btns" style={{ justifyContent: "center" }}>
            <a className="btn btn-w" href={whatsappGeneral} target="_blank" rel="noopener">
              <IconWhatsApp /> WhatsApp
            </a>
            <a className="btn btn-d" href={shop.phone.tel}><IconPhone /> {shop.phone.display}</a>
            <a className="btn btn-o" href={shop.social.googleMaps} target="_blank" rel="noopener">
              <IconPin /> Get directions
            </a>
          </div>
        </div>
      </section>

      <section className="sec" id="service">
        <div className="shead"><h2>Kis baare mein poochhna hai?</h2></div>
        <div className="ctiles">
          {services.map((s) => (
            <a className="ct rv in" key={s.key} href={ask(s.topic)} target="_blank" rel="noopener">
              <span className="m" style={{ background: `var(--${s.tone})` }} />
              <span><b>{s.title}</b><s>{s.body}</s></span>
            </a>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="panel rv in" style={{ maxWidth: 820 }}>
          <h2 style={{ fontSize: "1.1rem", margin: "0 0 10px" }}>Aane se pehle</h2>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: "0 0 10px" }}>
            Jo model chahiye uska naam WhatsApp par bhej dijiye. Hum stock aur aaj ka rate
            pehle hi bata denge — ek hi chakkar mein kaam ho jaayega.
          </p>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
            Bahar se aa rahe hain to nikalne se pehle ek message kar dijiye. Hum bata denge
            ki dukaan khuli hai aur cheez shelf par hai.
          </p>
          <div className="btns" style={{ marginTop: 14 }}>
            <a className="btn btn-h" href={whatsappGeneral} target="_blank" rel="noopener">
              Message the store <IconArrow />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
