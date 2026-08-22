import { shop } from "@/data/shop";

/**
 * ऊपर की पट्टी — scroll करने पर भी चिपकी रहती है, पीछे धुँधलापन।
 *
 * Menu links जान-बूझकर नहीं हैं: बाक़ी pages अभी बने नहीं।
 */
export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
        <div>
          <p className="bg-gradient-to-r from-cream via-electric to-brand bg-clip-text text-lg font-bold tracking-tight text-transparent">
            {shop.name}
          </p>
          <p className="text-xs text-muted">
            {shop.address.locality}, {shop.address.city}
          </p>
        </div>
        <a
          href={shop.phone.tel}
          className="hidden rounded-xl border border-electric/40 px-4 py-2 text-sm font-semibold text-electric transition-colors hover:bg-electric hover:text-ink sm:inline-flex"
        >
          {shop.phone.display}
        </a>
      </div>
    </header>
  );
}
