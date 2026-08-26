"use client";

import { useEffect, useState } from "react";

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

/** दुकान का समय Asia/Kolkata का है — visitor के phone की घड़ी का नहीं। */
function nowInIST(): Date {
  try {
    const p: Record<string, string> = {};
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata", year: "numeric", month: "numeric", day: "numeric",
      hour: "numeric", minute: "numeric", hour12: false,
    }).formatToParts(new Date()).forEach((x) => { p[x.type] = x.value; });
    return new Date(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute);
  } catch {
    return new Date();
  }
}

type Status = { label: string; open: boolean; nextClosure: string };

function computeStatus(now: Date): Status {
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const closedToday = now.getDate() === last.getDate();
  const hour = now.getHours() + now.getMinutes() / 60;
  const open = !closedToday && hour >= 10 && hour < 22;

  // आज ही आख़िरी तारीख़ है तो अगली छुट्टी अगले महीने की आख़िरी तारीख़ है।
  const next = closedToday
    ? new Date(now.getFullYear(), now.getMonth() + 2, 0)
    : last;

  return {
    open,
    label: closedToday
      ? "आज बंद — महीने की आख़िरी तारीख़"
      : open
        ? "अभी खुली है · रात 10 बजे तक"
        : "अभी बंद है · सुबह 10 बजे खुलेगी",
    nextClosure: `${next.getDate()} ${MONTHS[next.getMonth()]}`,
  };
}

/**
 * JS चलने से पहले neutral text दिखता है — "Open now" तब तक नहीं लिखते
 * जब तक पक्का न हो, वरना रात 2 बजे भी वही दिखेगा।
 */
export function useStoreStatus(): Status | null {
  const [s, setS] = useState<Status | null>(null);
  useEffect(() => {
    const tick = () => setS(computeStatus(nowInIST()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  return s;
}

export function LiveBadge() {
  const s = useStoreStatus();
  return (
    <span className="live">
      <i className={s && !s.open ? "shut" : undefined} />
      <span>{s ? s.label : "रोज़ 10 AM – 10 PM"}</span>
    </span>
  );
}

export function NextClosure() {
  const s = useStoreStatus();
  return <b>{s ? s.nextClosure : "—"}</b>;
}
