import type { Metadata } from "next";
import { shop } from "@/data/shop";
import { ask } from "@/data/content";
import { Banner } from "@/components/Banner";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { PageFoot } from "@/components/PageFoot";
import { FollowUs } from "@/components/FollowUs";
import { MoreLinks } from "@/components/MoreLinks";
import { IconWhatsApp, IconPhone } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Mobile Repairing Services",
  description:
    `${shop.address.locality}, ${shop.address.city} में mobile repairing। Screen, ` +
    `battery, charging port और software की दिक़्क़त के लिए दुकान पर आइए।`,
  alternates: { canonical: "/repairing" },
};

const toc: TocItem[] = [
  { id: "list", label: "हमारी Repairing Services की पूरी list" },
  { id: "approach", label: "हमारा Repairing Approach — 100% Transparency" },
  { id: "aaiye", label: "अपने phone को लेकर सीधे दुकान पर आइए" },
];

export default function Repairing() {
  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 10px" }}>
          Mobile Repairing Services — भरोसेमंद और expert technical solutions ❤️
        </h1>
        <TableOfContents items={toc} />

        <div className="prose">
          <p>
            जब आपका phone अचानक ख़राब हो जाता है, तो सिर्फ़ repairing नहीं, बल्कि एक
            honest और reliable tech support की ज़रूरत होती है।
          </p>
          <p>
            {shop.name} की दुकान पर आपको phone repairing के लिए हमेशा एक transparent
            और professional service मिलती है।
          </p>
        </div>
      </section>

      <section className="sec">
        <Banner src="/images/expert-mobile-repairing-at-mobile-world-f65f73a0.webp"
          alt={`${shop.name} पर mobile repairing और technical service counter — ${shop.address.locality}, ${shop.address.city}`} />
      </section>

      <section className="sec">
        <div className="prose">
          <h2 id="list">हमारी Repairing Services की पूरी list</h2>
          <p>
            {shop.address.locality} की हमारी दुकान पर skilled technicians द्वारा इन
            सभी technical issues को fix किया जाता है:
          </p>
          <ul>
            <li>
              <strong>Screen और Display Replacement:</strong> टूटी touch screen,
              damaged LCD या display में lines आने पर high-quality screens की
              replacement।
            </li>
            <li>
              <strong>Battery Replacement और Power Issues:</strong> Phone जल्दी
              discharge होना, charging slow होना या phone अचानक बंद पड़ने पर reliable
              battery installation।
            </li>
            <li>
              <strong>Charging Port और Flex Cable Repair:</strong> Type-C या micro-USB
              charging port ढीला होने, या data sync न होने की problem का solution।
            </li>
            <li>
              <strong>Speaker, Mic और Audio Issues:</strong> Call के दौरान आवाज़ न
              आने, mic फटने या speaker dead होने पर proper repairing।
            </li>
            <li>
              <strong>Camera Repair और Glass Change:</strong> Front या back camera का
              focus issue, blurry photos, या camera lens का glass crack होने पर
              replacement।
            </li>
            <li>
              <strong>Advanced IC-Level और Motherboard Repairs:</strong> Dead phone
              recovery, short-circuit issues और complex IC-level motherboard
              troubleshooting (skilled micro-soldering support)।
            </li>
            <li>
              <strong>Software Troubleshooting:</strong> Boot loop, hanging issues,
              software updating और OS crash जैसी software problems का solution।
            </li>
          </ul>

          <h2 id="approach">हमारा Repairing Approach — 100% Transparency</h2>
          <p>
            हम कभी भी आपको hidden charges या ग़ैर-ज़रूरी repairs के बारे में mislead
            नहीं करते:
          </p>
          <p>
            Repairing शुरू होने से पहले आपको exact issue, estimated cost और लगने वाले
            समय की पूरी जानकारी दी जाती है।
          </p>
          <p>
            आपकी permission के बाद ही काम शुरू होता है, ताकि आपको हमेशा complete
            peace of mind मिले।
          </p>
          <p>
            ⚠️ ध्यान दीजिए — अगर आपका device अभी <strong>brand warranty के अंदर</strong> है,
            तो उसका warranty वाला काम brand के authorized service centre पर ही होता है।
            वहाँ पहुँचने और बात बनवाने में हम आपकी मदद कर देंगे।
          </p>

          <h2 id="aaiye">अपने phone को लेकर सीधे दुकान पर आइए</h2>
          <p>
            अगर आपके smartphone में किसी भी तरह का hardware या software issue है, तो
            ज़्यादा सोचने के बजाय सीधे {shop.address.road} वाली हमारी दुकान पर ले आइए।
          </p>
          <p>
            हमारी team आपके phone को पूरी care के साथ ठीक करने के लिए हमेशा ready है!
          </p>

          <div className="btns" style={{ marginTop: 18 }}>
            <a className="btn btn-w" href={ask("repairing")} target="_blank" rel="noopener">
              <IconWhatsApp /> Repairing के बारे में पूछिए
            </a>
            <a className="btn btn-d" href={shop.phone.tel}>
              <IconPhone /> {shop.phone.display}
            </a>
          </div>
        </div>
      </section>

      <MoreLinks current="/repairing" />
      <PageFoot />
      <FollowUs />
    </div>
  );
}
