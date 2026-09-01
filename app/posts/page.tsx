import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { shop } from "@/data/shop";
import { posts } from "@/data/content";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { PageFoot } from "@/components/PageFoot";
import { FollowUs } from "@/components/FollowUs";
import { MoreLinks } from "@/components/MoreLinks";

export const metadata: Metadata = {
  title: "Tech Blog & Guides",
  description:
    `Smartphone, laptop, TV और AC की buying guide, exchange और EMI की बातें, ` +
    `और दुकान की ख़बरें — ${shop.name}, ${shop.address.locality}, ${shop.address.city}।`,
  alternates: { canonical: "/posts" },
};

const toc: TocItem[] = posts.map((p) => ({ id: p.slug, label: p.title }));

export default function Posts() {
  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 6px" }}>
          Tech Blog &amp; Guides 📝
        </h1>
        <div className="prose" style={{ margin: "0 0 16px" }}>
          <p>
            जो सवाल रोज़ counter पर पूछे जाते हैं — कितने ton का AC लूँ, कौन सा laptop
            चलेगा, पुराने phone की value कैसे बनती है — उन्हीं के जवाब यहाँ लिखे हैं।
          </p>
          <p>
            कोई दाम नहीं, कोई offer नहीं — सिर्फ़ वो बातें जो ख़रीदने से पहले जान लेनी
            चाहिए। और साथ में दुकान की अपनी ख़बरें।
          </p>
        </div>
        <TableOfContents items={toc} heading="इस page पर ये articles हैं" />
        <div className="posts">
          {posts.map((p) => (
            <Link className="post rv in" key={p.slug} id={p.slug} href={`/posts/${p.slug}`}>
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
      <MoreLinks current="/posts" />
      <PageFoot />
      <FollowUs />
    </div>
  );
}
