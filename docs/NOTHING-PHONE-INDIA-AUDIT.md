# Nothing Phone India audit — 3 November 2026

Existing IDs `nothing-nothing-phone-3` and `nothing-nothing-phone-3a` are retained. Each has 86 independent fields, unknown genuinely empty and price blank. Phone (3): 59 populated / 27 empty. Phone (3a): 48 populated / 38 empty. Each has two confirmed memory-only preferences and no invented colour/stock combinations. Candidate catalogue coverage is 14/59; accepted remains 12/59 until release verification. CMS-published details remain 0.

## Source association and evidence

- [Phone (3), India](https://in.nothing.tech/products/phone-3) and [Phone (3a), India](https://in.nothing.tech/products/phone-3a) contain their published product specification tables and India Shopify option/variant data.
- The published structured page stream was parsed as JSON data only, without executing site JavaScript. Only the exact product's `specs` array and its Shopify capacity/colour options were associated with the reference. Unrelated reusable widget strings elsewhere in the page payload were not treated as that product's specifications. No account, session storage or private API was accessed.
- Manufacturer document provenance: Phone (3) ID `93a20454-b37c-49b5-8070-9766b5213262`, revision `u8UOjxeuLZ7YA2Wt6NDSVu`, updated 2026-06-02T11:43:35Z. Phone (3a) ID `6dbcdc69-0c20-49ce-bec8-5a9975eb3798`, revision `UCFstcAEZySEtlLVsgZgF6`, updated 2026-07-14T14:01:21Z. These identify Nothing's published evidence, not the owner's Sanity project or permission to write to it.
- [Phone (3) global battery FAQ](https://support.nothing.tech/hc/en-us/articles/36457422044561-What-s-the-battery-capacity-of-Nothing-Phone-3-and-how-long-does-it-take-to-charge), [Phone (3a) dimensions FAQ](https://support.nothing.tech/hc/en-us/articles/32978945259281-What-are-the-dimensions-and-weight-of-the-Phone-3a) and [Phone (3a) feature FAQ](https://support.nothing.tech/hc/en-us/sections/32977167969041-Product-Feature?page=2) are used to document conflicting scope, not silently overwrite India fields.

## Conservative decisions

- Phone (3) India explicitly has **5500mAh**; 5150mAh is the general table value with an India-only footnote. The global FAQ's approximately 60-minute full charge concerns the 5150mAh model, so India charging time stays empty.
- Phone (3a) India table says **208g / 1084×2392** while official support says **201g / 1080×2392**. Both weight and pixel resolution stay empty. The guide states only the corroborated 6.77-inch AMOLED/120Hz information. The India 163.5mm height is a lower-precision presentation than support's 163.52mm, not a separately invented exact conversion.
- Phone (3) India memory pairs are 12/256 and 16/512. Phone (3a)'s India Shopify capacity options are **8/128 and 8/256**. A generic specifications capacity line mentioning 12GB does not establish an India 12GB SKU. Colour lists are model-level preferences, not a stock matrix.
- Phone (3a) India explicitly limits eSIM to Japan; its India reference records No with that reason. Phone (3) explicitly lists eSIM Support in its India table. Omitted wireless charging or charger inclusion is not turned into No. Box case is Yes for Phone (3), but empty for (3a).
- Phone (3a)'s ordinary 2x telescope camera is not described as a periscope. Phone (3)'s 3x periscope and both in-sensor/digital modes are kept distinct. Main OIS/EIS is confirmed for both; (3a) telephoto OIS stays empty because its table states EIS only.
- Video playback formats and 4K timelapse do not establish normal 4K capture. Only the corroborated normal 1080p/30/60 subset is recorded for Phone (3), with no claim that it is the maximum. Unresolved front video and (3a) normal video fields stay empty.
- India page lists Phone (3) Nothing OS 4 / Android 16, whereas a separate global FAQ lists 3.3 / Android 15. Values are labelled as listed by the India product page, not guaranteed installed firmware. Phone (3a) likewise labels its listed OS 3.1 / Android 15. Update durations remain years, not Android generations; Phone (3)'s policy start is first nothing.tech availability.
- The NPU/GPU fields come only from the matching specifications section. No GPU is inferred for (3a) from an unrelated page widget. Battery chemistry, materials, separate warranties and other absent features remain empty. IP ratings are qualified laboratory ratings, not unrestricted waterproofing promises.
- Manufacturer website stock/price values were not copied. Store availability is always confirmed by enquiry; existing artwork remains in Git.

## Image provenance

Original transparent 1352x1352 manufacturer PNGs from the exact product's published primary image were downloaded unchanged, decoded and visually inspected. Phone (3) is White rear with Glyph Matrix; (3a) is Black rear with Glyph lights. Captions and alt text identify rear view and colour. No generated edit, crop or conversion is used.

| Model | Repository path | Bytes | SHA-256 | Source |
| --- | --- | ---: | --- | --- |
| phone-3 / White | `public/images/nothing-phone-3-official-white.png` | 649486 | `bd64352cb15b68f51c824c2630bea0c2ae8a9f916664193110b9ddea595ef17b` | [Manufacturer asset](https://cdn.shopify.com/s/files/1/0586/3270/0077/files/Arbok-Primary-White.png?v=1750839180) |
| phone-3a / Black | `public/images/nothing-phone-3a-official-black.png` | 876568 | `993d238f3cc4606431c8315b5d9c905ab18f16c6ff476acc2d226f43ec70e654` | [Manufacturer asset](https://cdn.shopify.com/s/files/1/0586/3270/0077/files/Arc1352x1352-Black-Glyphon_4677e90c-2628-407c-b286-e6b96238dedf.png?v=1740649954) |

## Empty-field inventory

- Nothing Phone (3): Brand Origin, Manufacturing Country, India Launch Date, Price, Back Material, Frame Material, RAM Type, Storage Technology, Storage Version, Memory Card Support, Main Camera Sensor, Front Video Resolution, Front Video Frame Rate, Battery Backup, Charging Time, Wi-Fi Calling, IR Blaster, USB OTG, Headphone Jack, Face Unlock, Dolby Atmos, FM Radio, Torch, Phone Warranty, Battery Warranty, Accessories Warranty, Charger Included.
- Nothing Phone (3a): Brand Origin, Manufacturing Country, India Launch Date, Price, Weight, Back Material, Frame Material, Display Resolution, GPU, RAM Type, Storage Technology, Storage Version, Memory Card Support, Main Camera Sensor, Telephoto Camera OIS, Rear Video Resolution, Rear Video Frame Rate, Front Video Resolution, Front Video Frame Rate, Battery Technology, Battery Backup, Wireless Charging, Reverse Wireless Charging, AI Platform, VoLTE, Wi-Fi Calling, IR Blaster, USB OTG, Headphone Jack, Face Unlock, Dolby Atmos, FM Radio, Torch, Phone Warranty, Battery Warranty, Accessories Warranty, Charger Included, Protective Case Included.

Reference load only returns a fresh in-memory draft. Actual authenticated CMS save/reload/edit/publish remains separate.
