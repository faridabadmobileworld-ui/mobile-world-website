/**
 * "हमें follow कीजिए" — चारों जगह के अलग-अलग buttons।
 *
 * Owner हर offer, gift और नए stock की जानकारी अपने social pages पर डालते
 * हैं, इसलिए चारों links एक ही जगह, एक-एक button बनकर मिलते हैं।
 *
 * WhatsApp यहाँ जान-बूझकर शामिल है — बाक़ी तीन देखने के लिए हैं, WhatsApp
 * से customer सीधे बात कर सकता है।
 */

import { shop } from "@/data/shop";
import { whatsappGeneral } from "@/data/content";
import { IconYouTube, IconInstagram, IconFacebook, IconWhatsApp } from "./Icons";

export function FollowUs({ heading = "हमसे जुड़े रहिए" }: { heading?: string }) {
  return (
    <section className="sec">
      <div className="follow rv in">
        <div>
          <b>{heading}</b>
          <p>
            भारी discounts, gifts, offers और नए stock की जानकारी सबसे पहले यहीं
            मिलती है। हमें YouTube, Instagram, Facebook और WhatsApp पर follow कीजिए।
          </p>
        </div>
        <div className="fbtns">
          <a className="btn btn-yt" href={shop.social.youtube} target="_blank" rel="noopener">
            <IconYouTube /> YouTube
          </a>
          <a className="btn btn-ig" href={shop.social.instagram} target="_blank" rel="noopener">
            <IconInstagram /> Instagram
          </a>
          <a className="btn btn-fb" href={shop.social.facebook} target="_blank" rel="noopener">
            <IconFacebook /> Facebook
          </a>
          <a className="btn btn-w" href={whatsappGeneral} target="_blank" rel="noopener">
            <IconWhatsApp /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
