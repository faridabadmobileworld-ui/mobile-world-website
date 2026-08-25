"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ask } from "@/data/content";
import { IconWhatsApp } from "./Icons";

/**
 * `?q=` ke hisaab se products chhaanta hai.
 *
 * Saare cards server par hi HTML mein aa jaate hain — Google ko poori
 * list dikhti hai — aur ye component sirf na-milne wale cards chhupa
 * deta hai. Isliye page static rehta hai aur SEO bhi bacha rehta hai.
 *
 * `useSearchParams` jaanbujh kar istemaal nahi kiya: usse ye hissa
 * Suspense mein chala jaata hai aur static HTML khaali reh jaata hai.
 */
export function ProductFilter() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<number | null>(null);

  useEffect(() => {
    const read = () => {
      const term = (new URLSearchParams(location.search).get("q") ?? "").trim();
      setQ(term);
      setHits(applyFilter(term));
    };
    read();
    addEventListener("popstate", read);
    return () => removeEventListener("popstate", read);
  }, []);

  if (!q) {
    return (
      <p style={{ color: "var(--ink-2)", maxWidth: "62ch", margin: "0 0 6px" }}>
        Daam yahaan nahi likhe. Rate roz badalta hai aur bank offers alag-alag hote
        hain — isliye jo chahiye uska naam WhatsApp par bhej dijiye, hum stock aur
        aaj ka rate bata denge.
      </p>
    );
  }

  return (
    <div className="searchnote">
      <span>
        {hits
          ? `${hits} cheez${hits === 1 ? "" : "ein"} mili “${q}” ke liye.`
          : `“${q}” ke liye kuch nahi mila. Stock roz badalta hai — WhatsApp par pooch lijiye.`}
      </span>
      <Link className="btn btn-o btn-s" href="/products">Saaf kijiye</Link>
      {!hits && (
        <a className="btn btn-w btn-s" href={ask(q)} target="_blank" rel="noopener">
          <IconWhatsApp /> Poochhiye
        </a>
      )}
    </div>
  );
}

/** Cards chhupata/dikhata hai aur kitne mile wo batata hai. */
function applyFilter(term: string): number {
  const needle = term.toLowerCase();
  const cards = [...document.querySelectorAll<HTMLElement>("[data-search]")];
  let hits = 0;

  for (const card of cards) {
    const match = !needle || (card.dataset.search ?? "").includes(needle);
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
