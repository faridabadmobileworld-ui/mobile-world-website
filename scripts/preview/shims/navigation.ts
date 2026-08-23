/**
 * next/link और next/navigation की जगह — सिर्फ़ preview file के लिए।
 *
 * असली website पर हर page का अपना पता होता है (/products, /about ...)।
 * एक ही file वाले preview में server नहीं होता, इसलिए page का पता
 * address bar के "#" के बाद रखा जाता है — जैसे  ...preview#/products
 */

import { useSyncExternalStore } from "react";

/** अभी कौन सा page खुला है। */
export function currentPath(): string {
  if (typeof window === "undefined") return "/";
  const h = window.location.hash.replace(/^#/, "");
  return h.startsWith("/") ? h : "/";
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export function usePathname(): string {
  return useSyncExternalStore(subscribe, currentPath, () => "/");
}

/** दूसरे page पर जाना — Link इसी को बुलाता है। */
export function go(href: string) {
  window.location.hash = href;
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
}
