/**
 * हर page के आख़िर में एक जैसा block — पता, फ़ोन, website और सारे social buttons।
 *
 * Owner ने 1 Sep 2026 को दिए हुए content में यह हर page के नीचे था:
 *
 *   📍 MOBILE WORLD · Gurudwara Road, Jawahar Colony, NIT Faridabad
 *   📞 Call / WhatsApp · 🌐 Website · 📱 Follow us
 *
 * सारी जानकारी `data/shop.ts` से आती है — यहाँ कुछ भी दोबारा नहीं लिखा।
 * इसीलिए नंबर या पता बदलना हो तो सिर्फ़ वही एक file बदलनी है।
 */

import { shop } from "@/data/shop";
import { whatsappGeneral } from "@/data/content";
import {
  IconPhone, IconWhatsApp, IconPin,
  IconYouTube, IconInstagram, IconFacebook,
} from "./Icons";

export function PageFoot() {
  return (
    <section className="sec">
      <div className="pfoot rv in">
        <h2>📍 {shop.name}</h2>
        <address>
          {shop.address.street}<br />
          {shop.address.landmark}<br />
          {shop.address.locality}, {shop.address.city}, {shop.address.state}, India – {shop.address.postalCode}<br />
          <br />
          रोज़ सुबह 10:00 बजे से रात 10:00 बजे तक, सातों दिन।<br />
          <a href={shop.phone.tel}>{shop.phone.display}</a>
        </address>

        <div className="btns">
          <a className="btn btn-w" href={whatsappGeneral} target="_blank" rel="noopener">
            <IconWhatsApp /> WhatsApp
          </a>
          <a className="btn btn-d" href={shop.phone.tel}>
            <IconPhone /> Call कीजिए
          </a>
          <a className="btn btn-o" href={shop.social.googleMaps} target="_blank" rel="noopener">
            <IconPin /> रास्ता देखिए
          </a>
        </div>

        <div className="btns" style={{ marginTop: 8 }}>
          <a className="btn btn-yt" href={shop.social.youtube} target="_blank" rel="noopener">
            <IconYouTube /> YouTube
          </a>
          <a className="btn btn-ig" href={shop.social.instagram} target="_blank" rel="noopener">
            <IconInstagram /> Instagram
          </a>
          <a className="btn btn-fb" href={shop.social.facebook} target="_blank" rel="noopener">
            <IconFacebook /> Facebook
          </a>
        </div>

        <p style={{ fontSize: 13.5, color: "var(--ink-3)", margin: "14px 0 0" }}>
          🙏 {shop.name} से जुड़े रहने के लिए धन्यवाद! ❤️
        </p>
      </div>
    </section>
  );
}

/** Article या page के ऊपर — किसने लिखा और कब। */
export function Byline({ date }: { date?: string }) {
  return (
    <p className="byline">
      <span>लिखा — <b>{shop.authorName}</b></span>
      {date && <><i aria-hidden="true" /><span>{date}</span></>}
    </p>
  );
}
