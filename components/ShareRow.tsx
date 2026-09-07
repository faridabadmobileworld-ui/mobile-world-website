"use client";

/**
 * "यह post किसी को भेजिए" — एक click में।
 *
 * Owner ने 7 Sep 2026 को कहा: पढ़ने वाला एक ही click में किसी को भी भेज सके।
 *
 * ⚠️ Instagram एक असली अड़चन है, और इसे छुपाया नहीं गया:
 * WhatsApp और Facebook दोनों के पास "यह link भेजो" वाला अपना पता होता है,
 * इसलिए वो सीधे link हैं — बिना JavaScript के भी चलते हैं।
 * **Instagram ऐसा कोई पता देता ही नहीं।** किसी website का link Instagram पर
 * सीधे नहीं भेजा जा सकता — यह Instagram का अपना नियम है, हमारी कमी नहीं।
 *
 * इसलिए Instagram वाला बटन वही करता है जो सबसे अच्छा हो सकता है:
 *   • Phone पर  → phone की अपनी "भेजिए" वाली list खोल देता है
 *                 (`navigator.share`), जिसमें Instagram भी होता है।
 *   • Computer पर → link copy कर देता है, ताकि Instagram में चिपका दिया जाए।
 *
 * कोई tracking नहीं, कोई बाहरी script नहीं — सिर्फ़ सादे link और browser
 * का अपना share। Privacy page पर जो लिखा है, यह उससे टकराता नहीं।
 */

import { useState } from "react";
import { IconWhatsApp, IconFacebook, IconInstagram, IconLink, IconCheck } from "./Icons";

export function ShareRow({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard बंद हो (पुराना browser, या बिना https) तो चुपचाप रहिए —
      // WhatsApp और Facebook वाले बटन तब भी चलते हैं।
    }
  }

  async function shareAnywhere() {
    // `navigator.share` की जाँच click के वक़्त होती है, render के वक़्त नहीं —
    // इससे server और browser का HTML एक जैसा रहता है, कोई hydration की
    // चेतावनी नहीं आती, और एक बेकार का state भी नहीं रखना पड़ता।
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // उपयोगकर्ता ने रद्द कर दिया, या share नहीं हो पाया — नीचे copy।
      }
    }
    await copyLink();
  }

  const waText = encodeURIComponent(`${title}\n${url}`);

  return (
    <div className="shr">
      <b className="shr-h">यह post किसी को भेजिए</b>
      <div className="shr-b">
        <a className="btn btn-w" target="_blank" rel="noopener"
          href={`https://api.whatsapp.com/send?text=${waText}`}>
          <IconWhatsApp /> WhatsApp
        </a>
        <a className="btn btn-fb" target="_blank" rel="noopener"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}>
          <IconFacebook /> Facebook
        </a>
        <button type="button" className="btn btn-ig" onClick={shareAnywhere}>
          <IconInstagram /> Instagram
        </button>
        <button type="button" className="btn btn-o" onClick={copyLink}>
          {copied ? <IconCheck /> : <IconLink />} {copied ? "Link copy हो गया" : "Link copy"}
        </button>
      </div>
      <p className="shr-n">
        Instagram किसी website का link सीधे भेजने नहीं देता — इसलिए वो बटन phone की
        अपनी list खोल देता है, या link copy कर देता है।
      </p>
    </div>
  );
}
