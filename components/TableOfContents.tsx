/**
 * इस page पर क्या-क्या है — ऊपर एक छोटी सी सूची।
 *
 * Owner ने 1 Sep 2026 को कहा: हर page पर table of contents होनी चाहिए।
 *
 * यह जान-बूझकर **server पर ही बन जाती है** — JavaScript से headings ढूँढ़कर
 * नहीं बनती। दो वजह:
 *   1. Google को यह पहली बार में ही दिख जाती है (JS का इंतज़ार नहीं)।
 *   2. धीमे फ़ोन पर page खुलते ही दिख जाती है, बाद में कूदकर नहीं आती।
 *
 * इस्तेमाल: हर page अपनी headings की list ख़ुद देता है, और उन्हीं `id`
 * को अपने `<h2>` पर लगाता है। दोनों एक जैसे रहने चाहिए।
 *
 * 📌 **7 Sep 2026 — यह अब सूची नहीं, एक dashboard है।** Owner ने कहा:
 * *"Is page par kya kya h wale ko professional dashboard me switch karo,
 * chhota karo, buttons me set karo. agar 9 h wo abhi points, to 3-3 ki 3
 * lines bna do. alag alag colours me show karo. animations daalo."*
 * इसलिए हर point अब अपने रंग वाला बटन है, तीन-तीन की क़तार में
 * (दिखावट `globals.css` के `.toc-g` में)।
 *
 * ⚠️ **Label छोटा रखिए** — तीन की क़तार में एक डिब्बा 110-140px चौड़ा होता है।
 * लंबा label दो-तीन line ले लेता है और क़तार टेढ़ी दिखने लगती है। जो heading
 * लंबी हो, उसका TOC label छोटा लिखिए — दोनों का एक होना ज़रूरी नहीं, बस `id`
 * एक होनी चाहिए।
 */

export type TocItem = {
  /** उसी `<h2 id="...">` वाला id */
  id: string;
  /** सूची में जो लिखा दिखेगा */
  label: string;
};

export function TableOfContents({
  items,
  heading = "इस page पर",
  cols = 3,
}: {
  items: readonly TocItem[];
  heading?: string;
  /**
   * एक क़तार में कितने डिब्बे। Owner ने home page के लिए **तीन** कहे थे, और
   * वही हर जगह की default है। `/posts` पर labels असली article के नाम हैं —
   * वो तीन की क़तार में कट जाते हैं, इसलिए वहाँ दो हैं।
   */
  cols?: 2 | 3;
}) {
  if (items.length === 0) return null;

  return (
    <nav className="toc rv in" aria-label={heading}>
      <div className="toc-t">
        <b className="toc-h">{heading}</b>
        <i className="toc-r" aria-hidden="true" />
        <span className="toc-c">{items.length}</span>
      </div>
      <ol className={cols === 2 ? "toc-g toc-g2" : "toc-g"}>
        {items.map((t, i) => (
          <li key={t.id} style={{ "--i": i } as React.CSSProperties}>
            <a href={`#${t.id}`}>
              <span className="toc-n">{i + 1}</span>
              <span className="toc-l">{t.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
