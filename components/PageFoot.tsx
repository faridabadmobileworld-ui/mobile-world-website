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
import Link from "next/link";
import {
  IconPhone, IconWhatsApp, IconPin,
  IconYouTube, IconInstagram, IconFacebook,
  IconCal, IconClock, IconArrow,
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

/**
 * "Written by: Sachin" — page का अपना content जहाँ ख़त्म होता है, ठीक वहीं।
 *
 * Owner ने 2 Sep 2026 को article पढ़ते हुए कहा: *"post yahan khatam ho gyi h,
 * to yahan aana chahiye tha written by wala mera naam... har jagah aise hi
 * karna hoga."* इसलिए यह अब `PageFoot` के अंदर नहीं है — हर page अपने content
 * के आख़िर में ख़ुद `<Byline />` लगाता है, और उसके बाद ही "आगे क्या देखना है",
 * पता और social buttons आते हैं।
 *
 * ⚠️ एक page पर एक ही बार। verify script दो होने पर पकड़ लेती है।
 */
/**
 * लेखक का नाम — एक पूरा card, न कि नीचे पड़ी हुई एक फीकी line।
 *
 * Owner ने 7 Sep 2026 को कहा: *"written by sachin ko premium tareeke se
 * likho, professionally, izzat mile... abhi to fike se bas naam ke liye
 * likh diya h, aisa lag ra h kuch code last me chhoot gya ho."*
 *
 * इसलिए अब इसमें monogram, "Written by" वाला kicker, बड़ा नाम, और नीचे
 * तारीख़ + पढ़ने का समय — सब साफ़ दिखता है।
 *
 * ⚠️ तीन बातें जो तोड़नी नहीं हैं:
 *  • `byline-end` class यहीं रहनी चाहिए — जाँच इसी से गिनती है कि नाम
 *    page पर ठीक एक बार है और सही जगह है।
 *  • **"Written by: Sachin" — यही शब्द।** Owner ने 1 Sep 2026 को साफ़ कहा
 *    था, हिन्दी "लिखा —" नहीं।
 *  • Sachin की कोई तस्वीर हमारे पास नहीं है, और किसी असली आदमी की नक़ली
 *    तस्वीर बनाना मना है (§11)। इसलिए monogram — पहला अक्षर।
 */
export function Byline({
  date, dateISO, time,
}: { date?: string; dateISO?: string; time?: string }) {
  const initial = shop.authorName.trim().charAt(0);
  return (
    <aside className="byl byline-end">
      <span className="byl-av" aria-hidden="true">{initial}</span>

      <div className="byl-b">
        <span className="byl-k">Written by</span>
        <b className="byl-n">{shop.authorName}</b>
        {date && (
          <div className="byl-m">
            <span className="byl-p">
              <IconCal />
              {dateISO ? <time dateTime={dateISO}>{date}</time> : <span>{date}</span>}
            </span>
            {time && <><i aria-hidden="true" /><span className="byl-p"><IconClock />{time}</span></>}
          </div>
        )}
      </div>

      <Link className="byl-cta" href="/posts">
        और लेख <IconArrow />
      </Link>
    </aside>
  );
}
