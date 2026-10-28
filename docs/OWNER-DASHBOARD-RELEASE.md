# Mobile World website release — 26 October 2026

Production: https://www.mobileworldfaridabad.com/

Private owner pages:
- `/admin/analytics`: visits, active time, pages/sections, contact clicks, searches, sources, campaigns, anonymous journeys, date filters and CSV.
- `/admin/campaigns`: enable/disable and schedule homepage offers and new Spin participation. Issued reward codes remain valid.
- `/admin/spin`: private reward records and redemption.
- `/admin/business`: private Google performance snapshot, enquiry-to-sale register, daily aggregate archives and CSV exports. Enquiry outcomes are manually recorded; chats/calls/sales are not automatically read. All owner pages share the existing owner account.

The owner has created a password. Secure owner login and the signed-in production analytics/campaign pages have been verified. These three pages use the same owner account. Never store the password, one-time setup link, authentication cookies or customer records in Git. Anonymous requests cannot read reports or change campaigns.

## Production verification

The analytics collector previously returned 503 because private storage conditional writes failed. Private reads now request identity encoding to retain a strong ETag; transactions use the SDK's actual `BlobPreconditionFailedError` class instead of `error.name`, with bounded conflict retries. The SDK subclasses inherit `name="Error"`. Both analytics and Spin tests now use the actual SDK error classes.

Live collector tests successfully created and updated a marked release-check visit (HTTP 204 after awaited persistence). Source `internal-verification` is excluded from customer reports. No contact or prize actions were performed during those checks. Typecheck, lint, production build and all 19 tests passed. The regression suite also checks Hindi combining marks, search privacy and readable legacy section labels.

The original homepage product video remains 16:9, loads near the viewport, loops, and pauses/resumes at the same frame on scrolling. Shopping categories, brands and service discovery now appear before campaign and editorial sections. Smartphone, laptop/tablet and television landing pages have their own metadata, canonical URLs and sitemap entries.

## Owner report verification

- Today, seven-day and thirty-day reports loaded with recorded production activity.
- CSV download was parsed successfully; its totals matched the selected report.
- Visitor journeys expanded to show page sequence, active time, scroll depth and actions. The same owner login also opened the reward dashboard; no prize was issued or redeemed.
- Hindi vowel marks are preserved in new labels/search terms; known earlier labels receive readable titles without rewriting stored history.
- Custom date selection uses an explicit apply action with range validation. Live verification of 24 October returned six sessions and eight page views; its CSV matched. A reversed range displayed the validation message.
- Campaign controls use the same owner login; saving the existing settings succeeded, and the saved timestamp persisted after reload, without changing advertised offers.

## Remaining dependencies

- GitHub create-tree returned HTTP 403 (Resource not accessible by integration) again on 26 October; local commits are ahead of the connected GitHub repository. Production was deployed using source files through the authorized Vercel connector. Do not deploy an old GitHub revision over this release; sync the local commits once write permission is restored.
- Windsor.ai is connected and real Search Console + Google Business Profile reads succeeded on 26 October. The property and location match Mobile World. A verified private snapshot is stored via an encrypted server-only environment variable and then private Blob; no private performance rows are committed to the public repository.
- ChatGPT daily Google reports are scheduled around 08:30 Asia/Calcutta. Website Google auto-sync separately requires the owner to enter their Windsor API key in the private `/admin/business` form. This credential is validated against both accounts, encrypted at rest with AES-256-GCM, and never returned to the browser. Do not describe a snapshot as a live Google feed before connection and a successful refresh.
- Sanity CMS remains the chosen future product-content editor, but an authenticated Sanity project has not been connected. No substitute CMS has been represented as Sanity.
- GitHub installation listing returns no installations. A working website/GitHub browser login does not grant connector Contents write permission. Do not repeatedly retry rejected writes or seek alternate credentials to bypass the integration restriction.
- Detailed model/variant specifications, stock, prices and final product image verification remain the separate product-content phase requested by the owner.

Analytics starts with the installed tracker; historical visits cannot be reconstructed. Contact metrics count button clicks, not confirmed calls/messages/sales. Reports refresh every 30 seconds while open; detailed history is limited to 90 days and can be exported. Collection respects opt-out, DNT/GPC and identified automation. No raw IP address, form messages or passwords are recorded in analytics.

## Business desk release implementation

- Enquiry records have optimistic revision checks and are owner-only; dates, sources, stages and confirmed sale amounts are validated. Customer phone/email fields are intentionally absent. Reports measure enquiry cohorts, not every visitor or total shop revenue.
- A daily Vercel cron (`0 3 * * *`, 08:30 IST) requires a strong `CRON_SECRET`. It archives aggregate history and refreshes Google only when Windsor API credentials are configured. Missing credentials are reported as `key-required`, not success.
- Expired detailed analytics can be deleted only after an aggregate archive succeeds. Finalized aggregates are preserved across partial cleanup retries. Archives exclude visitor identifiers, IPs, individual journeys and events; they are not a complete database backup.
- Google query/page tables show their actual stored report period separately from the daily filters. Missing/recent data is not presented as confirmed zero business activity. Google metrics are kept separate from first-party website metrics.
- Exchange guide improved for Faridabad search intent, with local title/description, direct enquiry CTAs, steps, FAQs, careful data-transfer wording and an honest modified date. Ranking improvements are not guaranteed.
- Progress reporting is now a project rule. Percentage applies to current launch/dashboard work; blocked integrations and the deferred product-content phase must be clearly stated.

## Verified live release, 26 October 2026

Production deployment: `dpl_aaGzHrJnxrvidMDZAhrJpGsAJhMd` (READY; www and apex aliases assigned).

- All 23 tests, ESLint, TypeScript and production build passed.
- Live homepage, category page, revised Exchange guide, sitemap and owner page login boundaries returned expected responses. Admin pages are noindex and unauthenticated output contains no private report rows.
- The daily endpoint rejected an unauthenticated request (401); an authorized run returned 200 with `archived: true`. Google seed import succeeded. Google refresh correctly returned `key-required`; automatic Google sync is not yet active on the website.
- No error/fatal runtime logs were found for the deployment during verification.
- The current cloud browser owner session has expired. The new signed-in business dashboard still needs a visual check after secure owner login; its authenticated actions and persistence were exercised with isolated test storage. No fake enquiry or sale was added to production.
- Public Exchange guide was visually checked after deployment.

Current launch/dashboard progress estimate: 92/100. Remaining dependencies: GitHub integration write access, secure Windsor API connection for website auto-sync, and authenticated Sanity project setup for the deferred editor phase. Do not count the detailed product-content phase as complete.
