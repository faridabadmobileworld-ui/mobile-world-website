/**
 * Website के सारे page — एक ही जगह।
 *
 * Owner ने 1 Sep 2026 को कहा: *"interlinking karke sabhi pages ko jodo aapas
 * me... yahan se wahan direct one click pe jaane ke liye."*
 *
 * यह list उसी के लिए है। हर page के नीचे `<MoreLinks>` लगती है, जो इसी list
 * से बाक़ी सारे pages के link बना देती है — जिस page पर आप हैं वो अपने आप
 * छूट जाता है।
 *
 * ⚠️ नया page बनाओ तो **पाँच जगह** जोड़ना है:
 *   1. यह file          — interlinking के लिए
 *   2. `app/sitemap.ts` — Google के लिए
 *   3. `SiteHeader.tsx` — बाएँ वाला menu
 *   4. `SiteFooter.tsx` — नीचे वाला menu
 *   5. `scripts/bundle-preview.mjs` — preview वाली एक file
 * एक भी छूटी तो verify script पकड़ लेगी।
 */

export type SitePage = {
  /** URL — "/repairing" */
  href: string;
  /** Menu और cards में जो नाम दिखेगा */
  label: string;
  /** एक लाइन में — इस page पर क्या मिलेगा */
  blurb: string;
};

export const sitePages: SitePage[] = [
  {
    href: "/",
    label: "Home",
    blurb: "दुकान पर क्या-क्या है, एक नज़र में।",
  },
  {
    href: "/products",
    label: "क्या-क्या मिलता है",
    blurb: "Mobile, Laptop, TV, AC, Fridge, Washing Machine और घर का बाक़ी सामान।",
  },
  {
    href: "/repairing",
    label: "Repairing Services",
    blurb: "Screen, battery, charging port, software — दुकान पर repairing की पूरी list।",
  },
  {
    href: "/after-sales-support",
    label: "After Sales Support",
    blurb: "सामान लेने के बाद data transfer, settings और guidance।",
  },
  {
    href: "/finance",
    label: "Finance और EMI",
    blurb: "Bajaj, IDFC, TVS, HDB समेत EMI की सुविधा — पूरी शर्तें साफ़-साफ़।",
  },
  {
    href: "/team",
    label: "हमारी Team",
    blurb: "वो चेहरे जो counter पर आपको हमेशा मिलेंगे।",
  },
  {
    href: "/about",
    label: "हमारे बारे में",
    blurb: "1973 की किराना दुकान से 2016 की Mobile World तक का सफ़र।",
  },
  {
    href: "/posts",
    label: "Tech Blog & Guides",
    blurb: "ख़रीदने से पहले काम आने वाली guide और दुकान की ख़बरें।",
  },
  {
    href: "/contact",
    label: "Contact Us",
    blurb: "फ़ोन, WhatsApp, पता और Google पर हमारी listing।",
  },
  {
    href: "/visit",
    label: "दुकान पर आइए",
    blurb: "रास्ता, timing और आने से पहले की छोटी सी तैयारी।",
  },
  {
    href: "/privacy",
    label: "Privacy Policy",
    blurb: "आपकी कौन सी जानकारी हम रखते हैं और कौन सी नहीं।",
  },
  {
    href: "/terms",
    label: "Terms & Conditions",
    blurb: "दुकान के नियम — bill, brand warranty, delivery और timing की शर्तें।",
  },
  {
    href: "/returns",
    label: "Return और Exchange",
    blurb: "वापसी, refund और पुराने phone के exchange के नियम — साफ़-साफ़।",
  },
];

/** जिस page पर हैं उसे छोड़कर बाक़ी सब — interlinking के लिए। */
export function otherPages(currentHref: string): SitePage[] {
  return sitePages.filter((p) => p.href !== currentHref);
}
