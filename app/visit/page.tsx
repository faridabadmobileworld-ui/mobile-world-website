import type { Metadata } from "next";
import Image from "next/image";
import { shop } from "@/data/shop";
import { whatsappGeneral } from "@/data/content";
import { IconWhatsApp, IconPin, IconPhone } from "@/components/Icons";
import { FollowUs } from "@/components/FollowUs";
import { Banner } from "@/components/Banner";
import { GoogleQR } from "@/components/GoogleQR";
import { LiveBadge, NextClosure } from "@/components/StoreStatus";

export const metadata: Metadata = {
  title: "दुकान पर आइए",
  description:
    `${shop.name} — ${shop.address.road}, ${shop.address.locality}, ${shop.address.city} ` +
    `– ${shop.address.postalCode}। रोज़ 10 AM से 10 PM। महीने की आख़िरी तारीख़ को बंद।`,
  alternates: { canonical: "/visit" },
};

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

        <Banner src="/images/mobile-world-storefront-on-gurudwara-road-ja-a182b026.webp"
          w={720} h={340}
          alt={`${shop.name} की दुकान — ${shop.address.road}, ${shop.address.locality}, रात में`} />

        <div className="cband rv in">
          <span className="cico" aria-hidden="true">
            <Image src="/images/icon-shop-2b14210e.webp" alt="" width={200} height={200} sizes="96px" />
          </span>
          <h2>{shop.name}</h2>
          <p>
            {shop.address.street}<br />
            {shop.address.landmark}<br />
            {shop.address.locality}, {shop.address.city}, {shop.address.state} {shop.address.postalCode}
          </p>
          <p style={{ marginTop: 12, fontSize: "clamp(14px,2.1vw,15.5px)",
                      lineHeight: 1.85, color: "var(--ink)", maxWidth: "48ch",
                      marginInline: "auto" }}>
            सामान लेकर जाने के बाद भी बात यहीं ख़त्म नहीं होती। Data transfer
            करवाना हो, settings समझनी हों, या कोई दिक़्क़त आ जाए — दुकान पर आकर
            आमने-सामने पूछ लीजिए।
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
          <div className="panel rv in">
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>पैसे कैसे दे सकते हैं</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
              {shop.paymentMethods.join(" · ")}। हर सामान पर GST Bill मिलता है।
            </p>
          </div>
          <div className="panel rv in">
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>लेने के बाद भी</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
              कोई सवाल हो तो दुकान पर आ जाइए। Warranty का काम brand के service
              centre पर होता है — पहुँचने में हम मदद कर देंगे।
            </p>
          </div>
        </div>
      </section>

      <section className="sec">
        <p className="thanks rv in">
          ❤️ दुकान पर आइए, और हमें सेवा का मौक़ा दीजिए।
        </p>
      </section>

      <FollowUs />
    </div>
  );
}
