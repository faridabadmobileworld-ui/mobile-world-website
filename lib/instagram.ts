/**
 * Instagram की असली feed — server पर लाई जाती है, browser में नहीं।
 *
 * Owner ने 2 Sep 2026 को कहा: *"live banao ise... koi b random images nhi
 * dikhane h feeds me, properly live sync ho instagram se."*
 *
 * कैसे चलता है
 * ─────────────
 * Vercel में दो चीज़ें भर दीजिए (Settings → Environment Variables):
 *
 *   IG_TOKEN     — Instagram का access token
 *   IG_USER_ID   — (मर्ज़ी से) account की id; न भरें तो "me" चलता है
 *
 * टोकन आते ही पट्टी अपने आप असली post दिखाने लगेगी। Token न हो तो दुकान की
 * अपनी photos दिखती रहती हैं — page कभी टूटता नहीं।
 *
 * ⚠️ Token कभी code में मत लिखिए। सिर्फ़ Vercel के environment variable में।
 *    पूरा तरीक़ा `docs/INSTAGRAM-SETUP.md` में लिखा है।
 *
 * हर घंटे एक बार नई post ढूँढ़ी जाती है (`revalidate: 3600`) — इससे Instagram
 * की हद (rate limit) भी पार नहीं होती और feed ताज़ा भी रहती है।
 */

import { shop } from "@/data/shop";
import { instaTiles } from "@/data/content";

export type IgItem = {
  id: string;
  /** post का असली पता — click करने पर Instagram खुलता है */
  permalink: string;
  /** दिखाने वाली तस्वीर (video हो तो उसका thumbnail) */
  img: string;
  isVideo: boolean;
  caption: string;
  /** "3 दिन पहले" जैसा — server पर ही बन जाता है */
  timeText: string;
  timeISO: string;
};

export type IgFeed = {
  /** true = Instagram से आई हुई असली post; false = दुकान की अपनी photos */
  live: boolean;
  username: string;
  avatar: string;
  items: IgItem[];
};

const API = "https://graph.instagram.com/v23.0";
/** Instagram से आया समय → "3 दिन पहले" वाली हिन्दी। */
function kabKi(iso: string): string {
  const din = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (din <= 0) return "आज";
  if (din === 1) return "कल";
  if (din < 7) return `${din} दिन पहले`;
  if (din < 30) return `${Math.floor(din / 7)} हफ़्ते पहले`;
  if (din < 365) return `${Math.floor(din / 30)} महीने पहले`;
  const saal = Math.floor(din / 365);
  return saal === 1 ? "एक साल पहले" : `${saal} साल पहले`;
}

/** Token न हो, या Instagram जवाब न दे — तब यही दिखता है। */
function apniPhotos(): IgFeed {
  return {
    live: false,
    username: "mobileworldfaridabad",
    avatar: "/images/mobile-world-logo-87f0b7f5.webp",
    items: instaTiles.map((t, i) => ({
      id: `own-${i}`,
      permalink: shop.social.instagram,
      img: t.src,
      isVideo: false,
      caption: t.alt,
      timeText: "",
      timeISO: "",
    })),
  };
}

type ApiMedia = {
  id: string; permalink: string; caption?: string; timestamp: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string; thumbnail_url?: string;
};

/**
 * Instagram से पिछली 12 post लाता है।
 * कुछ भी गड़बड़ हो — token ग़लत, internet न चले, Instagram मना कर दे — तो
 * चुपचाप दुकान की अपनी photos लौटा देता है। Page कभी ख़ाली नहीं दिखता।
 */
export async function getInstagramFeed(): Promise<IgFeed> {
  const token = process.env.IG_TOKEN;
  if (!token) return apniPhotos();

  const user = process.env.IG_USER_ID || "me";
  const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const next = { revalidate: 3600 } as const;

  try {
    const [mediaRes, meRes] = await Promise.all([
      fetch(`${API}/${user}/media?fields=${fields}&limit=12&access_token=${token}`, { next }),
      fetch(`${API}/${user}?fields=username,profile_picture_url&access_token=${token}`, { next }),
    ]);
    if (!mediaRes.ok) {
      console.warn("[instagram] media", mediaRes.status, await mediaRes.text().catch(() => ""));
      return apniPhotos();
    }
    const media = (await mediaRes.json()) as { data?: ApiMedia[] };
    const list = (media.data ?? []).filter((m) => m.media_url || m.thumbnail_url);
    if (!list.length) return apniPhotos();

    const me = meRes.ok
      ? ((await meRes.json()) as { username?: string; profile_picture_url?: string })
      : {};

    return {
      live: true,
      username: me.username || "mobileworldfaridabad",
      avatar: me.profile_picture_url || "/images/mobile-world-logo-87f0b7f5.webp",
      items: list.map((m) => ({
        id: m.id,
        permalink: m.permalink,
        img: (m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url) || m.thumbnail_url || m.media_url!,
        isVideo: m.media_type === "VIDEO",
        caption: (m.caption || "").replace(/\s+/g, " ").trim(),
        timeText: kabKi(m.timestamp),
        timeISO: m.timestamp,
      })),
    };
  } catch (e) {
    console.warn("[instagram] feed नहीं आई:", e);
    return apniPhotos();
  }
}
