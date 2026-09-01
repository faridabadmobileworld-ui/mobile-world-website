/**
 * EMI और finance वाली कंपनियाँ — owner ने 1 Sep 2026 को यह list दी,
 * और उसी दिन असली logo भी भेज दिए।
 *
 * Logo की fileें `public/images/finance/` में हैं। सातों एक ही नाप की हैं —
 * 420×132, सफ़ेद background — इसलिए चलती पट्टी में सब एक जैसे बैठते हैं।
 * (Bajaj, IDFC, TVS और HDB दुकान के अपने poster में से काटे गए हैं;
 * Home Credit, Axio और DMI अलग file के रूप में मिले।)
 *
 * ⚠️ `logo` हटा दीजिए तो पट्टी में उस company का **नाम** दिखने लगेगा —
 * `FinanceStrip` दोनों सँभाल लेती है। नई company जोड़ें तो logo भी उसी
 * 420×132 नाप में बनाइए, तरीक़ा `public/images/finance/README.md` में है।
 */

export type FinancePartner = {
  /** जो नाम दिखेगा (और logo का alt text भी यही बनेगा) */
  name: string;
  /** छोटा सा उपनाम — जैसे Axio का पुराना नाम */
  note?: string;
  /** logo की file — 420×132, सफ़ेद background */
  logo?: string;
};

export const financePartners: FinancePartner[] = [
  { name: "Bajaj Finserv", logo: "/images/finance/bajaj-finserv.webp" },
  { name: "IDFC FIRST Bank", logo: "/images/finance/idfc-first-bank.webp" },
  { name: "TVS Credit", logo: "/images/finance/tvs-credit.webp" },
  { name: "HDB Financial Services", logo: "/images/finance/hdb-financial-services.webp" },
  { name: "Home Credit", logo: "/images/finance/home-credit.webp" },
  { name: "Axio", note: "Xiaomi Easy Finance", logo: "/images/finance/axio.webp" },
  { name: "DMI Finance", logo: "/images/finance/dmi-finance.webp" },
];

/** पट्टी और cards में हर logo इसी नाप का है — एक जगह लिखा, सब जगह वही। */
export const LOGO_W = 420;
export const LOGO_H = 132;
