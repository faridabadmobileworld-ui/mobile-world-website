"use client";

import { useState } from "react";
import Link from "next/link";
import { modelEnquiry } from "@/data/catalog";
import { trackAction } from "./WebsiteAnalytics";
import { IconArrow, IconWhatsApp } from "./Icons";

export function PhoneFinder() {
  const [system, setSystem] = useState("any");
  const [priority, setPriority] = useState("everyday");
  const [budget, setBudget] = useState("अभी तय नहीं");
  const [done, setDone] = useState(false);
  const topic = priority === "camera" ? "Camera और video" : priority === "updates" ? "Software support" : "रोज़ का इस्तेमाल";
  return (
    <section className="mw-finder" id="phone-finder" aria-labelledby="finder-title">
      <div className="mw-finder-intro">
        <p className="shopping-overline">PHONE FINDER · आपकी पसंद</p>
        <h2 id="finder-title">इतने सारे phones?<br /><span>चुनना आसान करें।</span></h2>
        <p>अपनी ज़रूरत बताइए। अपनी प्राथमिकता समझिए और हमारी team से अपने budget में उपलब्ध options पूछिए।</p>
        <span className="mw-small">01 ज़रूरत चुनिए · 02 ज़रूरी बातें समझिए · 03 बात कीजिए</span>
      </div>
      <div className="mw-finder-form">
        <form onSubmit={(event) => { event.preventDefault(); trackAction("finder", `${system} · ${priority} · ${budget}`); setDone(true); }}>
          <label>आपका budget<select value={budget} onChange={(e) => {setBudget(e.target.value);setDone(false);}}>
            {["अभी तय नहीं", "₹15,000 तक", "₹15,000–₹25,000", "₹25,000–₹40,000", "₹40,000 से ज़्यादा"].map((v) => <option key={v}>{v}</option>)}
          </select></label>
          <div className="mw-form-row">
            <label>आपके लिए ज़रूरी<select value={priority} onChange={(e) => {setPriority(e.target.value);setDone(false);}}>
              <option value="everyday">रोज़ का इस्तेमाल</option><option value="camera">Camera और video</option><option value="updates">Software support</option>
            </select></label>
            <label>आपकी पसंद<select value={system} onChange={(e) => {setSystem(e.target.value);setDone(false);}}>
              <option value="any">सभी options</option><option value="Android">Android</option><option value="iOS">iPhone</option>
            </select></label>
          </div>
          <button className="shopping-primary" type="submit">मेरी ज़रूरत समझिए <IconArrow /></button>
        </form>
        {done && <div className="mw-finder-results" aria-live="polite">
          <h3>{topic} · आपकी पसंद</h3>
          <p>{priority === "camera" ? "Camera चुनते समय सिर्फ़ megapixels नहीं—photo samples, video stabilisation, zoom और low-light performance भी देखिए।" : priority === "updates" ? "Software support की अवधि launch से गिनी जाती है। Security updates और OS upgrades की घोषित policy model के अनुसार जाँचिए।" : "रोज़ के इस्तेमाल के लिए battery, display की readability, storage, grip और आपकी apps का अनुभव साथ में देखिए।"}</p>
          <p className="mw-small">आपका budget: {budget} · पसंद: {system === "any" ? "सभी options" : system}। Verified model information पूरी होने तक यह personalised model ranking नहीं है।</p>
          <Link href={system === "iOS" ? "/products?brand=apple#smartphones" : "/products#smartphones"} className="mw-text-link">Website पर models देखिए <IconArrow /></Link>
          <a className="mw-text-link" href={modelEnquiry([], `मेरा budget: ${budget}। प्राथमिकता: ${topic}। पसंद: ${system}। कृपया उपयुक्त उपलब्ध models बताइए।`)} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> अपनी ज़रूरत पर सलाह लीजिए</a>
        </div>}
      </div>
    </section>
  );
}
