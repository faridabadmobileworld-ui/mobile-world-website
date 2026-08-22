import { shop } from "@/data/shop";

type Props = {
  label?: string;
  className?: string;
};

/**
 * WhatsApp पर message भेजने का button।
 * नंबर हमेशा shop.ts से आता है — यहाँ कभी hardcode मत करना।
 */
export default function WhatsAppButton({
  label = "WhatsApp पर पूछें",
  className = "",
}: Props) {
  return (
    <a
      href={shop.phone.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 rounded-2xl border border-whatsapp/40 bg-whatsapp/10 px-7 py-4 text-base font-semibold text-whatsapp backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:bg-whatsapp hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp active:scale-[0.99] ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5 shrink-0">
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.3-.5v-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.1 2.1-.5 3.4a11 11 0 0 0 4.7 4.7c1.6.7 2.6.7 3.5.5.6-.1 1.5-.7 1.7-1.3.2-.6.2-1.1.1-1.2l-.4-.2Z" />
      </svg>
      {label}
    </a>
  );
}
