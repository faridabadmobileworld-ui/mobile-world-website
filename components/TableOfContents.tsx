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
}: {
  items: readonly TocItem[];
  heading?: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav className="toc rv in" aria-label={heading}>
      <b className="toc-h">{heading}</b>
      <ol>
        {items.map((t, i) => (
          <li key={t.id}>
            <a href={`#${t.id}`}>
              <span className="toc-n">{i + 1}</span>
              {t.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
