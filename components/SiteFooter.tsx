import { shop, fullAddress } from "@/data/shop";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-line bg-ink-2">
      {/*
        फ़ोन पर नीचे contact की पट्टी चिपकी रहती है, इसलिए footer के नीचे
        उतनी जगह छोड़नी ज़रूरी है — वरना पट्टी आख़िरी लाइनें ढँक लेती है।
      */}
      <div className="mx-auto max-w-5xl px-5 pt-12 pb-28 text-sm sm:pb-12">
        <p className="bg-gradient-to-r from-cream to-electric bg-clip-text text-xl font-bold text-transparent">
          {shop.name}
        </p>
        <p className="mt-3 max-w-md leading-relaxed text-muted">{fullAddress}</p>
        <a
          href={shop.phone.tel}
          className="mt-4 inline-block text-base font-semibold text-electric hover:underline"
        >
          {shop.phone.display}
        </a>
        <div className="mt-8 border-t border-line pt-5 text-xs text-muted/70">
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
