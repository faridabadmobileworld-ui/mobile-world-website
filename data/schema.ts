/**
 * LocalBusiness JSON-LD schema — पूरा का पूरा `data/shop.ts` से बनता है।
 *
 * यहाँ कोई भी जानकारी दोबारा मत लिखो। दुकान का नाम, पता, phone, timings —
 * सब `shop` से आते हैं। इसलिए `shop.ts` बदलते ही schema अपने आप बदल जाता है।
 *
 * Google इसी schema से search results में दुकान का पता, phone और खुलने का
 * समय दिखाता है। यहाँ कुछ ग़लत हुआ तो customer ग़लत दिन दुकान पहुँच जाएगा।
 */

import { shop, fullAddress } from "@/data/shop";

/**
 * दुकान हर महीने की आख़िरी तारीख़ को बंद रहती है — 28, 29, 30 या 31,
 * जो भी उस महीने की आख़िरी हो।
 *
 * ये तारीख़ें hardcode मत करो। हर build पर आगे की गिन ली जाती हैं, वरना
 * एक-डेढ़ साल बाद list ख़त्म हो जाएगी और Google को लगेगा दुकान उस दिन खुली है।
 *
 * @param from  किस तारीख़ से गिनना शुरू करें (default: आज)
 * @param months कितने महीने आगे तक (default: 18)
 */
export function monthlyClosureDates(from: Date = new Date(), months = 18): string[] {
  const out: string[] = [];

  for (let i = 0; i < months; i++) {
    // महीने का दिन 0 = पिछले महीने का आख़िरी दिन।
    const last = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + i + 1, 0));

    // इस महीने की आख़िरी तारीख़ अगर निकल चुकी है तो उसे मत जोड़ो।
    if (last < startOfDayUTC(from)) continue;

    out.push(last.toISOString().slice(0, 10));
  }

  return out;
}

function startOfDayUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/**
 * एक जैसे timing वाले दिनों को एक ही entry में जोड़ देता है।
 * सातों दिन 10–22 है, तो सात entry की जगह एक बनती है।
 */
function groupedOpeningHours() {
  const byWindow = new Map<string, string[]>();

  for (const h of shop.openingHours) {
    const key = `${h.opens}-${h.closes}`;
    byWindow.set(key, [...(byWindow.get(key) ?? []), h.day]);
  }

  return [...byWindow.entries()].map(([window, days]) => {
    const [opens, closes] = window.split("-");
    return {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days,
      opens,
      closes,
    };
  });
}

/** JSON-LD में `geo` तभी जाएगा जब owner ने coordinates दिए हों। */
function geoBlock() {
  if (!shop.geo) return {};
  return {
    geo: {
      "@type": "GeoCoordinates",
      latitude: shop.geo.latitude,
      longitude: shop.geo.longitude,
    },
  };
}

export function localBusinessSchema(now: Date = new Date()) {
  return {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    "@id": `${shop.siteUrl}/#store`,
    name: shop.name,
    legalName: shop.registeredName,
    founder: { "@type": "Person", name: shop.owner },
    // Mobile World 2016 में शुरू हुई। 1973 परिवार के business की शुरुआत है
    // — वो कहानी About page पर है, schema की foundingDate में नहीं।
    foundingDate: String(shop.foundingYear),
    url: `${shop.siteUrl}/`,
    telephone: shop.phone.display,
    image: `${shop.siteUrl}/og-image.jpg`,
    logo: `${shop.siteUrl}/logo.png`,
    priceRange: "$$",
    currenciesAccepted: "INR",
    paymentAccepted: shop.paymentMethods.join(", "),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${shop.address.street}, ${shop.address.landmark}, ${shop.address.locality}`,
      addressLocality: shop.address.city,
      addressRegion: shop.address.state,
      postalCode: shop.address.postalCode,
      addressCountry: shop.address.country,
    },
    ...geoBlock(),
    areaServed: ["Faridabad", "NIT Faridabad", "Jawahar Colony", "Ballabgarh", "Delhi NCR"],
    openingHoursSpecification: groupedOpeningHours(),

    // हर महीने की आख़िरी तारीख़ की छुट्टी। opens और closes दोनों 00:00 का
    // मतलब schema.org में "उस दिन बंद" होता है।
    specialOpeningHoursSpecification: monthlyClosureDates(now).map((date) => ({
      "@type": "OpeningHoursSpecification",
      opens: "00:00",
      closes: "00:00",
      validFrom: date,
      validThrough: date,
    })),

    hasMap: shop.social.googleMaps,
    sameAs: [shop.social.youtube, shop.social.instagram, shop.social.facebook],
  };
}

/**
 * JSON-LD को `<script>` में डालने से पहले `<` को escape करना ज़रूरी है,
 * वरना कोई भी text जिसमें `</script>` हो, tag को जल्दी बंद कर सकता है।
 * यही Next.js के अपने docs की सलाह है।
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Address एक लाइन में — schema के बाहर भी काम आता है। */
export { fullAddress };

/**
 * Breadcrumb — "Home › इस page का नाम"।
 *
 * Google search में page के पते की जगह यही सीढ़ी दिखती है, जो साफ़ लगती है और
 * click बढ़ाती है। हर page पर `<MoreLinks>` इसे अपने आप लगा देता है, इसलिए
 * किसी page में अलग से कुछ नहीं लिखना पड़ता।
 */
export function breadcrumbSchema(href: string, label: string) {
  const items = [{ name: "Home", url: `${shop.siteUrl}/` }];
  if (href !== "/") items.push({ name: label, url: `${shop.siteUrl}${href}` });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/**
 * FAQ — सवाल-जवाब वाला schema।
 *
 * ⚠️ Google का नियम: जो जवाब यहाँ लिखा है, वो **page पर भी दिखना चाहिए**।
 * इसलिए इसे सिर्फ़ वहीं इस्तेमाल कीजिए जहाँ वही बात page पर लिखी हुई है।
 * बिना page पर लिखे यहाँ जवाब डालना Google की नज़र में गड़बड़ है।
 */
export function faqSchema(qa: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
