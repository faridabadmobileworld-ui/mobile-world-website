import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { shop } from "@/data/shop";
import { PageFoot, Byline } from "@/components/PageFoot";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { livePosts, publishTimeLabel } from "@/data/content";
import { jsonLdScript } from "@/data/schema";
import { IconWhatsApp, IconPhone, IconCal, IconClock, IconList } from "@/components/Icons";
import { ShareRow } from "@/components/ShareRow";

type Params = { params: Promise<{ slug: string }> };

/**
 * जिस post का वक़्त नहीं आया, उसका URL बनता ही नहीं — और `dynamicParams`
 * बंद है, इसलिए Vercel उसे माँगने पर भी नहीं बनाता। यानी 10 बजे से पहले
 * किसी को (Google को भी) वो post किसी तरह नहीं मिल सकती।
 */
export const dynamicParams = false;

/** हर post अपने URL पर बनती है — इसीलिए Google इन्हें अलग page मान सकता है। */
export function generateStaticParams() {
  return livePosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = livePosts().find((p) => p.slug === slug);
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
  const all = livePosts();
  const post = all.find((p) => p.slug === slug);
  if (!post) notFound();

  const others = all.filter((p) => p.slug !== post.slug);

  // Post ठीक किस वक़्त डाली गई — जहाँ `publishAt` लिखा है वहाँ से।
  const time = publishTimeLabel(post.publishAt);

  // Article ke apne <h2 id="..."> se TOC बन जाती है — दोबारा list लिखने की
  // ज़रूरत नहीं, इसलिए heading बदलने पर TOC अपने आप सही रहती है।
  /**
   * TOC heading के अपने `<h2 id="">` से बनती है।
   *
   * Heading के अंदर अब गिनती वाला chip भी होता है (`<span class="hn">01</span>`)।
   * उसे **पूरा** हटाया जाता है, सिर्फ़ tag नहीं — क्योंकि TOC अपनी गिनती ख़ुद
   * दिखाती है, वरना list में "01" दो बार आता ("0101 Battery…")। बाक़ी tag
   * हटाते वक़्त उनकी जगह एक space रखा जाता है, ताकि शब्द आपस में चिपकें नहीं।
   */
  const toc: TocItem[] = [...post.body.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)]
    .map((m) => ({
      id: m[1],
      label: m[2]
        .replace(/<span class="hn">[\s\S]*?<\/span>/g, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    }));

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
            <Link className="btn btn-o btn-s rback" href="/posts">← Tech Blog &amp; Guides</Link>

            <div className="rhead">
              <span className="k">{post.kicker}</span>
              <h1 className="rtitle">{post.title}</h1>
              {/* Ek nazar mein: kab likhi gayi, kitni der lagegi, kitne hisse
                  hain. Teeno gine hue hain — koi andaza nahi. */}
              <div className="rmeta">
                <span className="rmeta-p">
                  <IconCal /><time dateTime={post.dateISO}>{post.date}</time>
                </span>
                {time && <>
                  <i aria-hidden="true" />
                  <span className="rmeta-p"><IconClock />{time}</span>
                </>}
                <i aria-hidden="true" />
                <span className="rmeta-p"><IconList />{toc.length} हिस्से</span>
              </div>
            </div>

            <div className="rmedia">
              {post.heroVideo ? (
                /* Poster वही तस्वीर है जो video में है — इसलिए धीमे internet
                   पर या autoplay बंद होने पर भी डिब्बा कभी ख़ाली नहीं दिखता। */
                <video className="ph-img" src={post.heroVideo.src}
                  poster={post.heroVideo.poster}
                  width={post.imageW} height={post.imageH}
                  autoPlay loop muted playsInline preload="none"
                  aria-label={post.alt} />
              ) : (
                <Image className="ph-img" src={post.image} alt={post.alt}
                  width={post.imageW} height={post.imageH} priority
                  sizes="(max-width:900px) 100vw, 900px" />
              )}
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

            <ShareRow title={post.title} url={`${shop.siteUrl}/posts/${post.slug}`} />

            {/* Owner ने 7 Sep 2026 को यह क्रम तय किया: post का content ख़त्म →
                पता और सारे buttons → लेखक का नाम → उसके बाद बाक़ी posts के
                सुझाव। यानी पढ़ने वाला जहाँ रुकता है, वहीं दुकान तक पहुँचने का
                रास्ता मिल जाता है — नीचे तक scroll नहीं करना पड़ता। */}
            <PageFoot />
            <Byline date={post.date} dateISO={post.dateISO} time={time} />

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
          </article>
        </div>
      </div>
    </>
  );
}
