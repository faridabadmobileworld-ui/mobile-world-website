# Mobile World motion system — 24 November 2026

## Reference and inspection

Owner-selected reference: https://demo2.awaikenthemes.com/mobikart/

Inspected the live desktop page (1363 CSS px), tablet layout (779 CSS px, three category columns) and mobile layout (454 CSS px, two category columns), rendered headings, category/promotional cards, hover treatment, and the reference's current HTML, theme CSS, Elementor CSS and animation JavaScript. Reference content and sales claims are not Mobile World data.

Primary source paths (retrieved 24 November 2026):

- `/wp-content/themes/mobikart/assets/js/function.js?ver=1.0.2`
- `/wp-content/themes/mobikart/style.css?ver=1.0.2`
- `/wp-content/themes/mobikart/assets/css/css-variable.css?ver=1.0.2`
- `/wp-content/uploads/elementor/css/post-9.css?ver=1795079258`
- `/wp-content/uploads/elementor/css/post-19.css?ver=1795079259`

## Observed tokens and behaviour

| Area | Reference evidence | Mobile World implementation |
| --- | --- | --- |
| Typography | Computed global `Helvetica Neue, sans-serif`; theme default is DM Sans. Desktop hero 60px/700, section headings 36px/500, body 16px/1.6. | Self-hosted variable DM Sans via Next font, with existing Noto Sans Devanagari. Existing responsive text sizes retained; lighter section-heading weight and refined tracking. No unlicensed Helvetica asset. |
| Palette | Black text, white and #F3F3F5 surfaces; #00796B–#223F87 gradient; soft hero gradient. | Preserve approved Mobile World burgundy/cream identity, use burgundy–navy interactive gradient and existing real imagery. |
| Text reveal | Active home style 3: SplitText chars, x50→0, opacity0→1, duration1s, Back.easeOut, stagger20ms, trigger top90%. | React-rendered text spans; 850ms reveal with20ms stagger capped at380ms. Hindi/other non-ASCII words remain whole so matras/ligatures never break. Long or interactive headings use whole-heading reveal. |
| Scroll entrance | Elementor fadeInUp across text and repeated groups, delay0–500ms. | One IntersectionObserver, 700ms fade/26px rise; group delay capped210ms; dense specification rows380ms/9px without delays. |
| Image reveal | Theme supports clip inset100%→0 over1.5s. Active home image widgets mostly select `at-animation-image-none`; not every image uses the supported reveal. | Extend a1.2s reveal to ordinary content images sitewide as requested. Priority hero/model images remain immediately visible; all eligible image surfaces get hover motion. |
| Image hover | Promotional shiny-glass sweep600ms; blog images scale1.06 over600ms. | 650ms diagonal sheen on shared image surfaces, image scale1.045 over600ms. Product packshots retain contain/aspect ratio and verified pixels. |
| Buttons/arrows | Pill40px, moving gradient500ms, pulse1→.95→1 over600ms; arrows turn to0deg. | Pill buttons, gradient500ms, pulse600ms, shared arrow icon rotation/translation. WhatsApp keeps its green identity. |
| Cursor | 10px gradient dot with pointer-events:none. | Mouse-only10px gradient dot, larger translucent link state; event-driven RAF, no idle render loop. Native pointer stays present. |
| Menu/carousel | Menu opacity/scale transition300ms; carousel/slider scripts loaded. | Existing accessible drawer and carousel retained with smoother transitions; shared pause stops auto-advancing. |
| Loader/distortion |600ms preloader fade; WebGL distortion code exists but **zero active distortion elements** in inspected home DOM. | No artificial blocking loader, no WebGL distortion. Do not distort exact-model photos or create a continuous GPU loop. |

## Layout and asset constraints

The reference has a1300px container, generous section gaps, rounded pale category tiles, a two-column hero and pill controls. Mobile World retains its approved home order, campaign artwork, garlands, sections, domain, routes, contact data and family history. Only garlands remain sticky. Existing category, brand, product, store and article images are reused; no reference-logo or demo-product assets were copied.

## Coverage and accessibility

The shared layout installs `SiteMotion` and `motion.css` on every public route.118 existing JSX h1/h2 headings use `MotionHeading`; HTML article-body headings are observed without rewriting their HTML. Shared cards, rows, paragraphs and images cover home, catalogue, brand/category filtering, full model pages, editorial posts, About, Team, Visit, Contact, finance/support and policy pages. Newly filtered/inserted content and carousel visibility changes are observed. Owner/admin content is not decorated by the observer/cursor.

No JS-dependent hidden CSS: server HTML is readable immediately, including without JavaScript. Native keyboard focus and anchor destinations finish relevant effects immediately. Existing controls, headings, links and forms retain their semantics. The visible Animation control and OS reduced-motion preference cancel active Web Animations; hover motion/cursor disable too. Touch devices have no custom cursor. Printing cancels active animations. Removed-route animations/observers and frames are disposed. Product price/specification values are not changed by this work.

## Acceptance scope (fixed denominator:6)

1. Reference motion/style evidence recorded.
2. Shared typography and motion implementation.
3. Public routes, dynamic cards and full model page integration.
4. Tests, typecheck, lint, production build and private/public checks.
5. Desktop, tablet/mobile, keyboard, pause/reduced-motion and navigation browser checks.
6. Exact-source deployment, custom domains, live behaviour and rollback evidence.

This is an adaptation of the observed effects to the existing site, not a WordPress theme transplant. No claims of pixel-identical reference layout, demo commerce features, fabricated countdowns/reviews or live dashboard sync.
