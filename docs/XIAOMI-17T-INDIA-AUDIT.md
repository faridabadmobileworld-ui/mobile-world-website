# Xiaomi 17T India reference — 1 November 2026

The existing guide ID `xiaomi-xiaomi-17t` is retained. The public guide now uses the manufacturer's image and verified highlights. The 86-field reference in `data/verified-products/xiaomi-17t-india.json` can start a private editor draft after Sanity connection; loading it does not save or publish anything.

65 of 86 independent fields have sourced values; 21 remain empty. This is one source-audited model out of the 59 existing guide entries, not 59 verified products or a successful CMS publication. No public price, store stock, new offer or invented colour/storage combination is added.

## Evidence map

All sources were checked on 1 November 2026, India region. Facts are normalized independently of marketing copy.

| Source | Fields supported |
| --- | --- |
| [Xiaomi India specifications](https://www.mi.com/in/product/xiaomi-17t/specs/) | Identity, colours, dimensions, weight, display, chipset, memory, camera resolutions, main OIS, zoom, normal video modes, battery, wired charging, reverse wired charging, OS/UI, networks/bands, Wi-Fi, Bluetooth, NFC, navigation, IR, USB-C, fingerprint, face unlock, gyroscope, box contents |
| [Xiaomi India FAQ](https://www.mi.com/in/product/xiaomi-17t/faq/) | Front/back Gorilla Glass 7i, 6.59-inch size, telephoto OIS, four Android upgrade generations, six years of security support |
| [Xiaomi India warranty](https://www.mi.com/in/support/policy/warranty/) | One-year handset and six-month original battery/in-box accessory limited warranty; the vendor's conditions remain applicable |

CPU core count 8 is derived by adding the official 1 + 3 + 4 groups. UFS and 4.1 are kept as separate technology/version fields. Rear/front video resolution and frame-rate fields remain separate. The 3500-nit value retains its UHBM/25%-APL qualification. The IP68 value describes laboratory resistance, not unrestricted waterproof use. Faster slow-motion rates are not presented as ordinary video rates.

## Variants and unresolved facts

The India source explicitly lists 12GB+256GB and 12GB+512GB. These two memory options are recorded with colour empty. A separate list of Violet, Blue and Black is not evidence that all six combinations are available; no cross-product of colours and storage was generated. No store availability is asserted.

Empty fields: brand origin, manufacturing country, India launch date, internal price, frame material, memory-card support, main-camera sensor, EIS, battery backup, wireless charging, reverse wireless charging, charging time, eSIM, VoLTE, Wi-Fi calling, USB OTG, headphone jack, speakers, Dolby Atmos, FM radio and torch. In particular, generic eSIM terms below a Dual SIM heading do not confirm India eSIM support, and an omitted capability does not establish a verified No.

## Image provenance

- Manufacturer asset linked directly by the India specifications page: https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-17t/pc/header-phone.png
- Repository asset: `public/images/xiaomi-17t-official-colours.png`.
- Original PNG retained without generative alteration: 914849 bytes, SHA-256 `8a4051b77b22cdfffe22035d308009f3df4ed49ed67227e57f9450cda56187e7`.
- Visually checked: Violet front/back and Blue/Black backs, no prices or offer text. It is a model/colour reference, not a selected-SKU stock image.
- Older owner promotional artwork remains in the repository; the existing model's displayed guide image now prioritizes this official reference.

## Publication boundary

The draft action requires owner authorization. Reference loading returns a fresh normalized copy and never writes to Sanity. Draft/save/reload/publish and the resulting `/catalog/xiaomi-17t` page still require an actual authenticated CMS connection. Do not mark that flow complete from local tests or the public guide alone.
