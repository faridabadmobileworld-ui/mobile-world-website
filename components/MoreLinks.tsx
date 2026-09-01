/**
 * "आगे क्या देखना है?" — हर page के नीचे बाक़ी सारे pages के link।
 *
 * Owner ने 1 Sep 2026 को कहा: हर page से हर दूसरे page पर **एक click में**
 * पहुँचा जाए। इसलिए यह block हर page पर लगता है और `data/pages.ts` से
 * अपने आप बनता है — जिस page पर आप हैं वो अपने आप छूट जाता है।
 *
 * Google को भी यही चाहिए: जो page आपस में जुड़े होते हैं, वो जल्दी और
 * बेहतर index होते हैं।
 */

import Link from "next/link";
import { otherPages } from "@/data/pages";
import { IconArrow } from "./Icons";

export function MoreLinks({
  current,
  heading = "आगे क्या देखना है?",
}: {
  /** इसी page का पता — जैसे "/repairing"। यही list से हट जाएगा। */
  current: string;
  heading?: string;
}) {
  const rest = otherPages(current);

  return (
    <section className="sec">
      <div className="shead"><h2>{heading}</h2></div>
      <ul className="mlinks">
        {rest.map((p) => (
          <li key={p.href}>
            <Link href={p.href} className="rv in">
              <b>{p.label} <IconArrow /></b>
              <s>{p.blurb}</s>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
