/**
 * "साफ़ बात" — जो हम नहीं करते।
 *
 * आवाज़ वही रहनी चाहिए जो CLAUDE.md §13 में लिखी है: गर्मजोशी, इज़्ज़त,
 * सादगी। यह section customer को डराने के लिए नहीं है — भरोसा इसी से बनता
 * है कि दुकान पहले ही साफ़ बता दे कि क्या नहीं होगा।
 *
 * नियम: यहाँ सिर्फ़ वही जोड़ो जो सच में नहीं होता और जिसे customer ख़ुद
 * जाँच सके। कोई "सबसे अच्छा" या "No.1" जैसा दावा यहाँ मत लाओ (§12)।
 * नई line जोड़ने से पहले owner से पूछिए कि वो सच है या नहीं।
 */

const points = [
  {
    title: "इस website से order नहीं होता",
    body: "यहाँ से कुछ ख़रीदा नहीं जा सकता। यह website इसलिए है कि आप देख सकें, " +
      "पूछ सकें, और फिर दुकान पर आकर चीज़ हाथ में लेकर देख सकें।",
  },
  {
    title: "आपकी कोई जानकारी हम नहीं रखते",
    body: "कोई login नहीं, कोई form नहीं, कोई account नहीं। इस website पर आपका " +
      "नाम या नंबर कहीं save नहीं होता।",
  },
  {
    title: "बिना Bill का सामान नहीं",
    body: "हर चीज़ पक्के GST Bill और पूरी Brand Warranty के साथ जाती है। " +
      "Bill माँगना नहीं पड़ता — वो साथ ही मिलता है।",
  },
  {
    title: "Repair बाहर नहीं भेजते",
    body: "फ़ोन कहीं courier से नहीं जाता। दुकान पर, आपके सामने खोलकर देखा " +
      "जाता है, और यहीं ठीक होता है।",
  },
];

export function WhatWeDontDo() {
  return (
    <section className="sec">
      <div className="shead"><h2>साफ़ बात</h2></div>
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
