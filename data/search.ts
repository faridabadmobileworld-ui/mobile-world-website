import { categories } from "@/data/shop";
import { items, livePosts } from "@/data/content";
import { sitePages } from "@/data/pages";

/**
 * Search की हल्की list — जो header के search box में तुरंत नतीजे दिखाती है।
 *
 * ⚠️ **यह list server पर बनती है और prop बनकर client तक जाती है।**
 * इसे कभी सीधे client component में `import` मत कीजिए — वैसा करने पर
 * `data/content.ts` का पूरा माल (हर article का पूरा body, हज़ारों शब्द)
 * भी phone पर download होने लगेगा। अभी सिर्फ़ नाम और पते जाते हैं —
 * पूरी list ~4 KB की है।
 *
 * हर entry में तीन ही चीज़ें हैं: क्या दिखाना है, कहाँ भेजना है, और किन
 * शब्दों से मिलनी चाहिए।
 */
export type SearchEntry = {
  /** screen पर दिखने वाला नाम */
  t: string;
  /** नीचे छोटा सा परिचय — किस तरह की चीज़ है */
  k: string;
  /** कहाँ ले जाना है */
  h: string;
  /** ढूँढ़ने लायक़ शब्द, सब छोटे अक्षरों में जुड़े हुए */
  s: string;
};

/**
 * रोज़मर्रा के वो शब्द जो ग्राहक असल में टाइप करता है।
 *
 * कोई "Refrigerators" नहीं लिखता — "fridge" या "फ्रिज" लिखता है। कोई
 * "Air Conditioners" नहीं लिखता — "ac" लिखता है। ये जोड़े बिना search
 * ख़ाली हाथ लौटाता है, और ग्राहक समझता है कि दुकान पर चीज़ है ही नहीं।
 */
const alias: Record<string, string> = {
  "smartphones": "phone mobile फ़ोन फोन मोबाइल smartphone 5g android iphone",
  "laptops-tablets": "laptop tablet लैपटॉप टैबलेट computer कंप्यूटर notebook ipad",
  "televisions": "tv television टीवी टेलीविजन smart tv led 32 43 55 inch",
  "air-conditioners": "ac air conditioner एसी कूलिंग split window ton टन",
  "washing-machines": "washing machine वाशिंग मशीन कपड़े धोने washer front load top load",
  "refrigerators": "fridge refrigerator फ्रिज फ्रीज रेफ्रिजरेटर double door single door",
  "inverters-batteries": "inverter battery इन्वर्टर बैटरी stabilizer बिजली backup",
  "audio-wearables": "earbuds speaker watch इयरबड स्पीकर घड़ी headphone smartwatch band audio",
  "kitchen-appliances": "kitchen रसोई air fryer microwave mixer grinder toaster kettle",
  "accessories": "cover case charger cable कवर चार्जर केबल tempered glass power bank",
};

/** दो text जोड़कर ढूँढ़ने लायक़ बनाओ — सब छोटे अक्षरों में। */
function key(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

/**
 * पूरी list — **सिर्फ़ server component में बुलाइए।**
 *
 * क्रम मायने रखता है: पहले सामान (ग्राहक ज़्यादातर वही ढूँढ़ता है), फिर
 * category, फिर पढ़ने की चीज़ें, और आख़िर में बाक़ी pages।
 */
export function buildSearchIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];

  // 1. दुकान का सामान
  for (const it of items) {
    out.push({
      t: it.title,
      k: it.kicker,
      h: `/products#${it.category}`,
      s: key(it.title, it.kicker, it.tags.join(" "), alias[it.category]),
    });
  }

  // 2. Category के नाम — "AC" टाइप करने पर सीधी category भी मिले
  for (const c of categories) {
    out.push({
      t: c.name,
      k: "Category",
      h: `/products#${c.slug}`,
      s: key(c.name, alias[c.slug]),
    });
  }

  // 3. पढ़ने की चीज़ें — जिनका वक़्त आ चुका है, सिर्फ़ वही
  for (const p of livePosts()) {
    out.push({
      t: p.title,
      k: p.kicker,
      h: `/posts/${p.slug}`,
      s: key(p.title, p.kicker, p.excerpt),
    });
  }

  // 4. बाक़ी सारे page
  for (const pg of sitePages) {
    out.push({
      t: pg.label,
      k: "Page",
      h: pg.href,
      s: key(pg.label, pg.short, pg.blurb),
    });
  }

  return out;
}

/**
 * टाइप किए हुए शब्द से मेल खाती entries — ज़्यादा से ज़्यादा `limit`।
 *
 * हर शब्द अलग से मिलाया जाता है ("smart tv" लिखने पर दोनों शब्द होने
 * चाहिए), और जिस entry का **नाम** शब्द से शुरू होता है वो ऊपर आती है —
 * "ac" टाइप करने पर "Air Conditioners" पहले, "AC कितने ton का" बाद में।
 */
export function searchIn(index: SearchEntry[], term: string, limit = 8): SearchEntry[] {
  const words = term.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  // ⚠️ पूरा शब्द पहले। "ac" टाइप करने पर "Accessories" ऊपर आ जाता था,
  // क्योंकि वो भी "ac" से शुरू होता है — जबकि ग्राहक का मतलब हमेशा
  // Air Conditioner से होता है। इसलिए जिस entry में शब्द **पूरा** मिलता
  // है (आगे-पीछे जगह हो), वो सबसे ऊपर आती है।
  const whole = new RegExp(`(^|\\s)${words[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`);

  const hits: { e: SearchEntry; rank: number }[] = [];
  for (const e of index) {
    if (!words.every((w) => e.s.includes(w))) continue;
    const name = e.t.toLowerCase();
    const rank =
      whole.test(name) ? 0 :
      whole.test(e.s) ? 1 :
      name.startsWith(words[0]) ? 2 :
      name.includes(words[0]) ? 3 : 4;
    hits.push({ e, rank });
  }

  hits.sort((a, b) => a.rank - b.rank);
  return hits.slice(0, limit).map((h) => h.e);
}
