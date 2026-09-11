import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { shop } from "@/data/shop";
import { postGroups } from "@/data/content";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { PageFoot, Byline } from "@/components/PageFoot";
import { FollowUs } from "@/components/FollowUs";
import { MoreLinks } from "@/components/MoreLinks";

export const metadata: Metadata = {
  title: "Tech Blog & Guides",
  description:
    `Smartphone, laptop, TV और AC की buying guide, exchange और EMI की बातें, ` +
    `और दुकान की ख़बरें — ${shop.name}, ${shop.address.locality}, ${shop.address.city}।`,
  alternates: { canonical: "/posts" },
};

/**
 * ⚠️ 11 Sep 2026 — TOC अब हर article का नाम नहीं, **हिस्सों के नाम** दिखाती है।
 * Owner: *"sabhi blogs ko categorised karo with all the headings lables etc."*
 * Article के पूरे नाम बटन में कट जाते थे; हिस्सों के नाम छोटे और साफ़ हैं।
 */
const toc: TocItem[] = postGroups().map((g) => ({ id: g.id, label: g.name }));

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
        <TableOfContents items={toc} heading="इस page पर ये हिस्से हैं" />

        {postGroups().map((g) => (
          <div className="pgrp" key={g.id}>
            <div className="shead">
              <h2 id={g.id}>{g.name}</h2>
              <span className="pgrp-n">{g.posts.length}</span>
            </div>
            <p className="pgrp-note">{g.note}</p>
            <div className="posts">
              {g.posts.map((p) => (
                <Link className="post rv in" key={p.slug} id={p.slug} href={`/posts/${p.slug}`}>
                  <div className="m">
                    <Image src={p.image} alt={p.alt} width={p.imageW} height={p.imageH}
                      sizes="(max-width:700px) 100vw, 33vw" />
                  </div>
                  <div className="b">
                    <span className="k">{p.kicker}<em>{p.date}</em></span>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "6px 0 0", lineHeight: 1.35 }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: 13.5, color: "var(--ink-2)", margin: "8px 0 0", lineHeight: 1.6 }}>
                      {p.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
      <Byline />
      <MoreLinks current="/posts" />
      <PageFoot />
      <FollowUs />
    </div>
  );
}
