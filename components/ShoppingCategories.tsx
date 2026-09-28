import Image from "next/image";
import Link from "next/link";
import { navCategories, artForCategory } from "@/data/content";
import { Art } from "./ArtSprite";
import { IconArrow } from "./Icons";

export function ShoppingCategories() {
  return (
    <section className="shopping-categories" aria-labelledby="shop-by-category">
      <div className="shopping-section-heading">
        <div><p className="shopping-overline">FIND WHAT YOU NEED</p><h2 id="shop-by-category">आपको क्या चाहिए?</h2></div>
        <Link href="/products">सभी products <IconArrow /></Link>
      </div>
      <div className="shopping-category-grid">
        {navCategories.map((category) => (
          <Link href={`/products#${category.slug}`} key={category.slug} className="shopping-category">
            <span className="shopping-category-image">
              {category.image
                ? <Image src={category.image} alt="" width={200} height={200} sizes="(max-width:700px) 100px, 110px" />
                : <Art id={artForCategory(category.slug)} />}
            </span>
            <span>{category.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
