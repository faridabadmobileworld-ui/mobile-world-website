import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { shop, categories, brands, timeline } from "@/data/shop";
import { storePhotos, whatsappGeneral } from "@/data/content";
import { WhatWeDontDo } from "@/components/WhatWeDontDo";
import { IconArrow, IconWhatsApp, IconPin, IconYouTube } from "@/components/Icons";
import { NextClosure } from "@/components/StoreStatus";

export const metadata: Metadata = {
  title: "हमारे बारे में",
  description:
    `${shop.address.locality}, ${shop.address.city} की यह दुकान 1973 से इसी पते पर है। ` +
    `${shop.owner} के साथ 2016 से ${shop.name} के नाम से — mobile, laptop, TV, AC ` +
    `और घर का बाक़ी सामान, GST bill और brand warranty के साथ।`,
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    // पूरे page की भाषा हिन्दी है — screen reader और Google दोनों को यही
    // बताना ज़रूरी है। बाक़ी pages हिन्दी होने पर `app/layout.tsx` में
    // <html lang="hi"> कर दीजिए, फिर यह line हटा दीजिए।
    <div className="wrap" lang="hi">
      <section className="sec">
        <div className="shead" style={{ display: "block" }}>
          <h1 style={{ fontSize: "clamp(1.5rem,4.4vw,2.3rem)", fontWeight: 800,
                       letterSpacing: "-.03em", margin: "0 0 6px", lineHeight: 1.2 }}>
            1973 से Faridabad के साथ
          </h1>
          <h2 style={{ fontSize: "clamp(1rem,2.4vw,1.25rem)", fontWeight: 700,
                       color: "var(--brand)", margin: "0 0 16px" }}>
            तीन पीढ़ियाँ। एक ही भरोसा।
          </h2>
        </div>

        <p className="lede">
          {shop.address.locality} की {shop.address.road} पर एक ही दुकान है, और वो 1973 से
          वहीं है। पहले किराने की थी, आज {shop.name} है। पता कभी नहीं बदला।
        </p>
        <p className="lede">
          हमारी कोई branch नहीं है, कोई franchise नहीं। जो सामान आप यहाँ से ले जाते हैं,
          उसमें कुछ गड़बड़ हो तो उसी counter पर वापस आइए जहाँ से लिया था — वही लोग
          मिलेंगे। पचास साल से ज़्यादा एक ही जगह रहने का यही मतलब है।
        </p>
      </section>

      <section className="sec">
        <div className="shead"><h2>हमारा सफ़र</h2></div>
        <ul className="tline">
          {timeline.map((m) => (
            <li className="rv in" key={m.year}>
              <span className="y">{m.year}</span>
              <b>{m.title}</b>
              <em>{m.body}</em>
            </li>
          ))}
        </ul>
      </section>

      <section className="sec">
        <div className="shead">
          <h2>हमारे ग्राहक</h2>
          <a href={shop.social.googleMaps} target="_blank" rel="noopener">
            रास्ता देखिए <IconArrow />
          </a>
        </div>
        <div className="shots">
          {storePhotos.map((p) => (
            <figure className="shot rv in" key={p.src} style={{ margin: 0 }}>
              <Image className="ph-img" src={p.src} alt={p.alt} width={p.w} height={p.h}
                sizes="(max-width:700px) 100vw, 25vw" />
              <figcaption>
                <span className="t">{p.title}</span><span className="d">{p.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <WhatWeDontDo />

      <section className="sec">
        <div className="shead">
          <h2>हमारे पास क्या मिलेगा</h2>
          <Link href="/products">सब देखिए <IconArrow /></Link>
        </div>

        <div className="cols2">
          <div className="panel rv in">
            <h3>सामान</h3>
            <p style={{ margin: "0 0 12px", fontSize: 13.5, color: "var(--ink-2)" }}>
              घर का लगभग हर electric सामान एक ही counter पर।
            </p>
            <ul className="chips">
              {categories.map((c) => <li key={c.slug}>{c.name}</li>)}
            </ul>
          </div>

          <div className="panel rv in">
            <h3>Brands</h3>
            <p style={{ margin: "0 0 12px", fontSize: 13.5, color: "var(--ink-2)" }}>
              सब कुछ official, GST bill और पूरी company warranty के साथ।
              कोई brand दिख न रहा हो तो WhatsApp पर पूछ लीजिए।
            </p>
            <ul className="chips">
              {brands.map((b) => <li key={b.slug}>{b.name}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="shead"><h2>दुकान के पीछे</h2></div>
        <div className="ptiles">
          <div className="ptile sand rv in">
            <span className="k">मालिक</span>
            <h3 style={{ textTransform: "none" }}>{shop.owner}</h3>
            <p>
              दुकान {shop.owner} चलाते हैं। ज़्यादातर वक़्त वो ख़ुद counter पर
              मिलते हैं — यही वजह है कि सवाल का जवाब किसी call centre से नहीं,
              सीधे दुकान से मिलता है।
            </p>
            {/* TODO (owner): अपने बारे में दो-तीन सच्ची लाइनें और अपनी एक photo
                भेज दीजिए, यहीं लग जाएगी। जब तक आप ख़ुद नहीं बताते, हम आपकी
                तरफ़ से कुछ नहीं लिखेंगे (CLAUDE.md §8)। */}
          </div>
          <div className="pstack">
            <div className="ptile mint rv in">
              <span className="k">टीम</span>
              <h3 style={{ textTransform: "none" }}>वही चेहरे, हर बार</h3>
              <p>
                जिससे आपने सामान लिया, दिक्कत आने पर वही आपको दोबारा मिलेगा।
                नया ticket number नहीं, नई कहानी नहीं।
              </p>
            </div>
            <div className="ptile sky rv in">
              <span className="k">समय</span>
              <h3 style={{ textTransform: "none" }}>रोज़ 10 से 10</h3>
              <p>
                सातों दिन खुली। सिर्फ़ हर महीने की आख़िरी तारीख़ को बंद —
                अगली छुट्टी <NextClosure />।
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="strip rv in">
          <div>
            <b>हम YouTube पर भी हैं</b>
            <p>
              नए फ़ोन का unboxing, दो models की तुलना, और ख़रीदने से पहले किन बातों
              पर ध्यान देना है — सब हमारे channel पर। देखिए, फिर दुकान आकर हाथ में
              लेकर देख लीजिए।
            </p>
          </div>
          <a className="btn btn-h go" href={shop.social.youtube} target="_blank" rel="noopener">
            <IconYouTube /> Channel देखिए
          </a>
        </div>
      </section>

      <section className="sec">
        <div className="cband rv in">
          <h2>दुकान पर आइए</h2>
          <p>
            {shop.address.street}, {shop.address.landmark}, {shop.address.locality},
            {" "}{shop.address.city}, {shop.address.state} {shop.address.postalCode}
          </p>
          <p style={{ marginTop: 8 }}>
            आने से पहले WhatsApp कर दीजिए — बता देंगे कि जो चाहिए वो आज दुकान पर है या नहीं।
          </p>
          <div className="btns" style={{ justifyContent: "center" }}>
            <a className="btn btn-d" href={shop.social.googleMaps} target="_blank" rel="noopener">
              <IconPin /> रास्ता देखिए
            </a>
            <a className="btn btn-o" href={shop.phone.tel}>{shop.phone.display}</a>
            <a className="btn btn-w" href={whatsappGeneral} target="_blank" rel="noopener">
              <IconWhatsApp /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
