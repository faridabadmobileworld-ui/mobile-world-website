import Image from "next/image";
import Link from "next/link";
import { shop } from "@/data/shop";
import { items, storePhotos, serviceBanners, posts, helpPoints, serviceList,
         artForCategory, ask, whatsappGeneral, navCategories } from "@/data/content";
import { ProductCard } from "@/components/ProductCard";
import { Art } from "@/components/ArtSprite";
import { IconArrow, IconWhatsApp, IconPin, IconPhone } from "@/components/Icons";
import { FollowUs } from "@/components/FollowUs";
import { MoreLinks } from "@/components/MoreLinks";
import { Banner } from "@/components/Banner";
import { GoogleQR } from "@/components/GoogleQR";
import { FinanceStrip } from "@/components/FinanceStrip";
import { InstagramFeed } from "@/components/InstagramFeed";
import { VideoRow } from "@/components/VideoRow";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { PageFoot, Byline } from "@/components/PageFoot";
import { NextClosure } from "@/components/StoreStatus";

/* Home page ka poora body — ek hi jagah.
   `/` aur `/showcase` dono yahi component rendar karte hain, isliye content
   kabhi do jagah likha nahi jaata. Nayi section yahan jodiye, dono par aa
   jayegi. */

const toc: TocItem[] = [
  { id: "kya-milta-hai", label: "क्या-क्या मिलता है" },
  { id: "ek-chhat", label: "सब कुछ, एक ही छत के नीचे" },
  { id: "emi-exchange-repair", label: "EMI, Exchange और Repairing" },
  { id: "finance", label: "Paper Finance पर EMI किन-किन bank से मिलती है" },
  { id: "dukaan-ke-andar", label: "दुकान के अंदर" },
  { id: "nai-jaankari", label: "Tech Blog & Guides" },
  { id: "insta", label: "Instagram पर हम" },
  { id: "dukaan-par-aaiye", label: "दुकान पर आइए" },
];

export function HomeBody({ current = "/" }: { current?: string }) {
  const top = items.slice(0, 8);

  return (
    <>
      <TableOfContents items={toc} />

      <div className="prow">
        {shop.services.emi && (
          <a className="pmini rv in" href={ask("EMI")} target="_blank" rel="noopener">
            <span className="m">
              <Image className="ph-img" src="/images/icon-emi-e6aad705.webp" alt="" width={200} height={200} sizes="66px" />
            </span>
            <span><b>EMI उपलब्ध है</b><s>Cards और finance ›</s></span>
          </a>
        )}
        {shop.services.delivery && (
          <a className="pmini rv in" href={ask("Delivery")} target="_blank" rel="noopener">
            <span className="m">
              <Image className="ph-img" src="/images/icon-guidance-0e26ba46.webp" alt="" width={200} height={200} sizes="66px" />
            </span>
            <span><b>{shop.address.city.replace("NIT ", "")} में Delivery</b><s>भाड़ा ग्राहक का ›</s></span>
          </a>
        )}
        {shop.services.exchange && (
          <a className="pmini rv in" href={ask("पुराने phone के Exchange")} target="_blank" rel="noopener">
            <span className="m">
              <Image className="ph-img" src="/images/icon-exchange-bc53d7d0.webp" alt="" width={200} height={200} sizes="66px" />
            </span>
            <span><b>पुराना phone Exchange</b><s>दुकान पर valuation ›</s></span>
          </a>
        )}
      </div>

      <section className="sec">
        <Banner src="/images/mobile-world-trust-since-1973-505ed6ee.webp"
          alt={`${shop.legacyStartYear} से चला आ रहा परिवार का business, और ${shop.foundingYear} से ${shop.name}`} />
      </section>

      <section className="sec">
        <div className="shead">
          <h2 id="kya-milta-hai">क्या-क्या मिलता है</h2>
          <Link href="/products">सब देखिए <IconArrow /></Link>
        </div>
        <div className="pgrid">
          {top.map((it, n) => (
            <ProductCard key={it.title} item={it} badge={n === 0 ? "लोकप्रिय" : undefined} />
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="strip rv in">
          <div>
            <b>किसी भी जानकारी के लिए सीधे संपर्क कीजिए</b>
            <p>किसी भी product के बारे में जानना हो तो हमसे सीधे बात कीजिए। यहाँ से order नहीं होता, किसी account की ज़रूरत नहीं।</p>
          </div>
          <a className="btn btn-h go" href={whatsappGeneral} target="_blank" rel="noopener">
            <IconWhatsApp /> दुकान को Message कीजिए
          </a>
        </div>
      </section>

      <section className="sec">
        <div className="shead"><h2 id="ek-chhat">सब कुछ, एक ही छत के नीचे</h2></div>
        <div className="ctiles">
          {navCategories.map((c) => (
            <Link key={c.slug} className="ct rv in" href={`/products#${c.slug}`}>
              <span className="m">
                {c.image
                  ? <Image className="ph-img" src={c.image} alt="" width={200} height={200} sizes="58px" />
                  : <Art id={artForCategory(c.slug)} />}
              </span>
              <span><b>{c.label}</b><s>{blurbFor(c.slug)}</s></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="shead"><h2 id="emi-exchange-repair">EMI, Exchange और Repairing</h2></div>
        <div className="sbanners">
          {serviceBanners.filter((b) => shop.services[b.key]).map((b) => (
            <a className="sbanner rv in" key={b.key} href={ask(b.topic)}
               target="_blank" rel="noopener">
              <Image src={b.src} alt={b.alt} width={1400} height={933}
                sizes="(max-width:900px) 100vw, 33vw" />
            </a>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="shead">
          <h2 id="finance">Paper Finance पर EMI किन-किन bank से मिलती है</h2>
        </div>
        <p style={{ color: "var(--ink-2)", maxWidth: "62ch", margin: "0 0 14px" }}>
          Aadhaar, PAN और bank की details पर बनने वाली EMI — यानी paper finance —
          नीचे दिखने वाली companies से हो जाती है। Credit card और कुछ bank के
          debit card पर भी EMI बन जाती है। कौन सा plan मिलेगा और approval होगा या
          नहीं, यह आपका bank या finance company तय करती है — दुकान नहीं।
        </p>
        <FinanceStrip />
        <div className="btns" style={{ marginTop: 14 }}>
          <Link className="btn btn-d" href="/finance">
            पूरी जानकारी देखिए <IconArrow />
          </Link>
          <a className="btn btn-w" href={ask("EMI")} target="_blank" rel="noopener">
            <IconWhatsApp /> EMI के बारे में पूछिए
          </a>
        </div>
      </section>

      <section className="sec" id="store-photos">
        <div className="shead">
          <h2 id="dukaan-ke-andar">दुकान के अंदर</h2>
          <a href={shop.social.googleMaps} target="_blank" rel="noopener">रास्ता देखिए <IconArrow /></a>
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
          <h2 id="nai-jaankari">Tech Blog &amp; Guides</h2>
          <Link href="/posts">सब देखिए <IconArrow /></Link>
        </div>
        <div className="posts">
          {posts.map((p) => (
            <Link className="post rv in" key={p.slug} href={`/posts/${p.slug}`}>
              <div className="m">
                <Image src={p.image} alt={p.alt} width={p.imageW} height={p.imageH}
                  sizes="(max-width:700px) 100vw, 33vw" />
              </div>
              <div className="b">
                <span className="k">{p.kicker}<em>{p.date}</em></span>
                <h3>{p.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="cols2">
          <div className="panel rv in">
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 12px" }}>काम की बातें</h2>
            {helpPoints.map((h) => (
              <a className="lrow" key={h.title} href={ask(h.topic)} target="_blank" rel="noopener">
                <span className="m">
                  <Image className="ph-img" src={h.icon} alt="" width={200} height={200} sizes="66px" />
                </span>
                <span><b>{h.title}</b><em>{h.body}</em></span>
              </a>
            ))}
          </div>

          <div className="panel rv in">
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 12px" }}>आपके काम की services</h2>
            {serviceList.map((v) => (
              <a className="lrow tight" key={v.title} href={ask(v.topic)} target="_blank" rel="noopener">
                <span className="m sm">
                  <Image className="ph-img" src={v.icon} alt="" width={200} height={200} sizes="48px" />
                </span>
                <span><b>{v.title}</b><em>{v.body}</em></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Video की list ख़ाली हो तो यह हिस्सा अपने आप छुप जाता है। */}
      <VideoRow />

      <InstagramFeed />

      <section className="sec" id="visit">
        <div className="cband rv in">
          <span className="cico" aria-hidden="true">
            <Image src="/images/icon-shop-2b14210e.webp" alt="" width={200} height={200} sizes="96px" />
          </span>
          <h2 id="dukaan-par-aaiye">दुकान पर आइए, और हमें सेवा का मौक़ा दीजिए</h2>
          <GoogleQR />
          <p>{shop.address.street}, {shop.address.landmark}, {shop.address.locality},
            {" "}{shop.address.city}, {shop.address.state} {shop.address.postalCode}.</p>
          <p style={{ marginTop: 8 }}>
            <b>रोज़ सुबह 10 से रात 10, सातों दिन।</b> सिर्फ़ हर महीने की आख़िरी
            तारीख़ को बंद — अगली छुट्टी <NextClosure />।
          </p>
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

      <Byline />

      <MoreLinks current={current} />
      <PageFoot />
      <FollowUs />
    </>
  );
}

function blurbFor(slug: string): string {
  const m: Record<string, string> = {
    smartphones: "हर बड़ा brand, हर budget",
    "laptops-tablets": "पढ़ाई, office और gaming",
    televisions: "32″ से 75″ तक, 4K और Smart",
    "air-conditioners": "1 ton से 2 ton तक",
    "washing-machines": "Semi, Top Load, Front Load",
    refrigerators: "Single door, Double door, Frost-free",
    "inverters-batteries": "Inverter, Battery, Stabilizer",
    "audio-wearables": "Speaker, Earbuds, Smart Watch",
    "kitchen-appliances": "Air Fryer, Microwave, Mixer, RO",
    accessories: "Cover, Glass, Charger, Cable",
  };
  return m[slug] ?? "";
}
