/**
 * "हम ये नहीं करते" — दुकान की साफ़ बात।
 *
 * यहाँ सिर्फ़ वही लिखा है जो सच में नहीं होता, और जिसे customer ख़ुद जाँच
 * सकता है। कोई "सबसे अच्छा", "No.1" या "best price" जैसा दावा यहाँ मत
 * जोड़ो (CLAUDE.md §12) — इस section की पूरी ताक़त इसी में है कि यह
 * दावा नहीं, वादा है।
 *
 * नई line जोड़नी हो तो पहले owner से पूछिए कि वो सच है या नहीं।
 */

const points = [
  {
    title: "Online order या payment नहीं",
    body: "इस website से कुछ ख़रीदा नहीं जा सकता। यहाँ सिर्फ़ देख सकते हैं, " +
      "पूछ सकते हैं, और दुकान आ सकते हैं। पैसा हमेशा counter पर।",
  },
  {
    title: "आपकी कोई जानकारी save नहीं होती",
    body: "कोई login नहीं, कोई form नहीं, कोई account नहीं। इस website पर " +
      "आपका नाम या नंबर कहीं नहीं रखा जाता।",
  },
  {
    title: "बिना bill का सामान नहीं",
    body: "हर चीज़ GST bill और पूरी brand warranty के साथ जाती है। " +
      "Bill न हो तो warranty भी नहीं — इसलिए हम bill देते हैं, माँगना नहीं पड़ता।",
  },
  {
    title: "Repair बाहर नहीं भेजते",
    body: "फ़ोन कहीं courier से नहीं जाता। दुकान पर, आपके सामने खोलकर " +
      "देखा जाता है, और यहीं ठीक होता है।",
  },
];

export function WhatWeDontDo() {
  return (
    <section className="sec">
      <div className="shead"><h2>हम ये नहीं करते</h2></div>
      <ul className="dontdo">
        {points.map((p) => (
          <li className="rv in" key={p.title}>
            <span className="x" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </span>
            <span>
              <b>{p.title}</b>
              <em>{p.body}</em>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
