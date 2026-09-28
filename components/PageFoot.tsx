import Link from "next/link";
import { shop } from "@/data/shop";
import { IconCal, IconClock, IconArrow } from "./Icons";

/** Contact and social information now lives once in the shared SiteFooter. */
export function PageFoot() { return null; }

/** Author attribution belongs to dated articles; store pages use a discreet footer credit. */
export function Byline({date,dateISO,time}: {date?:string;dateISO?:string;time?:string}) {
  if (!date) return null;
  return <aside className="byl byline-end"><span className="byl-av" aria-hidden="true">{shop.authorName.charAt(0)}</span><div className="byl-b"><span className="byl-k">यह Guide लिखी है</span><b className="byl-n">{shop.authorName}</b><div className="byl-m"><span className="byl-p"><IconCal />{dateISO ? <time dateTime={dateISO}>{date}</time> : date}</span>{time && <span className="byl-p"><IconClock />{time}</span>}</div></div><Link className="byl-cta" href="/posts">और Guides <IconArrow /></Link></aside>;
}
