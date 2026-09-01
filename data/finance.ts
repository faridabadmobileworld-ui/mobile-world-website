/**
 * EMI और finance वाली कंपनियाँ — owner ने 1 Sep 2026 को यह list दी।
 *
 * ⚠️ **Logo अभी नहीं लगे हैं।** Owner ने असली logos लगाने को कहा है, पर
 * किसी company का logo internet से उठाकर लगाना उनका trademark इस्तेमाल
 * करना होता है — वो file owner से ही आनी चाहिए।
 *
 * जब logo मिल जाएँ: हर entry में `logo: "/images/finance/bajaj.webp"`
 * जोड़ दीजिए। `FinanceStrip` अपने आप नाम की जगह logo दिखाने लगेगी —
 * component में कुछ बदलने की ज़रूरत नहीं।
 *
 * Logo की नाप: चौड़ाई 240px तक, background साफ़/सफ़ेद, .webp या .png।
 */

export type FinancePartner = {
  /** जो नाम दिखेगा (और logo का alt text भी यही बनेगा) */
  name: string;
  /** छोटा सा उपनाम — जैसे Axio का पुराना नाम */
  note?: string;
  /** logo की file, जब owner भेज दें */
  logo?: string;
};

export const financePartners: FinancePartner[] = [
  { name: "Bajaj Finserv" },
  { name: "IDFC FIRST Bank" },
  { name: "TVS Credit" },
  { name: "HDB Financial Services" },
  { name: "Home Credit" },
  { name: "Axio", note: "Xiaomi Easy Finance" },
  { name: "DMI Finance" },
];
