import Image from "next/image";
import { ask, type Item } from "@/data/content";
import { Art } from "./ArtSprite";
import { IconArrow } from "./Icons";
import { categorySearchAliases } from "@/data/search";

import { AddSelection } from './commerce/ShoppingControls';

export function ProductCard({ item, badge }: { item: Item; badge?: string }) {
  return (
    <article
      className="pc rv in"
      /* search isi text mein dhoondhta hai */
      data-search={`${item.title} ${item.kicker} ${item.category} ${item.tags.join(" ")} ${categorySearchAliases[item.category] ?? ""}`.toLowerCase()}
    >
      <a className="ec-category-link" href={ask(item.title)} target="_blank" rel="noopener noreferrer"><div className="pc-m">
        {badge && <span className="badge v">{badge}</span>}
        {item.image ? (
          <Image
            className="ph-img" src={item.image} alt={item.imageAlt ?? `${item.title} — category की सांकेतिक तस्वीर`}
            width={580} height={580} sizes="(max-width:700px) 46vw, 290px"
          />
        ) : (
          <Art id={item.art ?? "a-accessory"} />
        )}
      </div>
      <div className="pc-b">
        <span className="pc-k">{item.kicker}</span>
        <h3 className="pc-t">{item.title}</h3>
        {item.image && <p className="pc-image-caption">{item.imageCaption ?? "Category की सांकेतिक तस्वीर · model अलग हो सकता है"}</p>}
        <div className="pc-s">{item.tags.map((t) => <span key={t}>{t}</span>)}</div>
        <div className="pc-f"><span className="ask">जानकारी पूछिए <IconArrow /></span></div>
      </div>
      </a>
      <AddSelection name={item.title} choice={{productId:item.id,variant:"",colour:""}} category/>
    </article>
  );
}

