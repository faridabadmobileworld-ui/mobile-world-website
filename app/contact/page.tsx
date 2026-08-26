import type { Metadata } from "next";
import { shop } from "@/data/shop";
import { serviceCards, ask, whatsappGeneral } from "@/data/content";
import { IconArrow, IconWhatsApp, IconPhone, IconPin } from "@/components/Icons";
import { FollowUs } from "@/components/FollowUs";
import { LiveBadge } from "@/components/StoreStatus";

export const metadata: Metadata = {
  title: "बात कीजिए",
  description:
    `${shop.name} से सीधे बात कीजिए — ${shop.phone.display}। Repair, EMI, Exchange, ` +
    `Delivery और Installation के सवाल WhatsApp पर पूछ लीजिए। कोई form नहीं।`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  const services = serviceCards.filter((s) => shop.services[s.key]);

  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 6px" }}>बात कीजिए</h1>
        <p style={{ color: "var(--ink-2)", maxWidth: "62ch", margin: "0 0 18px" }}>
          कोई form नहीं है। सीधे call कीजिए या WhatsApp पर लिख दीजिए — जवाब उसी
          counter से मिलेगा जहाँ से सामान जाता है।
        </p>

        <div className="cband rv in">
          <h2>अभी बात कीजिए</h2>
          <p style={{ marginBottom: 4 }}><LiveBadge /></p>
          <p>रोज़ सुबह 10 बजे से रात 10 बजे तक, सातों दिन।</p>
          <div className="btns" style={{ justifyContent: "center" }}>
            <a className="btn btn-w" href={whatsappGeneral} target="_blank" rel="noopener">
              <IconWhatsApp /> Model बताइए, Rate बता देंगे
            </a>
            <a className="btn btn-d" href={shop.phone.tel}><IconPhone /> {shop.phone.display}</a>
            <a className="btn btn-o" href={shop.social.googleMaps} target="_blank" rel="noopener">
              <IconPin /> रास्ता देखिए
            </a>
          </div>
        </div>
      </section>

      <section className="sec" id="service">
        <div className="shead"><h2>किस बारे में पूछना है?</h2></div>
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
          <h2 style={{ fontSize: "1.1rem", margin: "0 0 10px" }}>आने से पहले</h2>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: "0 0 10px" }}>
            जो model चाहिए उसका नाम WhatsApp पर भेज दीजिए। हम stock और आज का rate
            पहले ही बता देंगे — एक ही चक्कर में काम हो जाएगा।
          </p>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
            बाहर से आ रहे हैं तो निकलने से पहले एक message कर दीजिए। हम बता देंगे कि
            दुकान खुली है और जो चाहिए वो shelf पर है।
          </p>
          <div className="btns" style={{ marginTop: 14 }}>
            <a className="btn btn-h" href={whatsappGeneral} target="_blank" rel="noopener">
              दुकान को Message कीजिए <IconArrow />
            </a>
          </div>
        </div>
      </section>

      <FollowUs />
    </div>
  );
}
