import type { Metadata } from "next";
import { shop } from "@/data/shop";
import { whatsappGeneral } from "@/data/content";
import { IconArrow, IconWhatsApp, IconPhone, IconPin } from "@/components/Icons";
import { FollowUs } from "@/components/FollowUs";
import { Banner } from "@/components/Banner";
import { GoogleQR } from "@/components/GoogleQR";
import { MoreLinks } from "@/components/MoreLinks";
import { LiveBadge, NextClosure } from "@/components/StoreStatus";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { PageFoot, Byline } from "@/components/PageFoot";

export const metadata: Metadata = {
  title: "Contact Us — सीधे Call और WhatsApp",
  description:
    `${shop.address.city} में mobile, laptop या electronics के लिए सीधे contact ` +
    `कीजिए। ${shop.address.locality} की shop timing, phone number और WhatsApp यहाँ।`,
  alternates: { canonical: "/contact" },
};

const toc: TocItem[] = [
  { id: "abhi-baat", label: "अभी बात कीजिए — हम आपके लिए खुले हैं" },
  { id: "pata", label: "हमारी दुकान का exact पता" },
  { id: "pehle-message", label: "आने से पहले एक छोटा सा WhatsApp message" },
  { id: "grievance", label: "शिकायत हो तो सीधे मालिक से" },
  { id: "google", label: "Google पर हमारी listing" },
];

export default function Contact() {
  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 10px" }}>
          Contact Us — सीधे counter से बात कीजिए, बिना किसी form के!
        </h1>
        <TableOfContents items={toc} />

        <div className="prose" style={{ marginBottom: 18 }}>
          <p>हम digital world में भी personal touch पर भरोसा करते हैं।</p>
          <p>
            यहाँ कोई complicated contact form नहीं है। सीधे call कीजिए या WhatsApp पर
            message भेजिए — जवाब उसी counter से मिलेगा जहाँ से सामान आपके हाथों में
            जाता है।
          </p>
        </div>

        <div className="cband rv in" id="abhi-baat">
          <h2>अभी बात कीजिए — हम आपके लिए खुले हैं</h2>
          <p style={{ marginBottom: 4 }}><LiveBadge /></p>
          <p><strong>Timing:</strong> रोज़ सुबह 10:00 बजे से रात 10:00 बजे तक, सातों दिन।</p>
          <p style={{ marginTop: 2 }}>
            <strong>Note:</strong> दुकान हर महीने की आख़िरी तारीख़ को बंद रहती है —
            अगली छुट्टी <NextClosure />।
          </p>
          <div className="btns" style={{ justifyContent: "center" }}>
            <a className="btn btn-w" href={whatsappGeneral} target="_blank" rel="noopener">
              <IconWhatsApp /> WhatsApp पर पूछिए
            </a>
            <a className="btn btn-d" href={shop.phone.tel}><IconPhone /> {shop.phone.display}</a>
            <a className="btn btn-o" href={shop.social.googleMaps} target="_blank" rel="noopener">
              <IconPin /> रास्ता देखिए
            </a>
          </div>
        </div>

        <div className="panel rv in" id="grievance"
             style={{ maxWidth: "var(--measure)", marginTop: 10 }}>
          <h2 style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>
            ⚠️ शिकायत हो तो सीधे मालिक से बात कीजिए
          </h2>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: "0 0 10px" }}>
            कोई बात counter पर हल न हो, या कोई शिकायत हो — तो {shop.owner} जी से
            सीधे बात कर लीजिए। बीच में कोई नहीं है।
          </p>
          <p style={{ fontSize: 15, margin: 0 }}>
            <strong>Grievance / Direct Contact ({shop.owner} जी):</strong>{" "}
            <a href={shop.phone.grievanceTel}
               style={{ color: "var(--brand)", fontWeight: 800 }}>
              {shop.phone.grievanceDisplay}
            </a>
          </p>
        </div>
      </section>

      <section className="sec">
        <Banner src="/images/mobile-world-storefront-on-gurudwara-road-ja-a182b026.webp"
          w={720} h={340}
          alt={`${shop.name} की दुकान — ${shop.address.road}, ${shop.address.locality}, ${shop.address.city}`} />
      </section>

      <section className="sec">
        <div className="panel rv in" style={{ maxWidth: "var(--measure)" }}>
          <h2 id="pata" style={{ fontSize: "1.1rem", margin: "0 0 10px" }}>
            हमारी दुकान का exact पता
          </h2>
          <address style={{ fontStyle: "normal", fontSize: 14.5, lineHeight: 1.85,
                            color: "var(--ink-2)", margin: 0 }}>
            <strong style={{ color: "var(--ink)" }}>{shop.name}</strong><br />
            {shop.address.street},<br />
            {shop.address.landmark},<br />
            {shop.address.locality}, {shop.address.city}, {shop.address.state},
            {" "}India – {shop.address.postalCode}
          </address>
          <div className="btns" style={{ marginTop: 14 }}>
            <a className="btn btn-o" href={shop.social.googleMaps} target="_blank" rel="noopener">
              <IconPin /> रास्ता देखिए
            </a>
          </div>
        </div>

        <div className="panel rv in" id="grievance"
             style={{ maxWidth: "var(--measure)", marginTop: 10 }}>
          <h2 style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>
            ⚠️ शिकायत हो तो सीधे मालिक से बात कीजिए
          </h2>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: "0 0 10px" }}>
            कोई बात counter पर हल न हो, या कोई शिकायत हो — तो {shop.owner} जी से
            सीधे बात कर लीजिए। बीच में कोई नहीं है।
          </p>
          <p style={{ fontSize: 15, margin: 0 }}>
            <strong>Grievance / Direct Contact ({shop.owner} जी):</strong>{" "}
            <a href={shop.phone.grievanceTel}
               style={{ color: "var(--brand)", fontWeight: 800 }}>
              {shop.phone.grievanceDisplay}
            </a>
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="panel rv in" style={{ maxWidth: "var(--measure)" }}>
          <h2 id="pehle-message" style={{ fontSize: "1.1rem", margin: "0 0 10px" }}>
            आने से पहले एक छोटा सा WhatsApp message कर दीजिए
          </h2>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: "0 0 10px" }}>
            बाहर से आ रहे हैं, तो निकलने से पहले WhatsApp पर product का नाम भेज दीजिए।
          </p>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
            हम आपको तुरंत बता देंगे कि item shelf पर available है या नहीं — ताकि आपका
            क़ीमती समय और चक्कर दोनों बच सकें।
          </p>
          <div className="btns" style={{ marginTop: 14 }}>
            <a className="btn btn-h" href={whatsappGeneral} target="_blank" rel="noopener">
              दुकान को Message कीजिए <IconArrow />
            </a>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="shead"><h2 id="google">Google पर हमारी listing</h2></div>
        <p style={{ color: "var(--ink-2)", maxWidth: "62ch", margin: "0 0 14px" }}>
          Google Maps पर जो जानकारी दिखती है, वही यहाँ भी है — ताकि आपको दो जगह
          मिलान न करना पड़े।
        </p>

        <dl className="gmb">
          <div>
            <dt>Business का नाम</dt>
            <dd>{shop.name}</dd>
          </div>
          <div>
            <dt>क्या-क्या है</dt>
            <dd>{shop.tagline}</dd>
          </div>
          <div>
            <dt>पूरा पता</dt>
            <dd>
              {shop.address.street}, {shop.address.landmark},<br />
              {shop.address.locality}, {shop.address.city}, {shop.address.state},
              {" "}India – {shop.address.postalCode}
            </dd>
          </div>
          <div>
            <dt>Phone और WhatsApp</dt>
            <dd><a href={shop.phone.tel}>{shop.phone.display}</a></dd>
          </div>
          <div>
            <dt>खुलने का समय</dt>
            <dd>रोज़ सुबह 10:00 से रात 10:00 बजे तक, सातों दिन।</dd>
          </div>
          <div>
            <dt>छुट्टी</dt>
            <dd>हर महीने की आख़िरी तारीख़ — अगली <NextClosure />।</dd>
          </div>
          <div>
            <dt>Payment के तरीक़े</dt>
            <dd>{shop.paymentMethods.join(" · ")}</dd>
          </div>
          <div>
            <dt>Website</dt>
            <dd><a href={shop.siteUrl}>{shop.siteUrl.replace("https://", "")}</a></dd>
          </div>
          <div>
            <dt>Proprietor</dt>
            <dd>{shop.owner}</dd>
          </div>
          <div>
            <dt>Registered नाम</dt>
            <dd>{shop.registeredName}</dd>
          </div>
        </dl>

        <div className="btns" style={{ marginTop: 16 }}>
          <a className="btn btn-d" href={shop.social.googleMaps} target="_blank" rel="noopener">
            <IconPin /> Google Maps पर खोलिए
          </a>
        </div>

        <div style={{ marginTop: 18 }}>
          <GoogleQR />
        </div>
      </section>

      <Byline />

      <MoreLinks current="/contact" />
      <PageFoot />
      <FollowUs />
    </div>
  );
}
