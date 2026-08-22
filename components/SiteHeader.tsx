import { shop } from "@/data/shop";

/**
 * ऊपर की पट्टी — सिर्फ़ दुकान का नाम और जगह।
 *
 * Menu links जान-बूझकर नहीं हैं: Products/About/Contact page अभी बने नहीं।
 * बने हुए page ही link होंगे, वरना customer 404 पर पहुँच जाएगा।
 */
export default function SiteHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-3xl px-5 py-4">
        <p className="text-xl font-bold tracking-tight text-brand">{shop.name}</p>
        <p className="text-sm text-gray-600">
          {shop.address.locality}, {shop.address.city}
        </p>
      </div>
    </header>
  );
}
