"use client";

/**
 * EMI का अंदाज़ा लगाने वाला छोटा सा हिसाब-किताब।
 *
 * ⚠️ यह **सिर्फ़ अंदाज़ा** है। असली किश्त, interest और processing fee finance
 * company या आपका bank तय करता है — दुकान नहीं। इसीलिए यहाँ कोई दर पहले से
 * भरी हुई नहीं है; ग्राहक अपनी दर डालकर देख सकता है, और नीचे साफ़ लिखा है कि
 * यह पक्का दाम नहीं है।
 *
 * (CLAUDE.md §8 — दाम, offer और scheme owner से पूछे बिना कभी मत लिखो।)
 *
 * कोई library नहीं लगी — हिसाब वही आम EMI वाला formula है।
 */

import { useState } from "react";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function EmiCalc() {
  const [amount, setAmount] = useState(20000);
  const [months, setMonths] = useState(9);
  const [rate, setRate] = useState(0);

  const r = rate / 12 / 100;
  const emi = r > 0
    ? (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
    : amount / months;
  const total = emi * months;

  return (
    <div className="emi">
      <div className="emi-in">
        <label>
          <span>कितने का सामान</span>
          <input type="number" min={1000} step={500} inputMode="numeric" value={amount}
                 onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))} />
        </label>
        <label>
          <span>कितने महीने</span>
          <select value={months} onChange={(e) => setMonths(Number(e.target.value))}>
            {[3, 6, 9, 12, 18, 24].map((m) => <option key={m} value={m}>{m} महीने</option>)}
          </select>
        </label>
        <label>
          <span>Interest (सालाना %)</span>
          <input type="number" min={0} max={40} step={0.5} inputMode="decimal" value={rate}
                 onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))} />
        </label>
      </div>

      <output className="emi-out" aria-live="polite">
        <b>₹{inr.format(Math.round(emi))}</b>
        <span>हर महीने, {months} महीने तक</span>
        {rate > 0 && <em>कुल ₹{inr.format(Math.round(total))} — यानी ₹{inr.format(Math.round(total - amount))} ऊपर</em>}
        {rate === 0 && <em>Interest 0 रखा है, इसलिए यह सीधा भाग है</em>}
      </output>

      <p className="fineprint" style={{ margin: "10px 0 0" }}>
        यह सिर्फ़ अंदाज़ा है। असली किश्त, interest और processing fee finance company
        या आपका bank तय करता है — दुकान नहीं। पक्की scheme counter पर system में
        check करके ही बताई जाती है।
      </p>
    </div>
  );
}
