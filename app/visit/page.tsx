import type { Metadata } from "next";
import Image from "next/image";
import { shop } from "@/data/shop";
import { whatsappGeneral } from "@/data/content";
import { IconWhatsApp, IconPin, IconPhone } from "@/components/Icons";
import { FollowUs } from "@/components/FollowUs";
import { LiveBadge, NextClosure } from "@/components/StoreStatus";

export const metadata: Metadata = {
  title: "दुकान पर आइए",
  description:
    `${shop.name} — ${shop.address.street}, ${shop.address.landmark}, ` +
    `${shop.address.locality}, ${shop.address.city} – ${shop.address.postalCode}। ` +
    `रोज़ सुबह 10 से रात 10, सातों दिन। हर महीने की आख़िरी तारीख़ को बंद।`,
  alternates: { canonical: "/visit" },
};

export default function Visit() {
  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 6px" }}>
          📍 दुकान पर आइए, और हमें सेवा का मौक़ा दीजिए
        </h1>
        <p style={{ color: "var(--ink-2)", maxWidth: "60ch", margin: "0 0 16px" }}>
          आने से पहले model का नाम WhatsApp कर दीजिए। हम stock और आज का rate confirm
          कर देंगे — ताकि आपका चक्कर बेकार न जाए।
        </p>

        <div className="cband rv in">
          <h2>{shop.name}</h2>
          <p>
            {shop.address.street}<br />
            {shop.address.landmark}<br />
            {shop.address.locality}, {shop.address.city}, {shop.address.state} {shop.address.postalCode}
          </p>
          <p style={{ marginTop: 10 }}><LiveBadge /></p>
          <p style={{ marginTop: 6 }}>
            <b>रोज़ सुबह 10 से रात 10, सातों दिन।</b> सिर्फ़ हर महीने की आख़िरी
            तारीख़ को बंद — अगली छुट्टी <NextClosure />।
          </p>

          <div className="qr-card">
            <Image src="/images/qr-code-to-find-mobile-world-on-google-a899f382.webp"
              alt={`${shop.name} को Google पर ढूँढ़ने का QR code`} width={280} height={280} />
            <span>
              <b>Google पर हमें ढूँढ़िए</b>
              <span>Scan कीजिए — Google Maps पर दुकान, खुलने का समय, और आने के बाद
                चाहें तो अपना review भी।</span>
            </span>
          </div>

          <div className="btns" style={{ justifyContent: "center" }}>
            <a className="btn btn-d" href={shop.social.googleMaps} target="_blank" rel="noopener">
              <IconPin /> रास्ता देखिए
            </a>
            <a className="btn btn-o" href={shop.phone.tel}><IconPhone /> {shop.phone.display}</a>
            <a className="btn btn-w" href={whatsappGeneral} target="_blank" rel="noopener">
              <IconWhatsApp /> Model बताइए, Rate बता देंगे
            </a>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="cols3">
          <div className="panel rv in">
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>कब खुली रहती है</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
              सातों दिन, सुबह 10 से रात 10। कोई weekly off नहीं।
            </p>
          </div>
          <div className="panel rv in">
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>कब बंद रहती है</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
              हर महीने की आख़िरी तारीख़ — 28, 29, 30 या 31, जो भी हो। उस दिन
              पूरा बाज़ार बंद रहता है।
            </p>
          </div>
          <div className="panel rv in">
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>पहचान</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
              {shop.address.landmark}। {shop.address.road} पर, {shop.address.locality} में।
            </p>
          </div>
        </div>
      </section>

      <FollowUs />
    </div>
  );
}
