# Xiaomi / Redmi full-page correction — 24 November 2026

## Owner scope and acceptance

Fix existing model pages first, beginning with Xiaomi/Redmi. Published model images, names and Specifications actions open an ordinary full scrolling route. Display images, model colours, real memory options, clearly labelled official India price references and one independent specification per row. Image zoom and comparison dialogs are separate interactions. No new model is added in this release.

Fixed denominator for this correction: (1) reproduce/source audit; (2) implementation and eight Xiaomi/Redmi records; (3) regression tests, typecheck, lint and production build; (4) responsive browser/navigation QA; (5) verified production source, domains and handover. Completion is recorded in STATUS only after evidence. Overall catalogue and external CMS connection completion are separate.

## Navigation and data boundaries

- All 23 already published editorial guides gain direct image/title links. Existing `/products?model=...` links redirect to the corresponding published detail route. Unpublished catalogue placeholders are not promoted to verified guides.
- Preserve 86 core keys and 11 sections. Optional allowlisted attributes separate camera resolution, aperture, focal length, sensor details, video rates, processor process, charging technology, charger power and connectivity details. The same normalization, public projection and editor save/reload contract applies to these attributes.
- Unknown values stay empty. Confirmed No and zero remain meaningful. Internal `spec_007`, sources and unknown extra keys do not enter public product data. Public prices live in a separate explicit reference list; no merchant Offer schema is inferred.
- Colour preference does not create a RAM/storage/colour SKU or stock assertion. A model reference image stays labelled when it is not a verified selected-colour image. Enquiry links include the selected memory and colour preference but do not send messages.
- Redmi Note 17 Pro's storage-specific UFS version changes between 128GB (2.2) and 256GB (3.1). Xiaomi 17 uses a floating telephoto label rather than a generic periscope label.

## Official sources checked

Region: India. Checked 24 November 2026 (Asia/Kolkata). Existing full-record verification dates remain intact; this audit records the row restructuring and current public price references. Historical verification is not presented as a fresh check of every field.

| Existing guide | India specification source |
| --- | --- |
| Xiaomi 17T | https://www.mi.com/in/product/xiaomi-17t/specs/ |
| Xiaomi 17 | https://www.mi.com/in/product/xiaomi-17/specs/ |
| Xiaomi 17 Ultra | https://www.mi.com/in/product/xiaomi-17-ultra/specs/ |
| REDMI Note 17 5G | https://www.mi.com/in/product/redmi-note-17-5g/specs/ |
| REDMI Note 17 Pro 5G | https://www.mi.com/in/product/redmi-note-17-pro-5g/specs/ |
| REDMI Note 17 Pro Max 5G | https://www.mi.com/in/product/redmi-note-17-pro-max-5g/specs/ |
| REDMI 17 5G | https://www.mi.com/in/product/redmi-17-5g/specs/ |
| REDMI 17C 5G | https://www.mi.com/in/product/redmi-17c-5g/specs/ |

Official price list: https://store.mi.com/in/products/448-0-10-0-0-0-1 . Xiaomi 17's dynamically rendered buy page was additionally retrieved live through Firecrawl with maxAge 0: https://www.mi.com/in/product/xiaomi-17/buy/ . Its current selected listing is Venture Green 12GB/256GB at ₹89,999, with Notify Me; this is not an in-stock claim. Both 12GB/256GB and 12GB/512GB selectors appear there. The specifications page lists only 512GB, so the extra 256GB memory option is supported by the dated buy-page evidence, not an assumed global variant. No price is inferred for 512GB. A non-rendered buy-page ₹0 placeholder was rejected.

| Model | RAM | Storage | Listed colour | Official listed price |
| --- | --- | --- | --- | ---: |
| Xiaomi 17T | 12GB | 256GB | Violet | ₹69,999 |
| Xiaomi 17 | 12GB | 256GB | Venture Green | ₹89,999 |
| Xiaomi 17 Ultra | 16GB | 512GB | White | ₹1,39,999 |
| REDMI Note 17 | 6GB | 128GB | Arctic Blue | ₹30,999 |
| REDMI Note 17 Pro | 8GB | 128GB | Cloud Blue | ₹40,999 |
| REDMI Note 17 Pro Max | 8GB | 256GB | Secret Sunrise | ₹52,999 |
| REDMI 17 | 6GB | 128GB | Eternal Orange | ₹25,999 |
| REDMI 17C | 4GB | 128GB | Coffee Brew | ₹21,999 |

Each price visibly identifies its own variant and check date. Selecting another memory option does not imply that the reference price applies to it. Mobile World's actual selling price, stock and colour availability require store confirmation. No launch offer, bank offer, MRP discount or prebooking promise is added.

## Verification and rollback

The isolated 51-test suite covers optional-field normalization/privacy, real memory selection, atomic charging rows, model-colour preferences, all eight reference prices and draft save/reload/publication. Existing analytics, reward and owner-access tests remain included. No live enquiry, spin, redemption or CMS mutation is used for QA.

Managed local preview failed before app startup because its launcher appended Vite arguments (`--host`, `--strictPort`) to Next.js. The working application was not modified to accommodate that infrastructure mismatch. Use the existing Vercel Git preview workflow for browser QA; record its exact commit and deployment below in STATUS.

Pre-release production/rollback: commit `3bc3b121c40d2b656e918e025ac5874308c1f637`, deployment `dpl_6XZrVjAPkBfkd4JxYx1sW2mf1ybz`. Pending vivo work is preserved separately at local branch `codex/preserve-vivo-candidate-20261124`, commit `c52309e`; it is not part of this correction.
