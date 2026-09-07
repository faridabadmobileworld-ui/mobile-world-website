/**
 * "रुकिए मत — scroll करते जाइए" — सफ़र वाली video के नीचे का इशारा।
 *
 * Owner ने 7 Sep 2026 को असली दिक़्क़त पकड़ी: सफ़र वाली video ऊपर चिपकी
 * रहती थी और उसके नीचे बड़ी ख़ाली जगह दिखती थी, बिना किसी इशारे के।
 * उनके शब्दों में — *"log confuse hokar scroll ya to karna hi chhod rhe h,
 * ya fir wapas ulta ghuma rhe h scrolling wheel."*
 *
 * इसलिए यह पट्टी बनी: एक छोटा सा साथी (नीचे इशारा करता हुआ), साफ़ शब्द, और
 * नीचे की तरफ़ चलते हुए तीन तीर।
 *
 * ⚠️ तीन बातें जान-बूझकर ऐसी हैं:
 *  • **तस्वीर नहीं, code से बनी SVG।** §11 का नियम — जिसकी असली photo नहीं
 *    है उसके लिए drawing। और इससे page पर एक byte भी नहीं जुड़ता।
 *  • यह client component नहीं है — कोई JavaScript नहीं। सारी हरकत CSS से।
 *  • सफ़र ख़त्म होते-होते यह अपने आप मद्धम होकर ग़ायब हो जाती है
 *    (`--jp` से, जो JourneyScroll हर frame पर भरता है) — ताकि आख़िरी पड़ाव
 *    पर "और scroll कीजिए" कहकर झूठा इशारा न करे।
 */

export function ScrollCue() {
  return (
    <div className="jrn-cue" aria-hidden="true">
      <span className="jrn-mas">
        <svg viewBox="0 0 64 72" width="44" height="50">
          <defs>
            <linearGradient id="mwBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#8B6BF7" />
              <stop offset="1" stopColor="#4A2FC4" />
            </linearGradient>
            <linearGradient id="mwFace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1B1B33" />
              <stop offset="1" stopColor="#0C0C1C" />
            </linearGradient>
            <radialGradient id="mwGlow" cx="50%" cy="30%" r="70%">
              <stop offset="0" stopColor="#fff" stopOpacity=".38" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* नीचे की परछाईं — इसी से यह उठा हुआ लगता है */}
          <ellipse className="mas-sh" cx="32" cy="67" rx="15" ry="3.6" fill="#14142B" opacity=".22" />

          {/* डिब्बा — दुकान का सामान, इसलिए phone जैसा */}
          <g className="mas-b">
            <rect x="12" y="6" width="40" height="54" rx="12" fill="url(#mwBody)" />
            <rect x="12" y="6" width="40" height="54" rx="12" fill="url(#mwGlow)" />
            <rect x="16.5" y="11" width="31" height="38" rx="8" fill="url(#mwFace)" />

            {/* आँखें */}
            <circle cx="26" cy="27" r="4.2" fill="#fff" />
            <circle cx="38" cy="27" r="4.2" fill="#fff" />
            <circle className="mas-eye" cx="26.9" cy="28.3" r="2.1" fill="#14142B" />
            <circle className="mas-eye" cx="38.9" cy="28.3" r="2.1" fill="#14142B" />

            {/* मुस्कान */}
            <path d="M27 37.5c1.6 2 7.4 2 9 0" stroke="#E0A44A" strokeWidth="2.1"
                  strokeLinecap="round" fill="none" />

            {/* नीचे इशारा करती हुई बाँह */}
            <g className="mas-arm">
              <path d="M50 34c5 2.5 6.6 7.4 5.4 12" stroke="#8B6BF7" strokeWidth="4"
                    strokeLinecap="round" fill="none" />
              <circle cx="55" cy="48.5" r="4.4" fill="#E0A44A" />
              <path d="M55 45.6v5.8M52.6 49.4 55 51.8l2.4-2.4" stroke="#14142B"
                    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          </g>
        </svg>
      </span>

      <span className="jrn-cue-t">
        <b>रुकिए मत — scroll करते जाइए</b>
        <em>1973 से आज तक का पूरा सफ़र आगे है</em>
      </span>

      <span className="jrn-chev">
        <i /><i /><i />
      </span>
    </div>
  );
}
