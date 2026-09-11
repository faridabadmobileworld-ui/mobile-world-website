/**
 * Home page पर सबसे नई post का अलग highlight।
 *
 * Owner ने 7 Sep 2026 को पकड़ा: Redmi 17 5G वाली post live तो हो गई, पर
 * home page पर वो बहुत नीचे थी — *"ye wahan main page home page pe dikh b
 * nhi rhi h."*
 *
 * इसलिए यह पट्टी सफ़र वाली video के ठीक बाद आती है, यानी home page का पहला
 * पढ़ने वाला हिस्सा।
 *
 * ⚠️ यहाँ किसी post का नाम hardcode नहीं है। `livePosts()` में जो सबसे नई
 * तारीख़ वाली है, वही अपने आप आती है — इसलिए अगली post डालते ही यह ख़ुद बदल
 * जाएगी, किसी को याद रखना नहीं पड़ेगा। जिस post का वक़्त नहीं आया वो यहाँ भी
 * नहीं दिखती (`livePosts` उसे पहले ही छाँट देती है)।
 */

import Image from "next/image";
import Link from "next/link";
import { livePosts, publishTimeLabel } from "@/data/content";
import { IconArrow, IconCal, IconClock } from "@/components/Icons";

export function LatestPost() {
  const post = [...livePosts()].sort((a, b) => b.dateISO.localeCompare(a.dateISO))[0];
  if (!post) return null;

  const time = publishTimeLabel(post.publishAt);

  return (
    <section className="sec" aria-labelledby="featured">
      {/* ⚠️ 11 Sep 2026 — owner: "Redmi 17 ki post ke upar heading banao
          kuch, like Featured Post". Post का अपना title अब `h3` है, क्योंकि
          इस हिस्से की heading यह `h2` है। */}
      <div className="shead">
        <h2 id="featured">Featured Post — सबसे नई ख़बर</h2>
        <Link href="/posts">सारे articles <IconArrow /></Link>
      </div>
      <Link className="lnew rv in" href={`/posts/${post.slug}`}>
        <span className="lnew-m">
          <Image className="ph-img" src={post.image} alt={post.alt}
                 width={post.imageW} height={post.imageH}
                 sizes="(max-width:780px) 100vw, 420px" />
          <b className="lnew-tag">नया</b>
        </span>

        <span className="lnew-b">
          <span className="lnew-k">{post.kicker}</span>
          <h3 className="lnew-h">{post.title}</h3>
          <span className="lnew-x">{post.excerpt}</span>

          <span className="lnew-meta">
            <span><IconCal /><time dateTime={post.dateISO}>{post.date}</time></span>
            {time && <><i aria-hidden="true" /><span><IconClock />{time}</span></>}
          </span>

          <span className="lnew-go">पूरा पढ़िए <IconArrow /></span>
        </span>
      </Link>
    </section>
  );
}
