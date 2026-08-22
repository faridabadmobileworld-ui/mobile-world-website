"use client";

import { useEffect, useState } from "react";
import { getOpenState, type OpenState } from "@/data/hours";

/**
 * "अभी खुला है" / "अभी बंद है" वाला badge।
 *
 * यह इकलौता हिस्सा है जो browser में चलता है। वजह: page पहले से बनकर तैयार
 * रहता है (तेज़ी के लिए), तो उसमें time जमा देना गलत होगा — customer रात को
 * खोले और उसे सुबह वाला जवाब दिखे, यह नहीं होना चाहिए।
 *
 * Page खुलने पर पहले कुछ नहीं दिखता, फिर badge आ जाता है। इससे speed पर
 * कोई असर नहीं पड़ता।
 */
export default function OpenStatus() {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const update = () => setState(getOpenState(new Date()));
    update();
    // हर मिनट दोबारा जाँचो, ताकि page खुला रहने पर भी badge सही रहे।
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!state) {
    // Badge आने तक जगह ख़ाली रखो — page हिलना नहीं चाहिए।
    return <span className="block h-7" aria-hidden="true" />;
  }

  const isOpen = state.status === "open";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
        isOpen ? "bg-green-100 text-green-900" : "bg-gray-100 text-gray-700"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${isOpen ? "bg-green-600" : "bg-gray-500"}`}
        aria-hidden="true"
      />
      {isOpen
        ? `अभी खुला है · ${state.closesAt} तक`
        : state.reason === "monthly"
          ? "आज बंद है · महीने की आख़िरी तारीख़"
          : "अभी बंद है"}
    </span>
  );
}
