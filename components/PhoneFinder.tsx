"use client";

import { useState } from "react";
import Link from "next/link";
import { recommendPhones, modelEnquiry } from "@/data/catalog";
import { IconArrow, IconWhatsApp } from "./Icons";

export function PhoneFinder() {
  const [system, setSystem] = useState("any");
  const [priority, setPriority] = useState("everyday");
  const [budget, setBudget] = useState("अभी तय नहीं");
  const [done, setDone] = useState(false);
  const found = recommendPhones(system, priority);
  return (
    <section className="mw-finder" id="phone-finder" aria-labelledby="finder-title">
      <div className="mw-finder-intro">
        <p className="shopping-overline">PHONE FINDER · आपकी पसंद</p>
        <h2 id="finder-title">इतने सारे phones?<br /><span>चुनना आसान करें।</span></h2>
        <p>अपनी ज़रूरत बताइए। कुछ models की खूबियाँ देखिए, फिर हमारी team से अपने budget में उपलब्ध options पूछिए।</p>
        <span className="mw-small">01 ज़रूरत चुनिए · 02 Models देखिए · 03 बात कीजिए</span>
      </div>
      <div className="mw-finder-form">
        <form onSubmit={(event) => { event.preventDefault(); setDone(true); }}>
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
          <button className="shopping-primary" type="submit">मेरे लिए models देखिए <IconArrow /></button>
        </form>
        {done && <div className="mw-finder-results" aria-live="polite">
          <h3>आपकी ज़रूरत से जुड़े {found.length} options</h3>
          <p className="mw-small">यह features के आधार पर शुरुआती list है। आपके budget में दाम और stock की पुष्टि team करेगी।</p>
          {found.map((p) => <Link key={p.id} href={`/products?model=${p.id}`}><span><b>{p.brand} {p.name}</b><small>{p.reasons[priority]}</small></span><IconArrow /></Link>)}
          <a className="mw-text-link" href={modelEnquiry(found, `मेरा budget: ${budget}। मेरी प्राथमिकता: ${priority === "camera" ? "Camera और video" : priority === "updates" ? "Software support" : "रोज़ का इस्तेमाल"}। कृपया इस budget में उपलब्ध models बताइए।`)} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> Budget के हिसाब से पूछिए</a>
        </div>}
      </div>
    </section>
  );
}
