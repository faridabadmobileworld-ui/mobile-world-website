import Link from "next/link";
import { shop, fullAddress } from "@/data/shop";
import { navItems } from "@/data/nav";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-line bg-ink-2">
      {/*
        फ़ोन पर नीचे contact की पट्टी चिपकी रहती है, इसलिए footer के नीचे
        उतनी जगह छोड़नी ज़रूरी है — वरना पट्टी आख़िरी लाइनें ढँक लेती है।
      */}
      <div className="mx-auto max-w-5xl px-5 pt-14 pb-28 text-sm sm:pb-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <p className="bg-gradient-to-r from-cream to-electric bg-clip-text text-xl font-bold text-transparent">
              {shop.name}
            </p>
            <address className="mt-3 max-w-md leading-relaxed text-muted not-italic">
              {fullAddress}
            </address>
            <a
              href={shop.phone.tel}
              className="mt-4 inline-block text-base font-semibold text-electric hover:underline"
            >
              {shop.phone.display}
            </a>
            <ul className="mt-5 flex flex-wrap gap-3">
              {[
                { name: "YouTube", url: shop.social.youtube },
                { name: "Instagram", url: shop.social.instagram },
                { name: "Facebook", url: shop.social.facebook },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-colors hover:text-electric"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav>
            <p className="text-xs tracking-widest text-muted/70 uppercase">Pages</p>
            <ul className="mt-4 space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted transition-colors hover:text-electric"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-line pt-5 text-xs text-muted/70">
          <p>
            {shop.registeredName} · Proprietor: {shop.owner}
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} {shop.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
