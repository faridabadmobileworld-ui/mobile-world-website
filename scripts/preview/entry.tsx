/**
 * एक ही file वाले preview का दिल।
 *
 * यह असली website के वही components चलाता है जो Vercel पर जाएँगे — कुछ
 * दोबारा नहीं लिखा गया। सिर्फ़ चार चीज़ें बदली हैं (next/image, next/link,
 * next/navigation, next/dynamic), क्योंकि वो चारों Next.js के server के बिना
 * नहीं चलतीं। बदलाव `shims/` folder में हैं।
 *
 * इसे `node scripts/build-3d-preview.mjs` एक HTML file में बदल देता है।
 */

import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

// यह बनावटी नाम है — build करते वक़्त असली .wasm file यहाँ आ जाती है
// (देखिए scripts/build-3d-preview.mjs का next-shims plugin)
import wasmBytes from "mw:rapier-wasm";

import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyContactBar from "@/components/StickyContactBar";

import Home from "@/app/page";
import Products from "@/app/products/page";
import VisitUs from "@/app/visit-us/page";
import About from "@/app/about/page";
import Contact from "@/app/contact/page";
import NotFound from "@/app/not-found";

import { usePathname } from "./shims/navigation";

const ROUTES: Record<string, () => React.JSX.Element> = {
  "/": Home,
  "/products": Products,
  "/visit-us": VisitUs,
  "/about": About,
  "/contact": Contact,
};

function App() {
  const path = usePathname();
  const Page = ROUTES[path] ?? NotFound;

  /*
    Page बदलने पर GSAP को दोबारा नापने के लिए कहना पड़ता है, वरना वो पुराने
    page की लंबाई याद रखता है और 3D वाला हिस्सा ग़लत जगह चलने लगता है।
  */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const t = setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => clearTimeout(t);
  }, [path]);

  return (
    <>
      <SiteNav />
      <Page />
      <SiteFooter />
      <StickyContactBar />
    </>
  );
}

/*
  Rapier का physics engine WebAssembly में लिखा है। असली website पर Next.js
  वो file अलग से भेजता है; यहाँ वो इसी file के अंदर है, इसलिए उसे ख़ुद
  शुरू करना पड़ता है — React खड़ा होने से पहले।
*/
async function start() {
  try {
    /*
      rapier की types कहती हैं कि init() कुछ नहीं लेता, पर असल code
      wasm की bytes लेता है (हमने ख़ुद पढ़कर देखा)। असली website पर
      Next.js यह file अलग भेजता है, इसलिए वहाँ ज़रूरत नहीं पड़ती।
    */
    const init = RAPIER.init as unknown as (opts: {
      module_or_path: Uint8Array;
    }) => Promise<unknown>;
    await init({ module_or_path: wasmBytes });
  } catch (err) {
    // physics न चले तो भी बाक़ी website चलनी चाहिए
    console.warn("physics शुरू नहीं हो सका:", err);
  }

  const host = document.getElementById("mw-root");
  if (!host) return;
  createRoot(host).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void start();
