import type { Metadata } from "next";
import { shop } from "@/data/shop";
import { PageFoot, Byline } from "@/components/PageFoot";
import { FollowUs } from "@/components/FollowUs";
import { MoreLinks } from "@/components/MoreLinks";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";

export const metadata: Metadata = {
  title: "Privacy",
  description: `${shop.name} आपकी कौन सी जानकारी रखता है और कौन सी नहीं।`,
  alternates: { canonical: "/privacy" },
};

const toc: TocItem[] = [
  { id: "kya-nahi", label: "यह website क्या इकट्ठा नहीं करती" },
  { id: "whatsapp", label: "WhatsApp और Call पर दी गई जानकारी" },
  { id: "hataana", label: "जानकारी ठीक करवानी या हटवानी हो" },
];

export default function Privacy() {
  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 16px" }}>Privacy</h1>
        <Byline />
        <TableOfContents items={toc} />
        <div className="panel rv in" style={{ maxWidth: 820 }}>
          <h2 id="kya-nahi" style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>
            यह website क्या इकट्ठा नहीं करती
          </h2>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: "0 0 16px" }}>
            यह website आपकी कोई जानकारी इकट्ठा नहीं करती। न कोई account, न cart,
            न contact form, न कोई tracking pixel। Search box पूरी तरह आपके अपने
            browser में चलता है — जो आप लिखते हैं वो कहीं नहीं जाता।
          </p>
          <h2 id="whatsapp" style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>
            WhatsApp और Call पर दी गई जानकारी
          </h2>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: "0 0 16px" }}>
            जब आप WhatsApp या Call दबाते हैं तो आप उन apps पर चले जाते हैं, और वहाँ जो
            भेजते हैं वो उनकी अपनी terms के हिसाब से चलता है। Message में दी गई जानकारी —
            नाम, number और क्या चाहिए — सिर्फ़ आपके सवाल का जवाब देने, और ख़रीदने पर
            Bill और Warranty का record बनाने के लिए इस्तेमाल होती है।
          </p>
          <h2 id="hataana" style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>
            जानकारी ठीक करवानी या हटवानी हो
          </h2>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
            हमारे पास आपकी कौन सी जानकारी है यह पूछना हो, उसे ठीक करवाना हो या हटवाना
            हो तो{" "}
            <a href={shop.phone.tel} style={{ color: "var(--brand)", fontWeight: 700 }}>
              {shop.phone.display}
            </a>{" "}
            {" "}पर call कीजिए।
          </p>
          <p style={{
            fontSize: 12.5, color: "var(--ink-3)", borderTop: "1px solid var(--line)",
            paddingTop: 14, marginTop: 18, marginBottom: 0,
          }}>
            {shop.registeredName} · {shop.address.locality}, {shop.address.city}
          </p>
        </div>
      </section>

      <MoreLinks current="/privacy" />
      <PageFoot />
      <FollowUs />
    </div>
  );
}
