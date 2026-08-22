import { brands } from "@/data/shop";

/**
 * Brands की लगातार चलती हुई पट्टी।
 *
 * सूची दो बार लिखी जाती है और आधी दूरी तक खिसकती है — इससे लगता है कि
 * पट्टी कभी ख़त्म ही नहीं होती। पूरा काम CSS से, कोई JavaScript नहीं।
 */
export default function BrandMarquee() {
  const row = [...brands, ...brands];

  return (
    <div className="marquee-wrap relative overflow-hidden py-2">
      {/* दोनों किनारों पर धुँधलापन, ताकि पट्टी कटी हुई न लगे */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent" />

      <ul className="marquee-track flex w-max gap-3">
        {row.map((brand, i) => (
          <li
            key={`${brand.slug}-${i}`}
            aria-hidden={i >= brands.length}
            className="glow-ring shrink-0 rounded-xl bg-surface/70 px-5 py-3 text-sm font-medium whitespace-nowrap text-cream/90"
          >
            {brand.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
