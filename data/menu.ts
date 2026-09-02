/**
 * Menu का ढाँचा — तीन सीढ़ियाँ।
 *
 * Owner ने 2 Sep 2026 को कहा: *"menu baar me, menu, sub bar, sub sub bar.
 * aise banao. but main baar me pages hi show karo. ac tv laptop inko menu
 * submenu sub sub menu... waise set karo."*
 *
 *   1. पहली सीढ़ी  — सारे page (`data/pages.ts` से)
 *   2. दूसरी सीढ़ी — सामान के तीन हिस्से (नीचे वाली यह list)
 *   3. तीसरी सीढ़ी — असली categories, जो `data/shop.ts` से आती हैं
 *
 * ⚠️ Category का नाम यहाँ दोबारा मत लिखिए — सिर्फ़ slug लिखिए। नाम `shop.ts`
 * से अपने आप उठता है, इसलिए वहाँ बदलते ही menu भी बदल जाता है।
 */

import { categories } from "@/data/shop";

type GroupSpec = { label: string; emoji: string; slugs: string[] };

const groups: GroupSpec[] = [
  {
    label: "Mobile और Computer", emoji: "📱",
    slugs: ["smartphones", "laptops-tablets", "audio-wearables", "accessories"],
  },
  {
    label: "TV और मनोरंजन", emoji: "📺",
    slugs: ["televisions"],
  },
  {
    label: "घर का सामान", emoji: "🏠",
    slugs: ["air-conditioners", "washing-machines", "refrigerators",
            "inverters-batteries", "kitchen-appliances"],
  },
];

export type MenuLeaf = { label: string; href: string; slug: string };
export type MenuGroup = { label: string; emoji: string; items: MenuLeaf[] };

export const productMenu: MenuGroup[] = groups.map((g) => ({
  label: g.label,
  emoji: g.emoji,
  items: g.slugs
    .map((slug) => {
      const c = categories.find((x) => x.slug === slug);
      return c ? { label: c.name, href: `/products#${c.slug}`, slug: c.slug } : null;
    })
    .filter((x): x is MenuLeaf => x !== null),
}));
