import { shop, fullAddress } from "@/data/shop";

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      {/*
        फ़ोन पर नीचे contact की पट्टी चिपकी रहती है, इसलिए footer के नीचे
        उतनी जगह छोड़नी ज़रूरी है — वरना पट्टी आख़िरी लाइनें ढँक लेती है।
      */}
      <div className="mx-auto max-w-3xl px-5 pt-8 pb-28 text-sm text-gray-600 sm:pb-8">
        <p className="font-semibold text-gray-900">{shop.name}</p>
        <p className="mt-1">{fullAddress}</p>
        <p className="mt-3">
          <a href={shop.phone.tel} className="font-medium text-brand hover:underline">
            {shop.phone.display}
          </a>
        </p>
        <p className="mt-4 text-xs text-gray-500">
          {shop.registeredName} · Proprietor: {shop.owner}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          © {new Date().getFullYear()} {shop.name}
        </p>
      </div>
    </footer>
  );
}
