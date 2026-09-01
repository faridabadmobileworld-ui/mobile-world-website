import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { shop } from "@/data/shop";
import { PageFoot } from "@/components/PageFoot";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { posts } from "@/data/content";
import { jsonLdScript } from "@/data/schema";
import { IconWhatsApp, IconPhone } from "@/components/Icons";

type Params = { params: Promise<{ slug: string }> };

/** हर post अपने URL पर बनती है — इसीलिए Google इन्हें अलग page मान सकता है। */
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/posts/${post.slug}`,
      publishedTime: post.dateISO,
      images: [{ url: post.image }],
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug);

  // Article ke apne <h2 id="..."> se TOC बन जाती है — दोबारा list लिखने की
  // ज़रूरत नहीं, इसलिए heading बदलने पर TOC अपने आप सही रहती है।
  const toc: TocItem[] = [...post.body.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)]
    .map((m) => ({ id: m[1], label: m[2] }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    image: `${shop.siteUrl}${post.image}`,
    author: { "@type": "Person", name: shop.authorName },
    publisher: {
      "@type": "Organization", name: shop.name,
      logo: { "@type": "ImageObject", url: `${shop.siteUrl}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${shop.siteUrl}/posts/${post.slug}` },
  };

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }} />

      <div className="readerwrap">
        <div className="wrap">
          <article className="reader">
            <Link className="btn btn-o btn-s rback" href="/posts">← सारी जानकारी</Link>

            <div className="rhead">
              <span className="k">{post.kicker}<em>{post.date}</em></span>
              <h1 className="rtitle">{post.title}</h1>
            </div>

            <div className="rmedia">
              <Image className="ph-img" src={post.image} alt={post.alt}
                width={post.imageW} height={post.imageH} priority
                sizes="(max-width:900px) 100vw, 900px" />
            </div>

            <TableOfContents items={toc} />

            <div className="rbody" dangerouslySetInnerHTML={{ __html: post.body }} />

            <div className="rcta">
              <b>इस बारे में कुछ पूछना है?</b>
              <p>दुकान को message कीजिए — जवाब सीधे counter से मिलेगा।</p>
              <div className="btns">
                <a className="btn btn-w" href={
                  `${shop.phone.whatsapp}?text=${encodeURIComponent(
                    `Namaste Mobile World! मुझे "${post.title}" के बारे में पूछना है।`)}`
                } target="_blank" rel="noopener"><IconWhatsApp /> WhatsApp पर पूछिए</a>
                <a className="btn btn-o" href={shop.phone.tel}><IconPhone /> {shop.phone.display}</a>
              </div>
            </div>

            <div className="shead" style={{ marginTop: 26 }}><h2>और भी पढ़िए</h2></div>
            <div className="posts">
              {others.map((p) => (
                <Link className="post" key={p.slug} href={`/posts/${p.slug}`}>
                  <div className="m">
                    <Image src={p.image} alt={p.alt} width={p.imageW} height={p.imageH}
                      sizes="(max-width:700px) 100vw, 33vw" />
                  </div>
                  <div className="b">
                    <span className="k">{p.kicker}</span>
                    <h3>{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
            <PageFoot date={post.date} />
          </article>
        </div>
      </div>
    </>
  );
}
