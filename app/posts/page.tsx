import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { shop } from "@/data/shop";
import { posts } from "@/data/content";

export const metadata: Metadata = {
  title: "Latest posts",
  description:
    `Buying guides aur store updates — ${shop.name}, ${shop.address.locality}, ${shop.address.city}.`,
  alternates: { canonical: "/posts" },
};

export default function Posts() {
  return (
    <div className="wrap">
      <section className="sec">
        <div className="shead"><h1>Latest posts</h1></div>
        <div className="posts">
          {posts.map((p) => (
            <Link className="post rv in" key={p.slug} href={`/posts/${p.slug}`}>
              <div className="m">
                <Image src={p.image} alt={p.alt} width={p.imageW} height={p.imageH}
                  sizes="(max-width:700px) 100vw, 33vw" />
              </div>
              <div className="b">
                <span className="k">{p.kicker}<em>{p.date}</em></span>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: "6px 0 0", lineHeight: 1.35 }}>
                  {p.title}
                </h2>
                <p style={{ fontSize: 13.5, color: "var(--ink-2)", margin: "8px 0 0", lineHeight: 1.6 }}>
                  {p.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
