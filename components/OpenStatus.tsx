"use client";

import { useEffect, useState } from "react";
import { getOpenState, type OpenState } from "@/data/hours";

/**
 * "अभी खुला है" / "अभी बंद है" वाला badge।
 *
 * यह browser में चलता है क्योंकि page पहले से बनकर तैयार रहता है (तेज़ी के
 * लिए) — उसमें time जमा देना गलत होगा। समय हमेशा भारत का लिया जाता है।
 */
export default function OpenStatus() {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const update = () => setState(getOpenState(new Date()));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!state) {
    return <span className="block h-8" aria-hidden="true" />;
  }

  const isOpen = state.status === "open";

  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-sm ${
        isOpen
          ? "border-whatsapp/40 bg-whatsapp/10 text-whatsapp"
          : "border-line bg-surface/60 text-muted"
      }`}
    >
      <span className="relative flex h-2 w-2">
        {isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            isOpen ? "bg-whatsapp" : "bg-muted"
          }`}
        />
      </span>
      {isOpen
        ? `अभी खुला है · ${state.closesAt} तक`
        : state.reason === "monthly"
          ? "आज बंद है · महीने की आख़िरी तारीख़"
          : "अभी बंद है"}
    </span>
  );
}
