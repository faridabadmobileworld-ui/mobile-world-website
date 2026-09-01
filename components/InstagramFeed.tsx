/**
 * Instagram वाली पट्टी — असली post, खिसकने वाली slides में।
 *
 * Owner ने 2 Sep 2026 को EmbedSocial का slider दिखाकर कहा: *"live banao ise,
 * slides me ye sabhi videos chalti dikhai de... properly live sync ho
 * instagram se."*
 *
 * Post कहाँ से आती हैं, यह `lib/instagram.ts` देखता है:
 *   • Vercel में `IG_TOKEN` भरा है → Instagram से असली post (हर घंटे ताज़ा)
 *   • नहीं भरा → दुकान की अपनी photos, और नीचे साफ़ लिखा रहता है कि ये
 *     दुकान की तस्वीरें हैं। कोई झूठा दावा नहीं।
 *
 * तस्वीरें सीधे Instagram के server से आती हैं। इसीलिए Privacy Policy में
 * यह बात लिखी हुई है — छुपाई नहीं गई।
 */

import Image from "next/image";
import { shop } from "@/data/shop";
import { getInstagramFeed } from "@/lib/instagram";
import { InstaArrows } from "./InstaArrows";
import { IconInstagram, IconArrow } from "./Icons";

const SLIDER_ID = "igs";

export async function InstagramFeed() {
  const feed = await getInstagramFeed();

  return (
    <section className="sec" aria-labelledby="insta">
      <div className="igw fx">
        <div className="igw-h">
          <span className="igw-av">
            <Image src={feed.avatar} alt="" width={240} height={240} sizes="52px"
                   unoptimized={feed.avatar.startsWith("http")} />
          </span>
          <span className="igw-n">
            <b id="insta">{shop.name} {shop.address.city}</b>
            <s>@{feed.username} · Instagram</s>
          </span>
          <a className="btn btn-ig btn-s igw-cta" href={shop.social.instagram}
             target="_blank" rel="noopener">
            <IconInstagram /> Follow
          </a>
        </div>

        <div className="igs-wrap">
          <ul className="igs" id={SLIDER_ID}>
            {feed.items.map((it) => (
              <li className="igs-c" key={it.id}>
                <a href={it.permalink} target="_blank" rel="noopener"
                   aria-label={it.caption ? it.caption.slice(0, 80) : `Instagram पर ${shop.name}`}>
                  <span className="igs-top">
                    <span className="igs-dp" aria-hidden="true">
                      <Image src={feed.avatar} alt="" width={120} height={120} sizes="28px"
                             unoptimized={feed.avatar.startsWith("http")} />
                    </span>
                    <span className="igs-who">
                      <b>{feed.username}</b>
                      {it.timeText && <em>{it.timeText}</em>}
                    </span>
                    <span className="igs-ig" aria-hidden="true"><IconInstagram /></span>
                  </span>

                  <span className="igs-m">
                    <Image src={it.img} alt={it.caption ? "" : `${shop.name} की तस्वीर`}
                           fill sizes="(max-width:700px) 74vw, 260px"
                           unoptimized={it.img.startsWith("http")} />
                    {it.isVideo && (
                      <span className="igs-play" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                          <path d="M8 5.14v13.72L19 12z" />
                        </svg>
                      </span>
                    )}
                  </span>

                  {it.caption && <span className="igs-cap">{it.caption}</span>}
                </a>
              </li>
            ))}
          </ul>
          <InstaArrows target={SLIDER_ID} />
        </div>

        <p className="igw-f">
          {feed.live
            ? "ये हमारी Instagram की post हैं — हर घंटे अपने आप ताज़ा हो जाती हैं।"
            : "दुकान की कुछ तस्वीरें। नए stock, offers और reels सब Instagram पर मिलते हैं।"}
          <a href={shop.social.instagram} target="_blank" rel="noopener">
            Instagram पर देखिए <IconArrow />
          </a>
        </p>
      </div>
    </section>
  );
}
