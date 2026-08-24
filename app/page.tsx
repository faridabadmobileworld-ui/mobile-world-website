import { shop } from "@/data/shop";
import { localBusinessSchema, jsonLdScript } from "@/data/schema";

/**
 * यह अभी भी placeholder है — असली Home page अगले step में बनेगा।
 *
 * पर LocalBusiness schema अभी से यहाँ है। Google को दुकान का पता, phone,
 * timings और map coordinates जितनी जल्दी मिल जाएँ उतना अच्छा — local
 * ranking बनने में हफ़्ते लगते हैं।
 */
export default function Home() {
  const schema = localBusinessSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }}
      />

      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold">{shop.name}</h1>

        <p className="mt-2 text-gray-600">
          {shop.address.locality}, {shop.address.city}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Roz subah 10 se raat 10 baje tak · Mahine ki aakhri tareekh ko band
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={shop.phone.tel}
            className="inline-flex min-h-11 items-center rounded-lg bg-gray-900 px-5 font-semibold text-white"
          >
            Call {shop.phone.display}
          </a>
          <a
            href={shop.phone.whatsapp}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center rounded-lg bg-green-600 px-5 font-semibold text-white"
          >
            WhatsApp
          </a>
        </div>

        <p className="mt-8 text-sm text-gray-500">Website ban rahi hai.</p>
      </main>
    </>
  );
}
