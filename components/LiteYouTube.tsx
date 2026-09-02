"use client";

/**
 * YouTube का video — बिना YouTube का बोझ उठाए।
 *
 * पहले सिर्फ़ एक तस्वीर और play का बटन दिखता है। **जब तक ग्राहक play नहीं
 * दबाता, YouTube का player load ही नहीं होता** — यानी न कोई भारी script,
 * न कोई cookie। दबाते ही असली player उसी डिब्बे में खुल जाता है।
 *
 * Player भी `youtube-nocookie.com` वाला है — YouTube का अपना कम-tracking
 * वाला पता।
 *
 * ⚠️ तस्वीर YouTube के server से आती है। यह बात Privacy page पर लिखी हुई है।
 */

import { useState } from "react";

export function LiteYouTube({
  id, title, short = false,
}: { id: string; title: string; short?: boolean }) {
  const [chala, setChala] = useState(false);

  return (
    <span className={`yt-m${short ? " tall" : ""}`}>
      {chala ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setChala(true)}
                aria-label={`चलाइए — ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt=""
               loading="lazy" decoding="async" width={480} height={360}
               referrerPolicy="no-referrer" />
          <span className="yt-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
              <path d="M8 5.14v13.72L19 12z" />
            </svg>
          </span>
        </button>
      )}
    </span>
  );
}
