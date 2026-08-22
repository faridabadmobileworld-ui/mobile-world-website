import { shop } from "@/data/shop";

/**
 * यह सिर्फ़ एक placeholder है ताकि setup चलकर दिखे।
 * असली Home page अगले step में इसकी जगह लेगा।
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold">{shop.name}</h1>
      <p className="mt-2 text-gray-600">
        {shop.address.locality}, {shop.address.city}
      </p>
      <p className="mt-6 text-sm text-gray-500">Website बन रही है।</p>
    </main>
  );
}
