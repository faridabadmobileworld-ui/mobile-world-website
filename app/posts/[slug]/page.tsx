import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { shop } from "@/data/shop";
import { posts } from "@/data/content";
import { jsonLdScript } from "@/data/schema";
import { IconWhatsApp } from "@/components/Icons";

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

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    image: `${shop.siteUrl}${post.image}`,
    author: { "@type": "Organization", name: shop.name, url: `${shop.siteUrl}/` },
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
            <Link className="btn btn-o btn-s rback" href="/posts">← Back to posts</Link>

            <div className="rhead">
              <span className="k">{post.kicker}<em>{post.date}</em></span>
              <h1 className="rtitle">{post.title}</h1>
            </div>

            <div className="rmedia">
              <Image className="ph-img" src={post.image} alt={post.alt}
                width={post.imageW} height={post.imageH} priority
                sizes="(max-width:900px) 100vw, 900px" />
            </div>

            <div className="rbody" dangerouslySetInnerHTML={{ __html: post.body }} />

            <div className="rcta">
              <b>Is baare mein poochhna hai?</b>
              <p>Store ko message kijiye, seedha jawab milega.</p>
              <div className="btns">
                <a className="btn btn-w" href={
                  `${shop.phone.whatsapp}?text=${encodeURIComponent(
                    `Hello Mobile World! I have a question about "${post.title}".`)}`
                } target="_blank" rel="noopener"><IconWhatsApp /> Ask on WhatsApp</a>
                <a className="btn btn-o" href={shop.phone.tel}>Call the store</a>
              </div>
            </div>

            <div className="shead" style={{ marginTop: 26 }}><h2>More updates</h2></div>
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
          </article>
        </div>
      </div>
    </>
  );
}
