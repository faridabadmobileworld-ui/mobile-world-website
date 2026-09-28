import Link from "next/link";
import { sitePages } from "@/data/pages";
import { breadcrumbSchema, jsonLdScript } from "@/data/schema";
import { IconArrow } from "./Icons";

export function MoreLinks({current,heading="आपके काम की और जानकारी"}: {current:string;heading?:string}) {
  const order = current.startsWith("/posts") ? ["/products","/finance","/visit","/contact"] : ["/products","/finance","/visit","/repairing","/contact"];
  const links = order.filter((p) => p !== current).slice(0,3).flatMap((href) => sitePages.filter((p) => p.href === href));
  const me = sitePages.find((p) => p.href === current);
  return <section className="mw-related">{me && <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLdScript(breadcrumbSchema(me.href,me.label))}} />}<h2>{heading}</h2><div>{links.map((p) => <Link key={p.href} href={p.href}><span><b>{p.label}</b><small>{p.blurb}</small></span><IconArrow /></Link>)}</div></section>;
}
