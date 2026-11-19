# Detailed phone guides — 20 November 2026

The owner asked to continue the existing phone catalogue and publish completed batches. The 17 November Home card release is already production: `15646a697ddcf9c63d992e3aad04e3e93c3046d9`, `dpl_BBmM1jCXpuCzrSiYFhXUpYiCz5b9`. Xiaomi 17T, vivo V80 and OPPO F35 Pro retain that order, with no stale launch/pre-booking badges.

## Public specification pages

`/phones/[slug]` publishes the explicitly reviewed editorial guide IDs in `data/published-phone-guides.json`. The first batch uses the 20 previously source-audited India models. The original per-field source/region/conflict audits and verification dates remain authoritative; this release does not claim a new source check for unchanged records. A new reference JSON does not automatically publish a guide: its ID must be deliberately added to the release manifest after review.

The server normalizes and validates each reference, then constructs an allowlisted public projection. Private price (`spec_007`), source/admin metadata and empty values are excluded from the HTML/RSC data. All 86 core keys remain editable; only known public rows and nonempty sections are shown. Meaningful No and zero are retained. RAM/storage/colour selection follows existing verified variant records, not a Cartesian product. Manufacturer options do not establish shop stock.

These are editorial specifications for the existing public guide catalogue. They are not Sanity publication events. `/catalog/[slug]`, owner drafts, authenticated actions, optimistic revisions, unpublish and snapshot handling are unchanged. Published Sanity links take precedence in the product explorer. No connection or CMS save/publish success is implied.

The Home card uses the detailed guide where released and otherwise retains its existing exact-model dialog. Product dialogs link to full specifications. Existing query links, shortlist IDs, comparison and category URLs remain supported. Each released guide has its own canonical URL, social metadata and sitemap entry; no price, stock, review or offer is invented in structured data.

## Acceptance

- First-batch denominator: 20 released guide pages from 20 existing source references; wider existing catalogue baseline: 63 entries, including unaudited families. Expanded exact-model replacements are counted separately.
- Required checks: reference/public-boundary and dependent-variant regressions; existing catalogue/analytics/reward tests; TypeScript; ESLint; production build; preview and public/private route checks; responsive visual/interaction checks.
- Preserve rollback `dpl_BBmM1jCXpuCzrSiYFhXUpYiCz5b9` until a new production release passes its checks. Record actual commit, deployment and live evidence in `docs/handover/STATUS.md`.
