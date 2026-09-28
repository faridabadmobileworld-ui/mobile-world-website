import { localBusinessSchema, jsonLdScript } from "@/data/schema";
import { ShoppingHero } from "@/components/ShoppingHero";
import { ShoppingCategories } from "@/components/ShoppingCategories";
import { HomeBody } from "@/components/HomeBody";

/* Home page ka saara content ab `components/HomeBody.tsx` mein hai, taaki
   `/showcase` bhi bilkul wahi content dikha sake — do jagah likhe bina. */

export default function Home() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(localBusinessSchema()) }} />

      <div className="wrap shopping-home">
        <ShoppingHero />
        <ShoppingCategories />
        <HomeBody current="/" />
      </div>
    </>
  );
}
