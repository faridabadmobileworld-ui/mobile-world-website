# Mobile World shopping preview

Owner priority: 4–5 November 2026, ahead of the paused catalogue research. Existing repository, Vercel project and custom domain are retained. No new service, paid plan, credentials or database schema was introduced.

## Presentation scope

- `/shop`: responsive storefront, official product images, editorial collections, brand and budget navigation, recently viewed models.
- `/shop/products`: 20 previously audited exact India models, text search, brand/budget filters, price/name sorting and progressive results.
- `/shop/product/[id]`: exact model, memory and colour selection, variant-dependent **sample** price, quantity, favourites, cart and buy-now, verified high-level specifications and explicit photograph caption.
- `/shop/cart`: identity includes model, memory and colour; quantity 1–5; remove, save for later, subtotal, coupon and checkout.
- `/shop/checkout`: demo profile, pickup/delivery selection, saved/new address, exact order lines, optional note, DEMO10 sample discount, review and demo-only order creation.
- `/shop/account`: profile overview and separate cart/favourites/addresses/order history for up to six local demo profiles.
- `/shop/account/orders` and individual order route: status, exact items, fulfilment, totals, cancellation, reorder and printable **demo summary** (not a tax invoice).
- `/shop/account/addresses`: add/edit/remove/default addresses, sample-data helper, required-field/mobile/PIN validation.
- `/shop/account/profile`: edit demo details, sign out and delete the selected local demo profile.
- `/shop/favourites`, `/shop/help`: saved products, useful empty states and clear operational boundaries.
- Existing home and navigation link to the preview. The original festive site remains available with its approved content and private owner flows.

## What this does not claim

All prices, coupon savings and delivery fees are conspicuously sample amounts. They are independent of CMS private price fields. No live stock or SKU availability is asserted. All manufacturer model options are illustrative shopping choices; order acceptance still requires real inventory later. Original product image captions identify the pictured colour rather than implying the picture changes with every selection.

Profiles are a local presentation feature, not authentication: no passwords, OTP, backend user identity, row-level security or cross-device sync. Anyone using that browser can open its demo profiles. The interface asks for sample details and offers a reserved example.test email and sample address. Data uses versioned localStorage, survives refresh, handles corrupt/blocked storage, and is bounded. Do not store sensitive real customer data here.

Checkout never calls a merchant/order/payment API, sends customer messages, charges money or triggers delivery. IDs begin MW-DEMO. The order confirmation, history, print view and FAQ disclose the demo. No fake reviews, sales counts, offers, MRP savings, delivery dates, payment badges or shipping tracking are presented. UPI/cards are explicitly inactive. Existing spin/reward, CMS, inventory and analytics stores are untouched.

`SiteChrome` omits the website analytics collector for `/shop` so addresses, profile details, test orders and demo clicks do not pollute real business reports. Preview routes are noindex/nofollow, absent from sitemap and carry no invented Offer/Product schema.

## Acceptance checklist (fixed denominator: 8)

1. Storefront, exact-product detail, discovery and responsive navigation implemented.
2. Cart identity, quantity bounds, integer-paise totals, coupon and invalid-data handling checked.
3. Demo profiles, isolated customer data, addresses and local persistence implemented.
4. Checkout, order snapshots/history, cancellation and reorder implemented.
5. Typecheck, lint, regression tests and production build pass.
6. Browser end-to-end checkout/profile isolation and mobile/tablet/desktop visual checks pass.
7. Preview and production source/domain/live routes verified.
8. Source, scope, release evidence and paused-work handover persisted in GitHub.

Items 1–4 are implemented; tests and release verification are recorded in STATUS as completed, not assumed from this specification.

## Data and future integration

`data/commerce.ts` projects only selected, already-audited model data into client props. Presentation-only amounts are explicitly declared separately in integer paise. `lib/commerce/core.ts` validates exact choices and snapshots demo orders. `ShopProvider` owns local persistence and per-profile updates. No secret/server-only catalogue editing function enters the client bundle.

Before accepting real orders, separately connect authenticated cloud customer accounts with server-side authorization, owner-approved public prices and valid stock/SKU combinations, server-calculated totals and order persistence, a payment provider/webhook lifecycle, delivery serviceability and agreed returns/invoice processes. Replace the demo layer deliberately; do not rename it to “live” without those integrations and acceptance tests.

## Paused catalogue work

Samsung A release is live at source `f69d892d7666e2eba9176e059b4547e5d5715857`, tree `9fb91e2abc46c790adc86e9f135113baa7cf3236`, production `dpl_7i4BbTg45dp5zGEvbFa77W4MrxXB`. Both custom aliases were verified. This is the rollback before shopping.

Unfinished OPPO research is isolated in local branch `codex/catalogue-oppo-wip-20261104`, commit `9dd3eab`, containing Reno16/Reno16c reference drafts, India-model draft and original images. It is not part of this shopping release. Vivo official-source research remains in scratch source extracts; no Vivo catalogue changes were published. Resume with the current India-lineup audit and actual variant/colour evidence; do not silently count these drafts as completed models.
