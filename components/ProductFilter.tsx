"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ask } from "@/data/content";
import { IconWhatsApp } from "./Icons";

/** Cards remain server-rendered. URL query changes filter them after hydration. */
export function ProductFilter() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const [hits, setHits] = useState<number | null>(null);

  useEffect(() => {
    // Query changes on this same page must update the visible products too.
    const frame = requestAnimationFrame(() => setHits(applyFilter(q)));
    return () => cancelAnimationFrame(frame);
  }, [q]);

  if (!q) {
    return (
      <p style={{ color: "var(--ink-2)", maxWidth: "62ch", margin: "0 0 6px" }}>
यहाँ दुकान का पूरा सामान एक जगह है। जो चाहिए उसका नाम WhatsApp पर भेज दीजिए —
        हम बता देंगे कि वो मौजूद है या नहीं, और आपके काम का कौन सा model रहेगा।
      </p>
    );
  }

  return (
    <div className="searchnote">
      <span>
        {hits
          ? `“${q}” के लिए ${hits} चीज़${hits === 1 ? "" : "ें"} मिलीं।`
          : `“${q}” के लिए कुछ नहीं मिला। WhatsApp पर पूछ लीजिए, शायद दुकान पर हो।`}
      </span>
      <Link className="btn btn-o btn-s" href="/products">साफ़ कीजिए</Link>
      {!hits && (
        <a className="btn btn-w btn-s" href={ask(q)} target="_blank" rel="noopener">
          <IconWhatsApp /> पूछिए
        </a>
      )}
    </div>
  );
}

/** Cards chhupata/dikhata hai aur kitne mile wo batata hai. */
function applyFilter(term: string): number {
  const words = term.toLowerCase().split(/\s+/).filter(Boolean);
  const cards = [...document.querySelectorAll<HTMLElement>("[data-search]")];
  let hits = 0;

  for (const card of cards) {
    const match = words.every((word) => (card.dataset.search ?? "").includes(word));
    card.hidden = !match;
    if (match) hits++;
  }

  // Jis category mein ek bhi card nahi bacha, uska heading bhi chhupa do.
  for (const sec of document.querySelectorAll<HTMLElement>("section.sec[id]")) {
    const inSec = [...sec.querySelectorAll<HTMLElement>("[data-search]")];
    if (inSec.length) sec.hidden = !inSec.some((c) => !c.hidden);
  }

  return hits;
}

