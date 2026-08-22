import { shop, isClosedOn } from "@/data/shop";

/**
 * दुकान अभी खुली है या नहीं — यह गिनती हमेशा **भारत के समय** से होती है,
 * visitor के फ़ोन के समय से नहीं। वरना कोई विदेश से website खोले तो
 * गलत जवाब मिलेगा।
 */

export type OpenState =
  | { status: "open"; closesAt: string }
  | { status: "closed"; reason: "monthly" | "hours" };

/** किसी भी Date को भारत के समय में बदलकर उसके हिस्से निकालता है। */
function toIndiaTime(now: Date): { date: Date; minutes: number; day: string } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "long",
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  const year = Number(get("year"));
  const month = Number(get("month"));
  const day = Number(get("day"));
  // 24-hour format में आधी रात "24" आ सकती है — उसे 0 मानना है।
  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));

  return {
    // महीने की आख़िरी तारीख़ जाँचने के लिए भारत की तारीख़ चाहिए, UTC की नहीं।
    date: new Date(year, month - 1, day),
    minutes: hour * 60 + minute,
    day: get("weekday"),
  };
}

/** "09:00" को मिनटों में बदलता है — 540. */
function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** "23:00" को "11:00 PM" जैसा पढ़ने लायक़ बनाता है। */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * दिए गए समय पर दुकान खुली है या नहीं।
 * `now` लेता है ताकि इसे test किया जा सके।
 */
export function getOpenState(now: Date): OpenState {
  const india = toIndiaTime(now);

  // पहले महीने की आख़िरी तारीख़ जाँचो — उस दिन time चाहे जो हो, दुकान बंद है।
  if (isClosedOn(india.date)) {
    return { status: "closed", reason: "monthly" };
  }

  const today = shop.openingHours.find((h) => h.day === india.day);
  if (!today) {
    return { status: "closed", reason: "hours" };
  }

  const opens = toMinutes(today.opens);
  const closes = toMinutes(today.closes);

  if (india.minutes >= opens && india.minutes < closes) {
    return { status: "open", closesAt: formatTime(today.closes) };
  }

  return { status: "closed", reason: "hours" };
}
