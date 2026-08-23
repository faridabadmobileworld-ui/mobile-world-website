import Link from "next/link";
import { shop } from "@/data/shop";
import CallButton from "@/components/CallButton";
import WhatsAppButton from "@/components/WhatsAppButton";

/**
 * गलत link खुलने पर यह दिखता है।
 * यहाँ भी call और WhatsApp रखे हैं — customer खोया हुआ महसूस न करे।
 */
export default function NotFound() {
  return (
    <main className="relative mx-auto flex min-h-[80svh] max-w-5xl flex-col justify-center px-5 pt-32 pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
      />
      <p className="relative bg-gradient-to-br from-brand via-electric to-violet bg-clip-text text-7xl font-black text-transparent sm:text-8xl">
        404
      </p>
      <h1 className="relative mt-4 text-2xl font-bold text-cream sm:text-3xl">
        यह page नहीं मिला
      </h1>
      <p className="relative mt-3 max-w-md leading-relaxed text-muted">
        शायद link गलत है या वो page हटा दिया गया। {shop.name} के बाक़ी pages
        नीचे से खोल लीजिए, या सीधे हमसे पूछ लीजिए।
      </p>

      <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
        <CallButton />
        <WhatsAppButton />
      </div>

      <Link
        href="/"
        className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-electric hover:underline"
      >
        <span aria-hidden="true">←</span>
        Home page पर वापस जाएँ
      </Link>
    </main>
  );
}
