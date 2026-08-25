import type { Metadata } from "next";
import Image from "next/image";
import { shop } from "@/data/shop";
import { storePhotos } from "@/data/content";

export const metadata: Metadata = {
  title: "Our story",
  description:
    `${shop.registeredName} ${shop.address.road} par 1973 se hai. ` +
    `Mobile World isi address se 2016 se chal rahi hai, ${shop.owner} ke under.`,
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <div className="wrap">
      <section className="sec">
        <div className="shead"><h1>Our story</h1></div>
        <div className="ptiles">
          <div className="ptile lav rv in" style={{ minHeight: 220 }}>
            <span className="k">Since 1973</span>
            <h2 style={{ fontSize: "clamp(1.1rem,2.6vw,1.5rem)", margin: "0 0 8px" }}>
              Three generations on one street
            </h2>
            <p>
              {shop.registeredName} opened on {shop.address.road} in 1973.
              Mobile World has traded from the same address since 2016, under {shop.owner}.
            </p>
          </div>
          <div className="pstack">
            <div className="ptile sand rv in">
              <span className="k">What we do</span>
              <h3>Everything electrical for a home</h3>
              <p>Phones, laptops, televisions, air conditioners, washing machines,
                refrigerators and the accessories that go with them.</p>
            </div>
            <div className="ptile mint rv in">
              <span className="k">How we work</span>
              <h3>Enquiries, not carts</h3>
              <p>No online ordering and no account to create. Ask a question, get a
                straight answer, then come in and see the thing.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="shead"><h2>Inside the store</h2></div>
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
        <div className="panel rv in" style={{ maxWidth: 820 }}>
          <h2 style={{ fontSize: "1.1rem", margin: "0 0 10px" }}>What you can check yourself</h2>
          <ul style={{ display: "grid", gap: 8, color: "var(--ink-2)", fontSize: 14.5 }}>
            <li>· Ek hi dukaan, ek hi address — 1973 se {shop.address.road} par.</li>
            <li>· Har saamaan GST bill aur poori brand warranty ke saath.</li>
            <li>· Dikkat aane par usi counter par aaiye jahan se liya tha.</li>
            <li>· Google par hamari rating aur reviews aap khud padh sakte hain.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
