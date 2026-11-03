# iPhone 18 Pro India audit — 3 November 2026

Two existing guide IDs are retained: `apple-iphone-18-pro` and `apple-iphone-18-pro-max`. Each no-write reference contains 86 fields: 58 sourced and 28 empty. Each has four storage-only preferences (256GB, 512GB, 1TB, 2TB), with RAM, colour and variant image empty. No store stock, price or colour/storage Cartesian product is invented. Candidate coverage is 10/59; accepted coverage stays 8/59 until release verification. CMS-published detailed products remain 0.

Sources checked: [Apple India technical specifications](https://www.apple.com/in/iphone-18-pro/specs/), [India overview](https://www.apple.com/in/iphone-18-pro/) and [India store](https://www.apple.com/in/shop/buy-iphone/iphone-18-pro). Technical specifications supply the independently normalized fields; overview/store corroborate model, finishes and images. Numeric specifications are recorded as facts rather than copied promotional claims.

## Decisions

- The 4x tetraprism telephoto lens and 8x optical-quality mode are labelled separately. Do not claim an 8x optical lens. Digital 40x is a photo limit, not the separate video zoom limit.
- 60W-capable AVS adapter or higher is Apple's specified charging-test accessory, not a confirmed phone input wattage. The 15-minute figure is explicitly up to 50%, not a full charge. Adapter is separately sold; the USB-C cable is listed in the box.
- Video endurance is a qualified manufacturer test claim; it is not a real-world shop guarantee. The 34/43-hour video figures remain model-specific. Capacity in mAh, RAM, CPU clock, storage technology/version and guaranteed support duration are unconfirmed and genuinely blank.
- Both models have four listed storage capacities; the older guide's Pro 128GB option is removed and 2TB is included. These are enquiry preferences only. SIM wording is India nano-SIM + eSIM / dual eSIM, not imported eSIM-only assumptions.
- Use 6.3/6.9-inch nominal display names. The specs page gives differing nominal and rectangular centimetre measurements for Max; no centimetre conversion is silently selected.
- IP68 retains laboratory qualifications. Cosmetic resistance, drop/water durability, AI languages/rollout and carrier features are not unconditional promises. Current iOS 27 is distinct from an unsupported update-duration promise.
- Omitted fingerprint, headphone jack, memory card, case, SIM ejector and charging capabilities remain empty rather than No. An unrelated US warranty page was inspected but is not used to establish India warranty terms; all three warranty fields remain blank in this audit.
- All 59 original guide IDs remain. iPhone 18 base stays excluded because this audit does not settle its exact India model. Existing artwork stays tracked.

## Image provenance

Original manufacturer JPEGs from the India store were downloaded unchanged, decoded and visually inspected. Rear view and camera close-up are identified separately; neither is described as a front view or all-colour image. No generative edit, crop or conversion was made.

| Model / view | Repository path | Bytes | SHA-256 | Official asset |
| --- | --- | ---: | --- | --- |
| iphone-18-pro / camera close-up | `public/images/iphone-18-pro-official.jpg` | 66297 | `7200602547aade52215040a003b3a5ac8ab0f10c6bfdf5ac654179e3d1bcbf15` | [Store asset](https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-18-pro-finish-select-silver-202609_AV2?wid=724&hei=540&fmt=jpeg&qlt=90&.v=ODB3TEdtbk8ybkd3clM3dWVML3VCVGJOdEdsYjE3KzExOGFjT0NXdW5CRzFVVXZ0WDBlS281eURIb2h1bGRDYUVrYzZ4aGx2Q085bnhRaVROeFdKVDdrNkxqcEdrM2x6OUZ3Z2JnTllhUU5pTnR1WjBmd3ZFSVQ3ZE5MLzZ4d1Y) |
| iphone-18-pro-max / camera close-up | `public/images/iphone-18-pro-max-official.jpg` | 85318 | `0f440141ff0f39f3bcb6ecbe34c9af5158b3336fab3d7a0f3531737908b333d6` | [Store asset](https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-18-pro-max-finish-select-burgundy-202609_AV2?wid=724&hei=540&fmt=jpeg&qlt=90&.v=UmkydCsrWUVqOXF2VEM2dzB6cklhWUQ2cmRnWCtSNmVDd2t4cWxWSnIvNUczeU83bkpqVjJNa0hHTzZGMFJkOUJzS0RYWXBINXM3OEFKMGgwUWg2N1o0S3NIczRMdVY1Tlh2SlRSaUw4bXdvVyt2VmxhZU4zZHRmY1FSYWRXV1h5R2dydEZKdjJpNHZab2plQ1FnV29B) |
| iphone-18-pro / rear view | `public/images/iphone-18-pro-official-rear.jpg` | 34683 | `89f9ad55f1d3358e26653f2f76d40ad7f4abc21c0a58e2da2c18aa67ddb4fbe6` | [Store asset](https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-18-pro-witb-silver-202609?wid=346&hei=784&fmt=jpeg&qlt=90&.v=bHdIRXBpK0dxdDZ1RThTOURCMzUvUnpManNZaEtGMytaQVRGL3JFb1VuRFE2M296aFJZZjNPSWVldGhZcWJQWGJGcXNRQnFCV0w3WVRjTExvdm1ic2FtUnhSUnBnZ0ZzU3hLUTQxOW9PNlVXZEdHNUFPR0hYUU12cjI0VlFzM1A) |
| iphone-18-pro-max / rear view | `public/images/iphone-18-pro-max-official-rear.jpg` | 40749 | `fc59776dc828d5d0c1ff1d15cb7e17a2e0e20b923fc1f428887ee12191bada9c` | [Store asset](https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-18-pro-max-witb-burgundy-202609?wid=346&hei=784&fmt=jpeg&qlt=90&.v=UmkydCsrWUVqOXF2VEM2dzB6cklhWmMxWFNNcTlCcm9Bak5IcUE1RVp5TDdabGZaY2pDTHc1RXRCM1N3cjJHMjI3djFFelRXako4aHBKR25KY0VZTXMxbkFXU2FISGdzOWtzcFBscGF0YTl2eVoxa1p4MGwxQVpZeU5wWWJRazk) |

## Empty fields

- iPhone 18 Pro: Brand Origin, Manufacturing Country, India Launch Date, Price, CPU Maximum Clock Speed, RAM Capacity, RAM Type, Storage Technology, Storage Version, Memory Card Support, Main Camera Sensor, EIS, Battery Capacity, Reverse Wired Charging, Reverse Wireless Charging, User Interface, OS Update Support, Security Update Support, IR Blaster, USB OTG, Headphone Jack, Fingerprint Sensor, FM Radio, Phone Warranty, Battery Warranty, Accessories Warranty, Protective Case Included, SIM Ejector Included.
- iPhone 18 Pro Max: Brand Origin, Manufacturing Country, India Launch Date, Price, CPU Maximum Clock Speed, RAM Capacity, RAM Type, Storage Technology, Storage Version, Memory Card Support, Main Camera Sensor, EIS, Battery Capacity, Reverse Wired Charging, Reverse Wireless Charging, User Interface, OS Update Support, Security Update Support, IR Blaster, USB OTG, Headphone Jack, Fingerprint Sensor, FM Radio, Phone Warranty, Battery Warranty, Accessories Warranty, Protective Case Included, SIM Ejector Included.

Reference load has no CMS write. Real owner-authenticated save/reload/edit/publish acceptance is still pending.
