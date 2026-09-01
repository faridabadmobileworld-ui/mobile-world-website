import type { Metadata } from "next";
import Image from "next/image";
import { shop } from "@/data/shop";
import { whatsappGeneral } from "@/data/content";
import { IconWhatsApp, IconPin, IconPhone } from "@/components/Icons";
import { FollowUs } from "@/components/FollowUs";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { PageFoot, Byline } from "@/components/PageFoot";
import { Banner } from "@/components/Banner";
import { GoogleQR } from "@/components/GoogleQR";
import { LiveBadge, NextClosure } from "@/components/StoreStatus";

export const metadata: Metadata = {
  title: "दुकान पर आइए",
  description:
    `${shop.name} — ${shop.address.street}, ${shop.address.landmark}, ` +
    `${shop.address.locality}, ${shop.address.city} – ${shop.address.postalCode}। ` +
    `रोज़ सुबह 10 से रात 10, सातों दिन। हर महीने की आख़िरी तारीख़ को बंद।`,
  alternates: { canonical: "/visit" },
};

const toc: TocItem[] = [
  { id: "pata", label: "दुकान का पता और नक़्शा" },
  { id: "kab-khuli", label: "कब खुली रहती है" },
  { id: "kab-band", label: "कब बंद रहती है" },
  { id: "pehchan", label: "पहचान" },
];

export default function Visit() {
  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 6px" }}>
          दुकान पर आइए, और हमें सेवा का मौक़ा दीजिए
        </h1>
        <p style={{ color: "var(--ink-2)", maxWidth: "60ch", margin: "0 0 16px" }}>
          आने से पहले model का नाम WhatsApp कर दीजिए। हम बता देंगे कि वो दुकान पर
          मौजूद है या नहीं — ताकि आपका चक्कर बेकार न जाए।
        </p>

        <Byline />
        <TableOfContents items={toc} />

        <Banner src="/images/visit-mobile-world-store-gurudwara-road-3656c82d.webp"
          alt={`${shop.name} — ${shop.address.road}, ${shop.address.locality}, ${shop.address.city}`} />

        <div className="cband rv in">
          <span className="cico" aria-hidden="true">
            <Image src="/images/icon-shop-2b14210e.webp" alt="" width={200} height={200} sizes="96px" />
          </span>
          <h2 id="pata">{shop.name}</h2>
          <p>
            {shop.address.street}<br />
            {shop.address.landmark}<br />
            {shop.address.locality}, {shop.address.city}, {shop.address.state} {shop.address.postalCode}
          </p>
          <p style={{ marginTop: 12, fontSize: "clamp(14px,2.1vw,15.5px)",
                      lineHeight: 1.85, color: "var(--ink)", maxWidth: "48ch",
                      marginInline: "auto" }}>
            आपकी ज़रूरत हमारी प्राथमिकता है। हम देते हैं आपको भरोसा, गुणवत्ता
            और बेहतरीन सेवा — हमेशा।
          </p>
          <p style={{ marginTop: 12 }}><LiveBadge /></p>
          <p style={{ marginTop: 6 }}>
            <b>रोज़ सुबह 10 से रात 10, सातों दिन।</b> सिर्फ़ हर महीने की आख़िरी
            तारीख़ को बंद — अगली छुट्टी <NextClosure />।
          </p>

          <GoogleQR />

          <div className="btns" style={{ justifyContent: "center" }}>
            <a className="btn btn-d" href={shop.social.googleMaps} target="_blank" rel="noopener">
              <IconPin /> रास्ता देखिए
            </a>
            <a className="btn btn-o" href={shop.phone.tel}><IconPhone /> {shop.phone.display}</a>
            <a className="btn btn-w" href={whatsappGeneral} target="_blank" rel="noopener">
              <IconWhatsApp /> WhatsApp पर पूछिए
            </a>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="cols3">
          <div className="panel rv in">
            <h2 id="kab-khuli" style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>कब खुली रहती है</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
              सातों दिन, सुबह 10 से रात 10। कोई weekly off नहीं।
            </p>
          </div>
          <div className="panel rv in">
            <h2 id="kab-band" style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>कब बंद रहती है</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
              हर महीने की आख़िरी तारीख़ — 28, 29, 30 या 31, जो भी हो। उस दिन
              पूरा बाज़ार बंद रहता है।
            </p>
          </div>
          <div className="panel rv in">
            <h2 id="pehchan" style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>पहचान</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
              {shop.address.landmark}। {shop.address.road} पर, {shop.address.locality} में।
            </p>
          </div>
        </div>
      </section>

      <section className="sec">
        <p className="thanks rv in">
          ❤️ आपकी संतुष्टि, हमारा संकल्प।
        </p>
      </section>

      <PageFoot />
      <FollowUs />
    </div>
  );
}
