/**
 * Website के सारे page — एक ही जगह, सही क्रम में।
 *
 * यही list तीन जगह चलती है:
 *   1. ऊपर वाली पट्टी (`SiteHeader` की `.cstrip`) — owner ने 2 Sep 2026 को कहा
 *      *"main baar me pages hi show karo"*
 *   2. बाएँ वाला menu (drawer) — पहले level पर यही pages
 *   3. हर page के नीचे `<MoreLinks>` वाले रंगीन cards
 *
 * क्रम ग्राहक के सफ़र के हिसाब से है: पहले सामान, फिर सेवाएँ (repair, support,
 * EMI, return), फिर पढ़ने की चीज़ें, फिर दुकान का परिचय, और आख़िर में नियम।
 *
 * ⚠️ नया page बनाओ तो **पाँच जगह** जोड़ना है:
 *   1. यह file          — पट्टी, menu और interlinking, तीनों के लिए
 *   2. `app/sitemap.ts` — Google के लिए
 *   3. `SiteHeader.tsx` — menu में उसका icon (अगर नया tone/emoji चाहिए)
 *   4. `SiteFooter.tsx` — नीचे वाला menu
 *   5. `scripts/bundle-preview.mjs` — preview वाली एक file
 * एक भी छूटी तो verify script पकड़ लेगी।
 */

export type SitePage = {
  /** URL — "/repairing" */
  href: string;
  /** पूरा नाम — menu और cards में यही दिखता है */
  label: string;
  /** छोटा नाम — ऊपर वाली पतली पट्टी के लिए */
  short: string;
  /** एक लाइन में — इस page पर क्या मिलेगा */
  blurb: string;
  /** card और menu पर लगने वाला निशान */
  emoji: string;
  /** इस page का अपना रंग — buttons और cards इसी से रंगीन होते हैं */
  tone: string;
};

export const sitePages: SitePage[] = [
  {
    href: "/", label: "Home", short: "Home", emoji: "🏠", tone: "#5B3FD9",
    blurb: "दुकान पर क्या-क्या है, एक नज़र में।",
  },
  {
    href: "/products", label: "सारा सामान", short: "सामान", emoji: "🛍️", tone: "#2563EB",
    blurb: "Mobile, Laptop, TV, AC, Fridge, Washing Machine और घर का बाक़ी सामान।",
  },
  {
    href: "/repairing", label: "Repairing Services", short: "Repairing", emoji: "🔧", tone: "#E8542F",
    blurb: "Screen, battery, charging port, software — दुकान पर repairing की पूरी list।",
  },
  {
    href: "/after-sales-support", label: "After Sales Support", short: "After Sales", emoji: "🤝", tone: "#12915A",
    blurb: "सामान लेने के बाद data transfer, settings और guidance।",
  },
  {
    href: "/finance", label: "Finance और EMI", short: "Finance", emoji: "💳", tone: "#7B3FE4",
    blurb: "Paper finance और card EMI — पूरी शर्तें साफ़-साफ़।",
  },
  {
    href: "/returns", label: "Return और Exchange", short: "Return", emoji: "♻️", tone: "#0E9488",
    blurb: "वापसी, refund और पुराने phone के exchange के नियम।",
  },
  {
    href: "/posts", label: "Tech Blog & Guides", short: "Blog", emoji: "📝", tone: "#DD2A7B",
    blurb: "ख़रीदने से पहले काम आने वाली guide और दुकान की ख़बरें।",
  },
  {
    href: "/about", label: "हमारे बारे में", short: "About", emoji: "❤️", tone: "#D93A5C",
    blurb: "1973 की किराना दुकान से 2016 की Mobile World तक का सफ़र।",
  },
  {
    href: "/team", label: "हमारी Team", short: "Team", emoji: "👥", tone: "#B4690E",
    blurb: "वो चेहरे जो counter पर आपको हमेशा मिलेंगे।",
  },
  {
    href: "/contact", label: "Contact Us", short: "Contact", emoji: "📞", tone: "#1877F2",
    blurb: "फ़ोन, WhatsApp, पता और Google पर हमारी listing।",
  },
  {
    href: "/visit", label: "दुकान पर आइए", short: "आइए", emoji: "📍", tone: "#C13584",
    blurb: "रास्ता, timing और आने से पहले की छोटी सी तैयारी।",
  },
  {
    href: "/terms", label: "Terms & Conditions", short: "Terms", emoji: "📜", tone: "#5A5A72",
    blurb: "दुकान के नियम — bill, brand warranty, delivery और timing की शर्तें।",
  },
  {
    href: "/privacy", label: "Privacy Policy", short: "Privacy", emoji: "🔒", tone: "#3F4A66",
    blurb: "आपकी कौन सी जानकारी हम रखते हैं और कौन सी नहीं।",
  },
];

/** जिस page पर हैं उसे छोड़कर बाक़ी सब — interlinking के लिए। */
export function otherPages(currentHref: string): SitePage[] {
  return sitePages.filter((p) => p.href !== currentHref);
}
