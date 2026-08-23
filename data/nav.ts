/**
 * Website के pages की इकलौती सूची।
 *
 * Menu, footer और sitemap.xml — तीनों यहीं से बनते हैं। नया page जोड़ना हो
 * तो सिर्फ़ यहाँ एक line जोड़िए, तीनों जगह अपने आप आ जाएगा।
 */

export type NavItem = {
  href: string;
  label: string;
  /** sitemap.xml में कितनी अहमियत — Home सबसे ऊपर */
  priority: number;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Home", priority: 1 },
  { href: "/products", label: "Products", priority: 0.9 },
  { href: "/visit-us", label: "Visit Us", priority: 0.8 },
  { href: "/about", label: "About", priority: 0.7 },
  { href: "/contact", label: "Contact", priority: 0.8 },
];
