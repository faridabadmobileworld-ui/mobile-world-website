import { shop } from "@/data/shop";

/**
 * Google को दुकान की जानकारी बताने वाला LocalBusiness JSON-LD.
 *
 * यह screen पर नहीं दिखता — सिर्फ़ Google, Bing वग़ैरह पढ़ते हैं। इससे local
 * search में दुकान सही जानकारी के साथ दिखती है (CLAUDE.md §7)।
 *
 * सारी जानकारी shop.ts से आती है। जो अभी पता नहीं (जैसे map coordinates),
 * वो भेजा ही नहीं जाता — अधूरी जानकारी भेजने से न भेजना बेहतर है।
 */
export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: shop.name,
    legalName: shop.registeredName,
    url: shop.siteUrl,
    telephone: shop.phone.display,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${shop.address.street}, ${shop.address.landmark}`,
      addressLocality: `${shop.address.locality}, ${shop.address.city}`,
      addressRegion: shop.address.state,
      postalCode: shop.address.postalCode,
      addressCountry: shop.address.country,
    },
    openingHoursSpecification: shop.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${h.day}`,
      opens: h.opens,
      closes: h.closes,
    })),
    // सिर्फ़ वही social links जो सच में भरे हुए हैं।
    sameAs: [shop.social.youtube, shop.social.instagram, shop.social.facebook].filter(
      Boolean,
    ),
    // geo और hasMap तभी जुड़ेंगे जब owner coordinates और Maps URL दे देगा।
    ...(shop.geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: shop.geo.latitude,
        longitude: shop.geo.longitude,
      },
    }),
    ...(shop.social.googleMaps && { hasMap: shop.social.googleMaps }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
