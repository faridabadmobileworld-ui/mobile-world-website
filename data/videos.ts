/**
 * दुकान के YouTube video — home page पर चलने वाली पट्टी के लिए।
 *
 * Owner ने 2 Sep 2026 को कहा कि reviews वाले video site पर लगें।
 *
 * ── जोड़ना कैसे है ───────────────────────────────────────────────
 * नीचे `videos` में सिर्फ़ video का पूरा link डाल दीजिए। इसी में से id
 * अपने आप निकल जाती है — कोई और file छूने की ज़रूरत नहीं।
 *
 *   { url: "https://www.youtube.com/watch?v=XXXXXXXXXXX", title: "..." },
 *   { url: "https://youtube.com/shorts/XXXXXXXXXXX", title: "...", short: true },
 *
 * `title` वही लिखिए जो video में सच में है — SEO और screen reader दोनों
 * इसी को पढ़ते हैं। `short: true` सिर्फ़ Shorts (खड़े video) के लिए।
 *
 * ⚠️ List ख़ाली हो तो पूरा हिस्सा अपने आप छुप जाता है — page कभी अधूरा
 *    नहीं दिखता।
 */

export type ShopVideo = {
  /** YouTube का पूरा link — watch, youtu.be या shorts, तीनों चलते हैं */
  url: string;
  /** video का नाम, जैसा video में है */
  title: string;
  /** Shorts (खड़ा video) हो तो true */
  short?: boolean;
};

export const videos: ShopVideo[] = [
  // Owner के भेजे link यहाँ आएँगे। ख़ाली रहने पर यह हिस्सा site पर दिखता ही नहीं।
];

/** Link में से video की id निकालता है — तीनों तरह के पते समझता है। */
export function youtubeId(url: string): string | null {
  const m =
    url.match(/[?&]v=([A-Za-z0-9_-]{11})/) ??
    url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/) ??
    url.match(/\/shorts\/([A-Za-z0-9_-]{11})/) ??
    url.match(/\/embed\/([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

/** जिन links से id निकल आई, सिर्फ़ वही — ग़लत link चुपचाप छूट जाता है। */
export const shopVideos = videos
  .map((v) => ({ ...v, id: youtubeId(v.url) }))
  .filter((v): v is ShopVideo & { id: string } => v.id !== null);
