import { shop } from "@/data/shop";

type Props = {
  label?: string;
  className?: string;
};

/**
 * दुकान पर call करने का button।
 * नंबर हमेशा shop.ts से आता है — यहाँ कभी hardcode मत करना।
 */
export default function CallButton({ label = "Call करें", className = "" }: Props) {
  return (
    <a
      href={shop.phone.tel}
      className={`sheen group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-brand to-electric px-7 py-4 text-base font-semibold text-ink shadow-[0_8px_30px_-6px] shadow-electric/50 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric active:scale-[0.99] ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5 shrink-0">
        <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z" />
      </svg>
      <span className="relative z-10">{label}</span>
    </a>
  );
}
