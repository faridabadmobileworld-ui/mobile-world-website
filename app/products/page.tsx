import type { Metadata } from "next";
import { shop } from "@/data/shop";
import { items, navCategories } from "@/data/content";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "What we stock",
  description:
    `Mobiles, laptops, televisions, air conditioners, washing machines, refrigerators ` +
    `aur home appliances — ${shop.name}, ${shop.address.locality}, ${shop.address.city}. ` +
    `Stock aur aaj ka rate WhatsApp par pooch lijiye.`,
  alternates: { canonical: "/products" },
};

export default function Products() {
  return (
    <div className="wrap">
      <section className="sec">
        <div className="shead"><h1>What we stock</h1></div>
        <p style={{ color: "var(--ink-2)", maxWidth: "62ch", margin: "0 0 6px" }}>
          Daam yahaan nahi likhe. Rate roz badalta hai aur bank offers alag-alag hote hain —
          isliye jo chahiye uska naam WhatsApp par bhej dijiye, hum stock aur aaj ka rate
          bata denge.
        </p>
      </section>

      {navCategories.map((c) => {
        const list = items.filter((i) => i.category === c.slug);
        if (!list.length) return null;
        return (
          <section className="sec" id={c.slug} key={c.slug}>
            <div className="shead"><h2>{c.label}</h2></div>
            <div className="pgrid">
              {list.map((it) => <ProductCard key={it.title} item={it} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
