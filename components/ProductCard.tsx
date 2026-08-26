import Image from "next/image";
import { ask, type Item } from "@/data/content";
import { Art } from "./ArtSprite";
import { IconArrow } from "./Icons";

/**
 * एक product card। पूरा card ही WhatsApp link है — customer tap करते ही
 * उसी चीज़ का सवाल तैयार मिलता है।
 */
export function ProductCard({ item, badge }: { item: Item; badge?: string }) {
  return (
    <a
      className="pc rv in" href={ask(item.title)} target="_blank" rel="noopener"
      /* search isi text mein dhoondhta hai */
      data-search={`${item.title} ${item.kicker} ${item.category} ${item.tags.join(" ")}`.toLowerCase()}
    >
      <div className="pc-m">
        {badge && <span className="badge v">{badge}</span>}
        {item.image ? (
          <Image
            className="ph-img" src={item.image} alt={item.title}
            width={580} height={580} sizes="(max-width:700px) 46vw, 290px"
          />
        ) : (
          <Art id={item.art ?? "a-accessory"} />
        )}
      </div>
      <div className="pc-b">
        <span className="pc-k">{item.kicker}</span>
        <h3 className="pc-t">{item.title}</h3>
        <div className="pc-s">{item.tags.map((t) => <span key={t}>{t}</span>)}</div>
        <div className="pc-f"><span className="ask">Stock पूछिए <IconArrow /></span></div>
      </div>
    </a>
  );
}
