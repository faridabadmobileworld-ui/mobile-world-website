/**
 * "दुकान के video" — home page पर खिसकने वाली पट्टी।
 *
 * Video की list `data/videos.ts` में है। List ख़ाली हो तो यह पूरा हिस्सा
 * अपने आप ग़ायब हो जाता है, इसलिए link आने से पहले भी page पूरा दिखता है।
 *
 * Player तभी load होता है जब ग्राहक play दबाए — `LiteYouTube` देखिए।
 */

import { shop } from "@/data/shop";
import { shopVideos } from "@/data/videos";
import { LiteYouTube } from "./LiteYouTube";
import { InstaArrows } from "./InstaArrows";
import { IconYouTube, IconArrow } from "./Icons";

const SLIDER_ID = "yts";

export function VideoRow() {
  if (!shopVideos.length) return null;

  return (
    <section className="sec" aria-labelledby="video">
      {/* ⚠️ 11 Sep 2026 — पहले इस हिस्से की कोई heading ही नहीं थी; नाम
          सिर्फ़ card के अंदर `<b>` में था। Owner ने laptop पर यही पकड़ा:
          *"heading wagairah b nhi h kisi ki"*। हर हिस्से की अपनी `<h2>`
          होनी चाहिए — page की रूपरेखा भी इसी से बनती है। */}
      <div className="shead"><h2 id="video">दुकान के video</h2></div>
      <div className="ytw fx">
        <div className="igw-h">
          <span className="yt-dp" aria-hidden="true"><IconYouTube /></span>
          <span className="igw-n">
            <b>दुकान के video</b>
            <s>YouTube पर हमारा channel</s>
          </span>
          <a className="btn btn-yt btn-s igw-cta" href={shop.social.youtube}
             target="_blank" rel="noopener">
            <IconYouTube /> Subscribe
          </a>
        </div>

        <div className="igs-wrap">
          <ul className="igs" id={SLIDER_ID}>
            {shopVideos.map((v) => (
              <li className="igs-c" key={v.id}>
                <div className="yt-c">
                  <LiteYouTube id={v.id} title={v.title} short={v.short} />
                  <a className="yt-t" href={v.url} target="_blank" rel="noopener">
                    {v.title}
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <InstaArrows target={SLIDER_ID} />
        </div>

        <p className="igw-f">
          Play दबाने तक YouTube से कोई संपर्क नहीं होता — page हल्का रहता है।
          <a href={shop.social.youtube} target="_blank" rel="noopener">
            पूरा channel देखिए <IconArrow />
          </a>
        </p>
      </div>
    </section>
  );
}
