import Image from "next/image";
import Link from "next/link";
import { shop } from "@/data/shop";
import { localBusinessSchema, jsonLdScript } from "@/data/schema";
import { items, storePhotos, serviceCards, posts, guides, ask, whatsappGeneral, navCategories } from "@/data/content";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { Art } from "@/components/ArtSprite";
import { IconArrow, IconWhatsApp, IconPin, IconYouTube } from "@/components/Icons";
import { NextClosure } from "@/components/StoreStatus";

export default function Home() {
  const top = items.slice(0, 8);
  const services = serviceCards.filter((s) => shop.services[s.key]);

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(localBusinessSchema()) }} />

      <div className="wrap">
        <Hero />

        <div className="prow">
          {shop.services.emi && (
            <a className="pmini rv in" href={ask("EMI options")} target="_blank" rel="noopener">
              <span className="m"><Art id="a-charger" /></span>
              <span><b>EMI available</b><s>Ask in store ›</s></span>
            </a>
          )}
          {shop.services.delivery && (
            <a className="pmini rv in" href={ask("home delivery")} target="_blank" rel="noopener">
              <span className="m"><Art id="a-wash" /></span>
              <span><b>Delivery in {shop.address.city.replace("NIT ", "")}</b><s>Large appliances ›</s></span>
            </a>
          )}
          {shop.services.installation && (
            <a className="pmini rv in" href={ask("installation and service")} target="_blank" rel="noopener">
              <span className="m"><Art id="a-ac" /></span>
              <span><b>Installation &amp; service</b><s>Fitted and tested ›</s></span>
            </a>
          )}
        </div>

        <section className="sec">
          <div className="shead">
            <h2>Top Categories</h2>
            <Link href="/products">View All <IconArrow /></Link>
          </div>
          <div className="pgrid">
            {top.map((it, n) => (
              <ProductCard key={it.title} item={it} badge={n === 0 ? "Popular" : undefined} />
            ))}
          </div>
        </section>

        <section className="sec">
          <div className="strip rv in">
            <div>
              <b>Send us a model name on WhatsApp</b>
              <p>We confirm stock and today&rsquo;s rate before you make the trip. No online ordering, no account needed.</p>
            </div>
            <a className="btn btn-h go" href={whatsappGeneral} target="_blank" rel="noopener">
              <IconWhatsApp /> Message the store
            </a>
          </div>
        </section>

        <section className="sec">
          <div className="shead"><h2>Browse by Category</h2></div>
          <div className="ctiles">
            {navCategories.map((c) => (
              <Link key={c.slug} className="ct rv in" href={`/products#${c.slug}`}>
                <span className="m"><Art id={artFor(c.slug)} /></span>
                <span><b>{c.label}</b><s>{blurbFor(c.slug)}</s></span>
              </Link>
            ))}
          </div>
        </section>

        {services.length > 0 && (
          <section className="sec">
            <div className="shead"><h2>Service &amp; Support</h2></div>
            <div className="ptiles">
              <a className={`ptile ${services[0].tone} rv in`} href={ask(services[0].topic)} target="_blank" rel="noopener">
                <span className="k">{services[0].kicker}</span>
                <h3>{services[0].title}</h3>
                <p>{services[0].body}</p>
                <span className="go">{services[0].cta} <IconArrow /></span>
              </a>
              <div className="pstack">
                {services.slice(1, 3).map((s) => (
                  <a key={s.key} className={`ptile ${s.tone} rv in`} href={ask(s.topic)} target="_blank" rel="noopener">
                    <span className="k">{s.kicker}</span><h3>{s.title}</h3>
                    <span className="go">{s.cta} <IconArrow /></span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="sec" id="store-photos">
          <div className="shead">
            <h2>Inside the Store</h2>
            <a href={shop.social.googleMaps} target="_blank" rel="noopener">Get directions <IconArrow /></a>
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
            <h2>Latest Posts</h2>
            <Link href="/posts">View All <IconArrow /></Link>
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
          <div className="cols3">
            <div className="panel rv in">
              <h2 style={{ fontSize: "1.05rem", margin: "0 0 10px" }}>Popular Guides</h2>
              {guides.map((g) => (
                <a className="lrow" key={g.title} href={ask(g.title)} target="_blank" rel="noopener">
                  <span className="m"><Art id="a-accessory" /></span>
                  <span><s>{g.kicker}</s><b>{g.title}</b><em>{g.note}</em></span>
                </a>
              ))}
            </div>

            <a className="ptile lav rv in" href={shop.social.youtube} target="_blank" rel="noopener"
               style={{ minHeight: 260 }}>
              <span className="k">On our channel</span>
              <h3>Unboxings, comparisons and buying guides</h3>
              <p>Watch before you decide, then come in and hold it in your hand.</p>
              <span className="go"><IconYouTube /> YouTube <IconArrow /></span>
            </a>

            <div className="panel rv in">
              <h2 style={{ fontSize: "1.05rem", margin: "0 0 10px" }}>Recommended For You</h2>
              {services.slice(0, 3).map((s) => (
                <a className="lrow" key={s.key} href={ask(s.topic)} target="_blank" rel="noopener">
                  <span className="m"><Art id="a-phone" /></span>
                  <span><s>{s.kicker}</s><b>{s.title}</b><em>{s.cta}</em></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="sec" id="visit">
          <div className="cband rv in">
            <h2>Visit the store</h2>
            <p>{shop.address.street}, {shop.address.landmark}, {shop.address.locality},
              {" "}{shop.address.city}, {shop.address.state} {shop.address.postalCode}.</p>
            <p style={{ marginTop: 8 }}>
              <b>Open daily 10:00 AM – 10:00 PM.</b> Closed on the last calendar date of
              every month — next closure <NextClosure />.
            </p>
            <div className="btns" style={{ justifyContent: "center" }}>
              <a className="btn btn-d" href={shop.social.googleMaps} target="_blank" rel="noopener">
                <IconPin /> Get directions
              </a>
              <a className="btn btn-o" href={shop.phone.tel}>{shop.phone.display}</a>
              <a className="btn btn-w" href={whatsappGeneral} target="_blank" rel="noopener">
                <IconWhatsApp /> WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function artFor(slug: string): string {
  const m: Record<string, string> = {
    smartphones: "a-phone", "laptops-tablets": "a-laptop", televisions: "a-tv",
    "air-conditioners": "a-ac", "washing-machines": "a-wash", refrigerators: "a-fridge",
    "inverters-batteries": "a-inverter", "audio-wearables": "a-speaker",
    "kitchen-appliances": "a-kitchen", accessories: "a-accessory",
  };
  return m[slug] ?? "a-accessory";
}

function blurbFor(slug: string): string {
  const m: Record<string, string> = {
    smartphones: "Every major brand, every budget",
    "laptops-tablets": "Study, office and gaming",
    televisions: "32″ to 75″, 4K and smart",
    "air-conditioners": "Sized, delivered and fitted",
    "washing-machines": "Semi, top load and front load",
    refrigerators: "Single door, double door, frost-free",
    "inverters-batteries": "Load check and installation",
    "audio-wearables": "Speakers, earbuds, smart watches",
    "kitchen-appliances": "Air fryer, microwave, mixer, RO",
    accessories: "Covers, glass, chargers, cables",
  };
  return m[slug] ?? "";
}
