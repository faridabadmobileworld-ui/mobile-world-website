#!/usr/bin/env python3
"""Apply every audit fix to the Mobile World preview build.

Re-runnable: always starts from the pristine upload and writes fixed.html.
Every replacement asserts its expected hit count, so a silent miss fails loudly.
"""
import re, json, base64, io, datetime, sys
from PIL import Image

SRC = '/root/.claude/uploads/72da4430-114f-5042-add2-521cdc1cf2bc/72f62cf5-MOBILEWORLDPREVIEW2.html'
OUT = 'fixed.html'
NAME = "Aggarwal Kiryana And Communication"
PHONE_E164 = "919315212131"
PHONE_DISP = "+91 93152 12131"

h = open(SRC, encoding='utf8').read()
log = []


def sub(pat, rep, label, count=1, flags=0):
    global h
    new, n = re.subn(pat, rep, h, count=(0 if count == 'all' else count), flags=flags)
    if count != 'all':
        assert n == count, f"FAIL {label}: expected {count} got {n}"
    else:
        assert n > 0, f"FAIL {label}: no matches"
    h = new
    log.append(f"{label} ({n})")


def raw(old, new, label, count=1):
    global h
    n = h.count(old)
    assert n == count, f"FAIL {label}: expected {count} got {n}"
    h = h.replace(old, new)
    log.append(f"{label} ({n})")


# ═══════════════════════════════════════════════════════════════════
# 1. HEAD — meta, favicon, social preview, robots
# ═══════════════════════════════════════════════════════════════════
FAV = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
       "%3Crect width='64' height='64' rx='14' fill='%235B3FD9'/%3E"
       "%3Ctext x='32' y='44' font-family='Arial,sans-serif' font-size='27' font-weight='bold' "
       "fill='white' text-anchor='middle'%3EMW%3C/text%3E%3C/svg%3E")

sub(r'<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:card" content="summary_large_image">\n'
    '<meta property="og:url" content="https://www.mobileworldfaridabad.com/">\n'
    '<meta property="og:image" content="https://www.mobileworldfaridabad.com/og-image.jpg">\n'
    '<meta property="og:image:width" content="1200">\n'
    '<meta property="og:image:height" content="630">\n'
    '<meta property="og:image:alt" content="Inside Mobile World, Gurudwara Road, Jawahar Colony, NIT Faridabad">\n'
    '<meta name="twitter:image" content="https://www.mobileworldfaridabad.com/og-image.jpg">\n'
    '<meta name="robots" content="index,follow,max-image-preview:large">\n'
    f'<link rel="icon" href="{FAV}">',
    'head: og:image, og:url, twitter:image, robots, favicon')

# ═══════════════════════════════════════════════════════════════════
# 2. STRUCTURED DATA
# ═══════════════════════════════════════════════════════════════════
# 2a. LocalBusiness — correct legal name, add url/image/logo, monthly closures
m = re.search(r'(\{"@context":"https://schema\.org","@type":"ElectronicsStore".*?\})</script>', h, re.S)
lb = json.loads(m.group(1))
lb['legalName'] = NAME
lb['url'] = "https://www.mobileworldfaridabad.com/"
lb['image'] = "https://www.mobileworldfaridabad.com/og-image.jpg"
lb['logo'] = "https://www.mobileworldfaridabad.com/logo.png"
lb['currenciesAccepted'] = "INR"
lb['paymentAccepted'] = "Cash, UPI, Credit Card, Debit Card, EMI"
spec = []
base = datetime.date(2026, 8, 1)
for i in range(18):
    yy, mm = divmod((base.month - 1) + i, 12)
    yy += base.year
    mm += 1
    nxt = datetime.date(yy + (mm == 12), 1 if mm == 12 else mm + 1, 1)
    last = nxt - datetime.timedelta(days=1)
    spec.append({"@type": "OpeningHoursSpecification", "opens": "00:00", "closes": "00:00",
                 "validFrom": last.isoformat(), "validThrough": last.isoformat()})
lb['specialOpeningHoursSpecification'] = spec
h = h[:m.start(1)] + json.dumps(lb, ensure_ascii=False, separators=(',', ':')) + h[m.end(1):]
log.append(f"schema: LocalBusiness legalName + url/image/logo + {len(spec)} closure dates")

# 2b. Review -> BlogPosting (Review needs reviewRating; this is editorial, not a rating)
m = re.search(r'<script type="application/ld\+json">(\{"@context": "https://schema\.org", "@type": "Review".*?)</script>', h, re.S)
old = json.loads(m.group(1))
bp = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    "headline": old["headline"],
    "datePublished": old["datePublished"], "dateModified": old["datePublished"],
    "inLanguage": "hi-IN",
    "author": {"@type": "Organization", "name": "Mobile World", "url": "https://www.mobileworldfaridabad.com/"},
    "publisher": {"@type": "Organization", "name": "Mobile World",
                  "logo": {"@type": "ImageObject", "url": "https://www.mobileworldfaridabad.com/logo.png"}},
    "mainEntityOfPage": {"@type": "WebPage", "@id": "https://www.mobileworldfaridabad.com/"},
    "about": {"@type": "Product", "name": "Redmi Note 17 5G", "brand": {"@type": "Brand", "name": "Xiaomi"}},
}
h = h[:m.start(1)] + json.dumps(bp, ensure_ascii=False, separators=(',', ':')) + h[m.end(1):]
log.append("schema: Review -> BlogPosting (dropped invalid reviewRating-less Review, dead image URL, fragment url)")

# 2c. FAQPage -> exactly the six questions visible on the page
faq = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": []}
QA = [
    ("Redmi Note 17 5G की battery सच में 3 दिन चलती है?",
     "Xiaomi का दावा सामान्य इस्तेमाल के लिए है — calls, WhatsApp, थोड़ा YouTube. अगर आप लगातार gaming या video recording करते हैं तो डेढ़ से दो दिन मानकर चलिए। फिर भी 8000mAh इस segment में सबसे बड़ी battery है, इसलिए किसी भी 5000mAh फ़ोन से काफ़ी ज़्यादा चलेगी।"),
    ("क्या इसमें charger डिब्बे में मिलता है?",
     "जी हाँ। 45W का charger box में ही आता है, अलग से नहीं ख़रीदना पड़ता।"),
    ("Gaming के लिए ठीक रहेगा?",
     "Casual gaming के लिए बिल्कुल ठीक है। पर BGMI या Free Fire high settings पर लंबे session खेलने हैं तो इसी बजट में Snapdragon 6 या 7 series वाले फ़ोन बेहतर रहेंगे। Store पर आइए, दोनों दिखा देंगे — फ़ैसला आपका।"),
    ("4K video बन सकती है?",
     "नहीं। आगे और पीछे — दोनों cameras 1080p 30fps तक ही record करते हैं। ये इस फ़ोन का सबसे बड़ा compromise है।"),
    ("Faridabad में सबसे अच्छी mobile shop कौन सी है?",
     "\"सबसे अच्छी\" हर किसी के लिए अलग होती है — किसी को सबसे सस्ता चाहिए, किसी को भरोसा। हम अपने बारे में सिर्फ़ वो बताते हैं जो आप ख़ुद जाँच सकते हैं: Mobile World जवाहर कॉलोनी, NIT फ़रीदाबाद में है, परिवार का काम 1973 से चल रहा है, Google पर हमारी rating और reviews आप ख़ुद पढ़ सकते हैं, हर सामान GST bill और पूरी warranty के साथ जाता है, और दिक्कत आने पर आप उसी counter पर आ सकते हैं जहाँ से लिया था। बाक़ी फ़ैसला आपका।"),
    ("Store पर आने से पहले क्या करूँ?",
     "जो model चाहिए उसका नाम WhatsApp पर भेज दीजिए। हम stock और आज का rate पहले ही बता देंगे — एक ही चक्कर में काम हो जाएगा।"),
]
for q, a in QA:
    faq["mainEntity"].append({"@type": "Question", "name": q,
                              "acceptedAnswer": {"@type": "Answer", "text": a}})
m = re.search(r'<script type="application/ld\+json">(\{"@context": "https://schema\.org", "@type": "FAQPage".*?)</script>', h, re.S)
h = h[:m.start(1)] + json.dumps(faq, ensure_ascii=False, separators=(',', ':')) + h[m.end(1):]
log.append("schema: FAQPage now matches the 6 visible questions verbatim")

# ═══════════════════════════════════════════════════════════════════
# 3. FONT — self-host inline, removes render-blocking third-party request
# ═══════════════════════════════════════════════════════════════════
woff = base64.b64encode(open('inter-latin.woff2', 'rb').read()).decode()
sub(r'<link rel="preconnect" href="https://fonts\.googleapis\.com">\n'
    r'<link rel="preconnect" href="https://fonts\.gstatic\.com" crossorigin>\n'
    r'<link href="https://fonts\.googleapis\.com/css2\?family=Inter[^"]*" rel="stylesheet">',
    '<style>@font-face{font-family:\'Inter\';font-style:normal;font-weight:100 900;'
    'font-display:swap;src:url(data:font/woff2;base64,' + woff + ') format(\'woff2\');'
    'unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,'
    'U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}</style>',
    'font: Inter self-hosted inline (no third-party request, no render block)')

# ═══════════════════════════════════════════════════════════════════
# 4. BUSINESS FACTS
# ═══════════════════════════════════════════════════════════════════
# Every spelling of the registered name collapses to the one the owner confirmed.
# Variants seen in the source: "Kiryana &amp;", "&amp; Kiryana", "Kriyana &amp;", bare "&".
name_pat = r'Aggarwal (?:&amp; |&amp;)?K(?:iry|riy)ana (?:&amp; |& )?Communication'
found = re.findall(name_pat, h)
assert len(found) >= 6, f"FAIL name variants: only found {len(found)}"
h = re.sub(name_pat, NAME, h)
log.append(f"name: all {len(found)} spellings -> '{NAME}'")
assert 'Kriyana' not in h and 'Kiryana &' not in h and '&amp; Kiryana' not in h

# alt text: superlative / keyword stuffing removed (owner instruction)
raw('alt="Redmi Note 17 5G review — Mobile World, best mobile shop in Faridabad"',
    'alt="Redmi Note 17 5G at the Mobile World counter, Jawahar Colony"',
    'alt: "best mobile shop in Faridabad" removed')

# Hindi typo
raw('gaming चipset', 'gaming chipset', 'typo: चipset -> chipset')

# ═══════════════════════════════════════════════════════════════════
# 5. WHATSAPP LINKS — undo double-encoded HTML entities
# ═══════════════════════════════════════════════════════════════════
n_wa = 0
def fix_wa(mm):
    global n_wa
    u = mm.group(0)
    new = u.replace('%26amp%3B', '%26').replace('%26Prime%3B', '%E2%80%B3')
    if new != u:
        n_wa += 1
    return new
h = re.sub(r'https://wa\.me/[^"]*', fix_wa, h)
assert n_wa == 9, f"FAIL whatsapp encoding: expected 9 got {n_wa}"
log.append(f"whatsapp: double-encoded entities fixed ({n_wa} links)")

# ═══════════════════════════════════════════════════════════════════
# 6. CSS
# ═══════════════════════════════════════════════════════════════════
# 6a. contrast: --ink-3 was 3.20:1 on white
raw('--ink-3:#8E8EA6;', '--ink-3:#6E6E86;', 'css: --ink-3 contrast 3.20 -> 5.06')

# 6b. sticky category strip used a hardcoded 58px; header measures 71px on phones.
# --hdr is declared in :root but was never used; JS now measures the real height into it.
raw('--hdr:0px;', '--hdr:59px;', 'css: --hdr given a real default')
raw('.cstrip{background:var(--card);border-bottom:1px solid var(--line);position:sticky;top:58px;z-index:55}',
    '.cstrip{background:var(--card);border-bottom:1px solid var(--line);position:sticky;top:var(--hdr);z-index:55}',
    'css: cstrip sticks to the measured header height')
# keep the wordmark on one line so the header cannot grow past 59px
raw('.logo s{display:block;',
    '.logo span{white-space:nowrap}\n.logo s{display:block;',
    'css: wordmark no longer wraps to two lines')

# 6c. search box was desktop-only (>=960px); the audience is on phones
raw('@media(min-width:960px){ .searchbox{display:block} }',
    '@media(min-width:560px){ .searchbox{display:block} }\n'
    '@media(max-width:559px){ .drawer .searchbox{display:block;max-width:none;margin:4px 0 2px} }',
    'css: search shown from 560px, and inside the drawer below that')

# 6d. tap targets >= 44px (WCAG 2.5.8 / Google minimum)
raw('.iconbtn{width:38px;height:38px;', '.iconbtn{width:44px;height:44px;', 'css: icon buttons 38 -> 44px')
raw('.btn-s{height:34px;padding:0 13px;font-size:12.5px}',
    '.btn-s{height:44px;padding:0 14px;font-size:12.5px}', 'css: small buttons 34 -> 44px')
raw('.cstrip a{white-space:nowrap;padding:8px 12px;',
    '.cstrip a{white-space:nowrap;padding:13px 12px;min-height:44px;display:inline-flex;align-items:center;',
    'css: category strip links 35 -> 44px tall')
raw('.ftr address{font-style:normal;font-size:13px;color:var(--ink-2);line-height:1.75}',
    '.ftr address{font-style:normal;font-size:13px;color:var(--ink-2);line-height:1.75}\n'
    '.ftr address a{display:inline-flex;align-items:center;min-height:44px}',
    'css: footer phone link 19 -> 44px tall')

# 6f. those headings become h3 in section 7 — keep the styling attached to them
raw('.drawer h4{', '.drawer .dh{', 'css: drawer heading selector follows h4 -> h3')
raw('.ftr h4{', '.ftr .fh{', 'css: footer heading selector follows h4 -> h3')

# 6e. smallest labels failed contrast at 9.5px
raw('.pc-k{font-size:9.5px', '.pc-k{font-size:11px', 'css: product card label 9.5 -> 11px')
raw('.lrow em{display:block;font-style:normal;font-size:11.5px;color:var(--hot);',
    '.lrow em{display:block;font-style:normal;font-size:12px;color:var(--hot-ink);',
    'css: rail sub-label contrast 3.66 -> 4.6')
raw('--hot:#E8542F; --hot-soft:#FDEDE7;',
    '--hot:#E8542F; --hot-ink:#C3３E1D; --hot-soft:#FDEDE7;'.replace('３', '3'),
    'css: --hot-ink added for small orange text')

log.append('--- css done ---')

# ═══════════════════════════════════════════════════════════════════
# 7. MARKUP
# ═══════════════════════════════════════════════════════════════════
ICON_GRID = ('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
             'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'
             '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>'
             '<rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>')
ICON_POST = ('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
             'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'
             '<path d="M4 5h11a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2z"/><path d="M17 9h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>'
             '<path d="M7 9h6M7 12h6M7 15h4"/></svg>')

# 7a. drawer: the "Shop by category" heading had zero links under it
CATS = [("Smartphones", "#topsell"), ("Laptops", "#topsell"), ("Televisions", "#topsell"),
        ("Air Conditioners", "#topsell"), ("Washing Machines", "#topsell"), ("Refrigerators", "#topsell"),
        ("Inverters &amp; Batteries", "#topsell"), ("Audio &amp; Wearables", "#audio"),
        ("Kitchen Appliances", "#appliances"), ("Accessories", "#audio")]
cat_html = "\n".join(f'    <a class="d" href="{href}"><i>{ICON_GRID}</i>{label}</a>' for label, href in CATS)
raw('<h4>Shop by category</h4>\n<h4>Store</h4>',
    f'<h3 class="dh">Shop by category</h3>\n{cat_html}\n    <h3 class="dh">Store</h3>',
    'drawer: 10 category links added to the empty section')

# 7b. drawer + footer: h4 skipped a level from h2
sub(r'<div><h4>(Company|Shop|Help|Store info)</h4>', r'<div><h3 class="fh">\1</h3>', 'footer: h4 -> h3', count=4)

# 7c. drawer: "Latest posts" reused the same icon as "Our story"
raw(f'<a class="d" href="#posts"><i>{ICON_GRID}</i>Latest posts</a>',
    f'<a class="d" href="#posts"><i>{ICON_POST}</i>Latest posts</a>',
    'drawer: distinct icon for Latest posts')

# 7d. carousel: aria-live on an auto-rotating region spams screen readers every 6s;
#     role="tablist" had no role="tab" children. Basic carousel pattern instead.
raw('<div class="hs-t" id="hsT" aria-live="polite">', '<div class="hs-t" id="hsT">',
    'carousel: aria-live removed from rotating region')
raw('<div class="hs-ui" id="hsD" role="tablist" aria-label="Hero slides"></div>',
    '<div class="hs-ui" id="hsD" role="group" aria-label="Choose a slide"></div>',
    'carousel: tablist -> group (dots get aria-current in JS)')
raw('<div class="hs-ar">\n        <button id="hsP" aria-label="Previous slide">',
    '<div class="hs-ar">\n        <button id="hsPause" aria-label="Pause slideshow" aria-pressed="false">'
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">'
    '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg></button>\n'
    '        <button id="hsP" aria-label="Previous slide">',
    'carousel: pause/play control added (WCAG 2.2.2)')

# 7e. article titles were h2, and #top (holding the only h1) is hidden while reading
sub(r'<h2 class="rtitle">', '<h1 class="rtitle">', 'article: rtitle h2 -> h1', count=4)
sub(r'(<h1 class="rtitle">(?:(?!</h2>).)*?)</h2>', r'\1</h1>', 'article: rtitle closing tags', count=4, flags=re.S)

# 7f. the long Hindi review sat inside lang="en"
raw('<article class="reader" id="art-redmi-note-17" hidden="hidden">',
    '<article class="reader" id="art-redmi-note-17" lang="hi" hidden="hidden">',
    'a11y: Hindi article marked lang="hi"')

# 7g. "Open now" was hardcoded, so a no-JS visitor saw it at 2am
sub(r'<span class="live" data-live><i></i><span>(?:Open now · until 10 PM|Open now)</span></span>',
    '<span class="live" data-live><i></i><span>Daily 10 AM – 10 PM</span></span>',
    'live badge: neutral text before JS runs', count=2)

# ═══════════════════════════════════════════════════════════════════
# 8. IMAGES
# ═══════════════════════════════════════════════════════════════════
# 8a. Remove Xiaomi's official launch slides (owner instruction — not licensed to us).
#     The 13 <figure class="afig"> blocks go entirely; the prose already carries every fact.
afigs = re.findall(r'<figure class="afig">.*?</figure>', h, re.S)
assert len(afigs) == 13, f"FAIL afig count: {len(afigs)}"
h = re.sub(r'<figure class="afig">.*?</figure>\n?', '', h, flags=re.S)
log.append(f"images: {len(afigs)} Xiaomi launch slides removed from the Note 17 post")

# 8b. The article hero and its home-page thumbnail were Xiaomi slides too.
#     Replace with the page's own coded illustration — its stated fallback for
#     anything without a real photograph.
SVG_PHONE = '<svg class="art" viewBox="0 0 400 400" aria-hidden="true"><use href="#a-phone"/></svg>'
for label, pat in [
    ("article hero", r'<div class="rmedia"><img class="ph-img" src="data:image/jpeg;base64,[A-Za-z0-9+/=]+" alt="Redmi Note 17 5G at the Mobile World counter, Jawahar Colony"[^>]*/></div>'),
    ("home thumbnail", r'<div class="m" style="aspect-ratio:21/9"><img class="ph-img" src="data:image/jpeg;base64,[A-Za-z0-9+/=]+" alt="Redmi Note 17 5G review at Mobile World, Faridabad"[^>]*/></div>'),
]:
    cls = 'rmedia' if 'hero' in label else 'm" style="aspect-ratio:21/9'
    n = len(re.findall(pat, h))
    assert n == 1, f"FAIL {label}: got {n}"
    h = re.sub(pat, f'<div class="{cls}">{SVG_PHONE}</div>', h)
    log.append(f"images: {label} now uses the coded illustration")

raw('Product images Xiaomi की official launch slides से हैं। ', '',
    'copy: removed the credit line for the deleted Xiaomi slides')
assert 'official launch slides' not in h

# 8c. Re-encode what remains as WebP.
#     The source JPEGs are already compressed hard — re-encoding them as JPEG
#     makes them BIGGER. WebP at the size each image is actually displayed is
#     the real win, and it is what next/image will serve in the Next.js build.
CTX_MAX = {'hs-m': 1000, 'pc-m': 580, 'lrow': 200, 'shot': 900, 'post': 800,
           'qr': 280, 'rmedia': 1000, 'default': 700}
CTX_KEYS = [('class="hs-m"', 'hs-m'), ('class="pc-m"', 'pc-m'), ('class="rmedia"', 'rmedia'),
            ('class="shot rv"', 'shot'), ('qr-card', 'qr'),
            ('aspect-ratio:21/9', 'post'), ('<div class="m"', 'post'), ('<span class="m">', 'lrow')]


def context_of(before: str) -> str:
    tail = before[-300:]
    best, pos = 'default', -1
    for key, name in CTX_KEYS:
        p = tail.rfind(key)
        if p > pos:
            pos, best = p, name
    return best


stats = []


def reencode(mm):
    tag = mm.group(0)
    b64 = re.search(r'base64,([A-Za-z0-9+/=]+)', tag).group(1)
    rawb = base64.b64decode(b64)
    im = Image.open(io.BytesIO(rawb)).convert('RGB')
    ctx = context_of(h[:mm.start()])
    cap = CTX_MAX[ctx]
    if im.width > cap:
        im = im.resize((cap, round(im.height * cap / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=80, method=6)
    out, mime = buf.getvalue(), 'image/webp'
    if len(out) >= len(rawb):                      # never grow an image
        out, mime = rawb, 'image/jpeg'
        im = Image.open(io.BytesIO(rawb))
    stats.append((ctx, len(rawb), len(out)))
    tag = re.sub(r'src="data:image/[a-z]+;base64,[A-Za-z0-9+/=]+"',
                 'src="data:%s;base64,%s"' % (mime, base64.b64encode(out).decode()), tag)
    tag = re.sub(r'\s(?:width|height)="\d+"', '', tag)
    tag = tag.replace('<img ', f'<img width="{im.width}" height="{im.height}" ', 1)
    # lazy-loading a data: URI does nothing — the bytes are already in the document
    tag = tag.replace(' loading="lazy"', '')
    return tag


h = re.sub(r'<img[^>]*data:image/jpeg;base64,[A-Za-z0-9+/=]+[^>]*>', reencode, h)
_b = sum(s[1] for s in stats); _a = sum(s[2] for s in stats)
log.append(f"images: {len(stats)} re-encoded to WebP at display size, "
           f"{_b/1048576:.2f} MB -> {_a/1048576:.2f} MB ({100-100*_a/_b:.0f}% smaller); "
           f"width/height added, dead lazy-loading removed")
from collections import Counter
log.append("images: contexts -> " + ", ".join(f"{k}x{v}" for k, v in Counter(s[0] for s in stats).items()))

# ═══════════════════════════════════════════════════════════════════
# 9. JAVASCRIPT
# ═══════════════════════════════════════════════════════════════════
# 9a. next-closure date: the old condition could never be true, so it always
#     showed the current month. Also pin the clock to Asia/Kolkata so the badge
#     does not follow a visitor's device timezone.
OLD_JS = """(function(){var OP=10,CL=22,M=['January','February','March','April','May','June','July','August','September','October','November','December'];
 var now=new Date(),last=new Date(now.getFullYear(),now.getMonth()+1,0);
 var cd=now.getDate()===last.getDate(),h=now.getHours()+now.getMinutes()/60;
 var open=!cd&&h>=OP&&h<CL;
 var nc=(now.getDate()>=last.getDate()&&!cd)?new Date(now.getFullYear(),now.getMonth()+2,0):last;"""
NEW_JS = """(function(){var OP=10,CL=22,M=['January','February','March','April','May','June','July','August','September','October','November','December'];
 /* Store time is Asia/Kolkata, not whatever the visitor's device is set to. */
 var now;
 try{
   var p={};new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',year:'numeric',month:'numeric',
     day:'numeric',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date())
     .forEach(function(x){p[x.type]=x.value});
   now=new Date(+p.year,+p.month-1,+p.day,+p.hour%24,+p.minute);
 }catch(e){ now=new Date(); }
 var last=new Date(now.getFullYear(),now.getMonth()+1,0);
 var cd=now.getDate()===last.getDate(),h=now.getHours()+now.getMinutes()/60;
 var open=!cd&&h>=OP&&h<CL;
 /* Shut on the last calendar date of every month — 28th, 29th, 30th or 31st.
    If that is today, the next closure is next month's last date. */
 var nc=cd?new Date(now.getFullYear(),now.getMonth()+2,0):last;"""
raw(OLD_JS, NEW_JS, 'js: next-closure logic fixed + clock pinned to Asia/Kolkata')

# 9b. carousel — aria-current on dots, and a working pause control
raw(" var h='';for(var k=0;k<s.length;k++)h+='<button type=\"button\" aria-label=\"Slide '+(k+1)+'\"></button>';",
    " var h='';for(var k=0;k<s.length;k++)h+='<button type=\"button\" aria-label=\"Show slide '+(k+1)+' of '+s.length+'\"></button>';",
    'js: dot labels name the total')
raw("  for(var k=0;k<s.length;k++){s[k].classList.toggle('on',k===i);de[k].classList.toggle('on',k===i);}\n  restart();}",
    "  for(var k=0;k<s.length;k++){s[k].classList.toggle('on',k===i);de[k].classList.toggle('on',k===i);\n"
    "   de[k].setAttribute('aria-current',k===i?'true':'false');\n"
    "   s[k].setAttribute('aria-hidden',k===i?'false':'true');}\n  restart();}",
    'js: dots expose aria-current, offscreen slides aria-hidden')
raw(" function restart(){stop();if(!R)tm=setInterval(function(){go(i+1)},6000)}",
    " var paused=false;\n"
    " function restart(){stop();if(!R&&!paused)tm=setInterval(function(){go(i+1)},6000)}",
    'js: pause state respected by restart')
raw(" var hero=document.querySelector('.hs');",
    " var pb=document.getElementById('hsPause');\n"
    " var ICO_PAUSE='<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">"
    "<rect x=\"6\" y=\"5\" width=\"4\" height=\"14\" rx=\"1\"/><rect x=\"14\" y=\"5\" width=\"4\" height=\"14\" rx=\"1\"/></svg>';\n"
    " var ICO_PLAY='<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">"
    "<path d=\"M8 5l11 7-11 7z\"/></svg>';\n"
    " if(R){pb.hidden=true}\n"
    " pb.addEventListener('click',function(){\n"
    "   paused=!paused;\n"
    "   pb.setAttribute('aria-pressed',String(paused));\n"
    "   pb.setAttribute('aria-label',paused?'Play slideshow':'Pause slideshow');\n"
    "   pb.innerHTML=paused?ICO_PLAY:ICO_PAUSE;\n"
    "   paused?stop():restart();\n"
    " });\n"
    " var hero=document.querySelector('.hs');",
    'js: pause/play button wired up')

# 9c. measure the real header height into --hdr so the category strip cannot overlap it
raw("document.getElementById('yr').textContent=new Date().getFullYear();",
    "/* The category strip sticks below the header. Measure the header instead of\n"
    "   assuming 58px — it is taller on small screens. */\n"
    "(function(){var hdr=document.querySelector('.hdr');if(!hdr)return;\n"
    " function sync(){document.documentElement.style.setProperty('--hdr',Math.round(hdr.getBoundingClientRect().height)+'px')}\n"
    " sync();addEventListener('resize',sync,{passive:true});\n"
    " if(window.ResizeObserver)new ResizeObserver(sync).observe(hdr);\n"
    " if(document.fonts&&document.fonts.ready)document.fonts.ready.then(sync);})();\n\n"
    "/* Below 560px the search box moves into the drawer so phones can reach it.\n"
    "   The element itself moves — one input, one id, existing search code untouched. */\n"
    "(function(){var sb=document.querySelector('.searchbox'),\n"
    "     panel=document.querySelector('.drawer .panel'),\n"
    "     hdrA=document.querySelector('.hdr .wrap'),\n"
    "     anchor=document.querySelector('.drawer .panel .dh');\n"
    " if(!sb||!panel||!anchor)return;\n"
    " var mq=matchMedia('(max-width:559px)'),home=sb.nextSibling,parent=sb.parentNode;\n"
    " function place(){\n"
    "   if(mq.matches){ if(sb.parentNode!==panel) panel.insertBefore(sb,anchor); }\n"
    "   else { if(sb.parentNode!==parent) parent.insertBefore(sb,home); }\n"
    " }\n"
    " place();mq.addEventListener('change',place);})();\n\n"
    "document.getElementById('yr').textContent=new Date().getFullYear();",
    'js: --hdr measured; search box relocates into the drawer on phones')

# ═══════════════════════════════════════════════════════════════════


# ═══════════════════════════════════════════════════════════════════
# 10. OWNER-SUPPLIED BRAND ASSETS (received 24 Aug 2026)
# ═══════════════════════════════════════════════════════════════════
# 10a. Real geo coordinates — the last thing LocalBusiness was missing.
GEO_LAT, GEO_LON = 28.36249, 77.28786
m = re.search(r'(\{"@context":"https://schema\.org","@type":"ElectronicsStore".*?\})</script>', h, re.S)
lb = json.loads(m.group(1))
assert 'geo' not in lb
lb['geo'] = {"@type": "GeoCoordinates", "latitude": GEO_LAT, "longitude": GEO_LON}
h = h[:m.start(1)] + json.dumps(lb, ensure_ascii=False, separators=(',', ':')) + h[m.end(1):]
log.append(f"schema: geo coordinates added ({GEO_LAT}, {GEO_LON})")

# 10b. Favicon + touch icon — the owner's own MW mark, replacing the stand-in
def _icon(path):
    _b = io.BytesIO()
    Image.open(path).convert('RGB').save(_b, 'PNG', optimize=True)
    return base64.b64encode(_b.getvalue()).decode()

h = re.sub(r'<link rel="icon" href="data:image/svg\+xml,[^"]*">',
           '<link rel="icon" type="image/png" sizes="64x64" href="data:image/png;base64,'
           + _icon('brand/favicon-64.png') + '">\n'
           '<link rel="apple-touch-icon" href="data:image/png;base64,'
           + _icon('brand/apple-touch-icon.png') + '">', h, count=1)
log.append("favicon + apple-touch-icon: owner's MW mark (was a stand-in)")

# 10c. The shop's own exterior photograph joins the store gallery.
shop_img = Image.open('/root/.claude/uploads/72da4430-114f-5042-add2-521cdc1cf2bc/ed2d75f7-image.webp').convert('RGB')
_b = io.BytesIO(); shop_img.save(_b, 'WEBP', quality=82, method=6)
ext_b64 = base64.b64encode(_b.getvalue()).decode()
FIG = ('\n      <figure class="shot rv" style="margin:0">\n'
       f'        <img class="ph-img" width="{shop_img.width}" height="{shop_img.height}" '
       f'src="data:image/webp;base64,{ext_b64}" '
       'alt="Mobile World storefront on Gurudwara Road, Jawahar Colony, lit up at night" decoding="async" />\n'
       '        <figcaption><span class="t">The shop</span><span class="d">Gurudwara Road, Jawahar Colony — '
       'open until 10 at night.</span></figcaption>\n'
       '      </figure>')
raw('<div class="shots">', '<div class="shots">' + FIG,
    'photo: shop exterior added to the gallery')
assert h.count('alt="Mobile World storefront on Gurudwara Road') == 1

# The caption title and text are both inline spans, so they run together
# ("THE COUNTERStaff and customers..."). The margin-top on .d was never
# doing anything either. Pre-existing — visible on every store photo.
raw('.shot .t{font-size:11px;', '.shot .t{display:block;font-size:11px;',
    'css: caption title on its own line')
raw('.shot .d{font-size:11.5px;', '.shot .d{display:block;font-size:11.5px;',
    'css: caption text on its own line')

# the gallery was a fixed 3-column grid; it now holds four
raw('@media(min-width:700px){ .shots{grid-template-columns:1.4fr 1fr 1fr} }',
    '@media(min-width:700px){ .shots{grid-template-columns:repeat(2,1fr)} }\n'
    '@media(min-width:1040px){ .shots{grid-template-columns:repeat(4,1fr)} }',
    'css: store gallery reflows for four photographs')

# ═══════════════════════════════════════════════════════════════════
open(OUT, 'w', encoding='utf8').write(h)
print('\n'.join('  ok  ' + x for x in log))
print(f"\nwrote {OUT}  ({len(h)/1048576:.2f} MB)")
