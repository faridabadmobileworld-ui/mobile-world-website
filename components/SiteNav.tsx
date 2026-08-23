"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { shop } from "@/data/shop";
import { navItems } from "@/data/nav";

/**
 * ऊपर की पट्टी — scroll पर चिपकी रहती है।
 * फ़ोन पर menu तीन लकीरों वाले button से खुलता है, laptop पर सीधे दिखता है।
 */
export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-ink/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="shrink-0">
          <span className="block bg-gradient-to-r from-cream via-electric to-brand bg-clip-text text-lg font-bold tracking-tight text-transparent">
            {shop.name}
          </span>
          <span className="block text-xs text-muted">
            {shop.address.locality}, {shop.address.city}
          </span>
        </Link>

        {/* laptop का menu */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-electric/10 text-electric"
                  : "text-muted hover:text-cream"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={shop.phone.tel}
            className="ml-2 rounded-xl border border-electric/40 px-4 py-2 text-sm font-semibold text-electric transition-colors hover:bg-electric hover:text-ink"
          >
            {shop.phone.display}
          </a>
        </nav>

        {/* फ़ोन का menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Menu बंद करें" : "Menu खोलें"}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-cream sm:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* फ़ोन पर खुलने वाला menu */}
      {open && (
        <nav id="mobile-menu" className="border-t border-line/60 px-5 pb-4 sm:hidden">
          <ul className="pt-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  // link दबाते ही menu बंद कर दो
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded-lg px-3 py-3 text-base font-medium ${
                    isActive(item.href)
                      ? "bg-electric/10 text-electric"
                      : "text-cream/90"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
