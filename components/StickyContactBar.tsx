import { shop } from "@/data/shop";

/**
 * फ़ोन पर नीचे हमेशा चिपकी रहने वाली पट्टी — Call और WhatsApp।
 * CLAUDE.md §3: हर page पर ये दोनों आसानी से पहुँच में हों।
 */
export default function StickyContactBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ink/85 backdrop-blur-xl sm:hidden">
      <div className="grid grid-cols-2 gap-2.5 p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
        <a
          href={shop.phone.tel}
          className="sheen relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand to-electric py-3.5 text-sm font-bold text-ink"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
            <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z" />
          </svg>
          <span className="relative z-10">Call करें</span>
        </a>
        <a
          href={shop.phone.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp py-3.5 text-sm font-bold text-ink"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
            <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.3-.5v-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.1 2.1-.5 3.4a11 11 0 0 0 4.7 4.7c1.6.7 2.6.7 3.5.5.6-.1 1.5-.7 1.7-1.3.2-.6.2-1.1.1-1.2l-.4-.2Z" />
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  );
}
