/**
 * Instagram वाली पट्टी — दुकान की तस्वीरें, और profile तक सीधा रास्ता।
 *
 * Owner ने 2 Sep 2026 को Instagram feed widget माँगा था।
 *
 * ⚠️ यह **अपनी photos** दिखाती है, Instagram से अपने आप आने वाली post नहीं —
 * और यहाँ कहीं यह दावा भी नहीं किया गया कि ये latest post हैं। असली live feed
 * के दो ही रास्ते हैं: Meta का embed script (जो ग्राहक को track करता है, और
 * हमारी Privacy Policy में साफ़ लिखा है कि इस website पर कोई tracking नहीं है)
 * या Instagram का API token (owner के account से बनता है और समय-समय पर बदलना
 * पड़ता है)। दोनों में से कोई भी owner के कहने पर लगाया जा सकता है।
 *
 * तब तक यह पट्टी वही काम करती है जो चाहिए था — दुकान की झलक, और एक click में
 * Instagram।
 */

import Image from "next/image";
import { shop } from "@/data/shop";
import { instaTiles } from "@/data/content";
import { IconInstagram, IconArrow } from "./Icons";

export function InstagramFeed() {
  return (
    <section className="sec" aria-labelledby="insta">
      <div className="igw fx">
        <div className="igw-h">
          <span className="igw-av" aria-hidden="true">
            <Image src="/images/mobile-world-logo-87f0b7f5.webp" alt=""
                   width={240} height={240} sizes="52px" />
          </span>
          <span className="igw-n">
            <b id="insta">Instagram पर {shop.name}</b>
            <s>@mobileworldfaridabad</s>
          </span>
          <a className="btn btn-ig btn-s igw-cta" href={shop.social.instagram}
             target="_blank" rel="noopener">
            <IconInstagram /> Follow
          </a>
        </div>

        <ul className="igrid">
          {instaTiles.map((t) => (
            <li key={t.src}>
              <a href={shop.social.instagram} target="_blank" rel="noopener"
                 aria-label={`Instagram पर ${shop.name} — ${t.alt}`}>
                <Image src={t.src} alt={t.alt} width={t.w} height={t.h}
                       sizes="(max-width:700px) 33vw, 16vw" />
                <span className="igrid-i" aria-hidden="true"><IconInstagram /></span>
              </a>
            </li>
          ))}
        </ul>

        <p className="igw-f">
          दुकान की कुछ तस्वीरें। नए stock, offers और gifts की सारी post
          Instagram पर मिलती हैं।
          <a href={shop.social.instagram} target="_blank" rel="noopener">
            Instagram पर देखिए <IconArrow />
          </a>
        </p>
      </div>
    </section>
  );
}
