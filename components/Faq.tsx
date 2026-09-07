import { faqSchema, jsonLdScript } from "@/data/schema";

export type QA = { q: string; a: string };

/**
 * सवाल-जवाब का हिस्सा — page पर भी दिखता है, और Google को schema भी जाता है।
 *
 * **दोनों एक साथ क्यों ज़रूरी हैं:** Google का साफ़ नियम है कि जो जवाब schema
 * में भेजो, वो page पर ग्राहक को भी दिखना चाहिए। सिर्फ़ schema भेजकर page पर
 * न लिखना — यह Google spam मानता है और penalty लगाता है। इसलिए यह component
 * एक ही list से दोनों काम करता है; दोनों कभी अलग नहीं हो सकते।
 *
 * `<details>` से बना है, इसलिए **बिना JavaScript के भी खुलता-बंद होता है**
 * और Google को अंदर का जवाब पहले ही दिख जाता है।
 *
 * ⚠️ यहाँ कोई ऐसा जवाब मत लिखिए जो owner से confirm न हो (§8, §12) — यह
 * सीधे Google के search नतीजों में छपता है।
 *
 * ⚠️ एक page पर **एक ही बार** लगाइए। दो FAQPage schema एक ही page पर होने से
 * Google दोनों छोड़ देता है।
 */
export function Faq({
  items,
  heading = "अक्सर पूछे जाने वाले सवाल",
  id = "faq",
}: {
  items: readonly QA[];
  heading?: string;
  id?: string;
}) {
  if (!items.length) return null;

  return (
    <section className="sec" id={id}>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqSchema(items)) }} />
      <div className="shead"><h2>{heading}</h2></div>
      <div className="faq">
        {items.map((it) => (
          <details key={it.q}>
            <summary>
              <span>{it.q}</span>
              <i aria-hidden="true" />
            </summary>
            <p>{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
