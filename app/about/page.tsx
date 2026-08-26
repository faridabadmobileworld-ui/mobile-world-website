import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { shop, brands, legacy, values } from "@/data/shop";
import { storePhotos, navCategories, ask } from "@/data/content";
import { FollowUs } from "@/components/FollowUs";
import { Banner } from "@/components/Banner";
import { IconArrow, IconWhatsApp, IconPin, IconPhone } from "@/components/Icons";
import { NextClosure } from "@/components/StoreStatus";

export const metadata: Metadata = {
  title: "हमारे बारे में",
  description:
    `परिवार का business सफ़र ${shop.legacyStartYear} में Aggarwal Kiryana Store से शुरू हुआ, ` +
    `और ${shop.foundingYear} में इसी विरासत को आगे बढ़ाते हुए MOBILE WORLD की शुरुआत हुई। ` +
    `${shop.address.road}, ${shop.address.locality}, ${shop.address.city}।`,
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    // पूरे page की भाषा हिन्दी है — screen reader और Google दोनों को यही
    // बताना ज़रूरी है। बाक़ी pages हिन्दी होने पर `app/layout.tsx` में
    // <html lang="hi"> कर दीजिए, फिर यह line हटा दीजिए।
    <div className="wrap" lang="hi">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.5rem,4.4vw,2.3rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 6px", lineHeight: 1.22 }}>
          {shop.legacyStartYear} से Faridabad के साथ
        </h1>
        <p style={{ fontSize: "clamp(1rem,2.4vw,1.2rem)", fontWeight: 700,
                    color: "var(--brand)", margin: "0 0 20px" }}>
          तीन पड़ाव। एक ही सफ़र। एक ही भरोसा।
        </p>

        {/* ── आवाज़ owner की अपनी है (approved brand post, 25 Aug 2026)।
              इसे बदलना हो तो पहले owner से पूछिए — यही पूरी website की
              master voice है, CLAUDE.md §13 देखिए। ── */}
        <p className="lede" style={{ fontWeight: 700, color: "var(--ink)" }}>
          हर सफ़र की शुरुआत एक भरोसे से होती है। ❤️
        </p>
        <p className="lede">
          हमारे परिवार का business सफ़र {shop.legacyStartYear} में Aggarwal Kiryana Store
          से शुरू हुआ।
        </p>
        <p className="lede">
          2006 में यह सफ़र Aggarwal Kiryana &amp; Communication के रूप में आगे बढ़ा।
        </p>
        <p className="lede">
          और {shop.foundingYear} में इसी विरासत को आगे बढ़ाते हुए MOBILE WORLD की
          शुरुआत हुई।
        </p>
        <p className="lede">
          तब से लेकर आज तक, हमारे साथ जुड़े हर ग्राहक ने इस सफ़र को आगे बढ़ाने में
          अपना योगदान दिया है।
        </p>
        <p className="lede">
          हम उन सभी ग्राहकों का दिल से धन्यवाद करते हैं, जिन्होंने वर्षों से हम पर
          अपना भरोसा बनाए रखा और MOBILE WORLD को अपने परिवार का हिस्सा माना।
        </p>
      </section>

      <section className="sec">
        <div className="shead"><h2>हमारा सफ़र</h2></div>
        <Banner src="/images/mobile-world-ka-safar-1973-2006-2016-e38c681c.webp"
          alt="एक सफ़र, एक परिवार, एक भरोसा — 1973 Aggarwal Kiryana Store, 2006 Aggarwal Kiryana &amp; Communication, 2016 MOBILE WORLD" />
        <ol className="tline">
          {legacy.map((m) => (
            <li className="rv in" key={m.year}>
              <span className="y">{m.year}</span>
              <b>{m.name}</b>
              <i>{m.tag}</i>
              <em>{m.body}</em>
            </li>
          ))}
        </ol>
      </section>

      <section className="sec">
        <div className="cband rv in">
          <p style={{ fontSize: "clamp(14.5px,2.2vw,16.5px)", lineHeight: 1.8,
                      color: "var(--ink)", maxWidth: "56ch" }}>
            आज भी हमारा प्रयास वही है — Genuine Products, सही Guidance और भरोसेमंद
            Customer Experience के साथ अपने ग्राहकों को बेहतर experience देना।
          </p>
          <p style={{ marginTop: 14, fontWeight: 700, color: "var(--ink)" }}>
            🙏 आपका स्वागत है।
          </p>
        </div>
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

      <section className="sec">
        <div className="shead">
          <h2>हमारे पास क्या मिलेगा</h2>
          <Link href="/products">सब देखिए <IconArrow /></Link>
        </div>

        <div className="cols2">
          <div className="panel rv in">
            <h3>सामान</h3>
            <p style={{ margin: "0 0 12px", fontSize: 13.5, color: "var(--ink-2)" }}>
              Consumer Electronics &amp; Home Appliances का सभी सामान — एक ही counter पर।
            </p>
            <ul className="chips">
              {navCategories.map((c) => <li key={c.slug}>{c.label}</li>)}
            </ul>
          </div>

          <div className="panel rv in">
            <h3>Brands</h3>
            <p style={{ margin: "0 0 12px", fontSize: 13.5, color: "var(--ink-2)" }}>
              सब कुछ Genuine, पक्के GST Bill और पूरी Brand Warranty के साथ।
              कोई brand यहाँ न दिखे तो WhatsApp पर पूछ लीजिए।
            </p>
            <ul className="chips">
              {brands.map((b) => <li key={b.slug}>{b.name}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="shead"><h2>दुकान के बारे में</h2></div>
        <div className="cols3">
          <div className="panel rv in">
            <h3>एक ही दुकान</h3>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.75, color: "var(--ink-2)" }}>
              हमारी कोई branch नहीं है, कोई franchise नहीं। {shop.address.road},
              {" "}{shop.address.locality} — यही एक पता है।
            </p>
          </div>
          <div className="panel rv in">
            <h3>Proprietor</h3>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.75, color: "var(--ink-2)" }}>
              {shop.owner}। कुछ पूछना हो तो सीधे दुकान से जवाब मिलेगा, किसी
              call centre से नहीं।
            </p>
            {/* TODO (owner): अपने बारे में दो-तीन सच्ची लाइनें और अपनी एक photo
                भेज दीजिए, यहीं लग जाएगी। जब तक आप ख़ुद नहीं बताते, आपकी तरफ़ से
                हम कुछ नहीं लिखेंगे (CLAUDE.md §8, §13)। */}
          </div>
          <div className="panel rv in">
            <h3>खुलने का समय</h3>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.75, color: "var(--ink-2)" }}>
              रोज़ सुबह 10 से रात 10, सातों दिन। सिर्फ़ हर महीने की आख़िरी तारीख़
              को बंद — अगली छुट्टी <NextClosure />।
            </p>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="shead"><h2>हमारी टीम</h2></div>

        <Banner src="/images/mobile-world-our-team-one-family-e41374d7.webp"
          alt={`${shop.name} की टीम — ${shop.address.locality} की दुकान के counter पर`} />

        <div className="teamlead rv in">
          <b>एक टीम। एक परिवार। एक वादा।</b>
          <p>आपके भरोसे के साथ, हर दिन बेहतर बनाते हुए।</p>
        </div>

        <ul className="vals">
          {values.map((v) => (
            <li className="rv in" key={v.title}>
              <b>{v.title}</b>
              <em>{v.body}</em>
            </li>
          ))}
        </ul>

        <p className="thanks rv in">
          हम सिर्फ़ product नहीं, भरोसा देते हैं। ❤️<br />
          धन्यवाद कि आपने {shop.name} को अपने परिवार का हिस्सा बनाया।
        </p>
      </section>

      <FollowUs />

      <section className="sec">
        <div className="cband rv in">
          <span className="cico" aria-hidden="true">
            <Image src="/images/icon-shop-2b14210e.webp" alt="" width={200} height={200} sizes="96px" />
          </span>
          <h2>दुकान पर आइए, और हमें सेवा का मौक़ा दीजिए</h2>
          <p>
            {shop.address.street}, {shop.address.landmark}, {shop.address.locality},
            {" "}{shop.address.city}, {shop.address.state} – {shop.address.postalCode}
          </p>
          <p style={{ marginTop: 8 }}>
            आने से पहले model का नाम WhatsApp कर दीजिए। हम stock और आज का rate
            confirm कर देंगे — ताकि आपका चक्कर बेकार न जाए।
          </p>
          <div className="btns" style={{ justifyContent: "center" }}>
            <a className="btn btn-d" href={shop.social.googleMaps} target="_blank" rel="noopener">
              <IconPin /> रास्ता देखिए
            </a>
            <a className="btn btn-o" href={shop.phone.tel}><IconPhone /> {shop.phone.display}</a>
            <a className="btn btn-w" href={ask("aaj ka rate")} target="_blank" rel="noopener">
              <IconWhatsApp /> Model बताइए, Rate बता देंगे
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
