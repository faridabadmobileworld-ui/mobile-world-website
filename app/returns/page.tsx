import type { Metadata } from "next";
import Link from "next/link";
import { shop } from "@/data/shop";
import { ask } from "@/data/content";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { MoreLinks } from "@/components/MoreLinks";
import { PageFoot } from "@/components/PageFoot";
import { FollowUs } from "@/components/FollowUs";
import { IconWhatsApp, IconPhone } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Return, Refund और Exchange के नियम",
  description:
    `${shop.name} ${shop.address.locality}, ${shop.address.city} के return, refund ` +
    `और पुराने phone के exchange के नियम — साफ़-साफ़, बिना घुमाए।`,
  alternates: { canonical: "/returns" },
};

const toc: TocItem[] = [
  { id: "return", label: "Return और refund के नियम" },
  { id: "doa", label: "डिब्बा खोलते ही ख़राबी निकले तो" },
  { id: "exchange", label: "पुराने phone के Exchange की शर्तें" },
  { id: "accessories", label: "Accessories और छोटा सामान" },
  { id: "counter", label: "सामान counter पर ही चेक करवा लीजिए" },
];

export default function Returns() {
  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 10px" }}>
          Return, Refund और Exchange — साफ़ बात, पक्का भरोसा 🤝
        </h1>
        <TableOfContents items={toc} />

        <div className="prose">
          <p>
            {shop.name} पर हर सामान seal-pack और पक्के GST bill के साथ मिलता है।
          </p>
          <p>
            Electronics में वापसी और बदलने के नियम सख़्त होते हैं — वो brand बनाती है,
            दुकान नहीं। इसलिए हम शुरू में ही सब साफ़ लिख देते हैं, ताकि बाद में किसी
            को कोई हैरानी न हो।
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="prose">
          <h2 id="return">1. Return और refund के नियम</h2>
          <ul>
            <li>
              <strong>Seal खुलने के बाद</strong> किसी भी नए mobile, laptop या
              electronic सामान का return या पैसे वापस — नहीं हो पाता।
            </li>
            <li>
              सामान बिलकुल ठीक चल रहा है और सिर्फ़ मन बदल गया (रंग पसंद नहीं आया, अब
              दूसरा model लेना है) — तो brand के नियमों के हिसाब से हम उसे न वापस ले
              सकते हैं, न बदल सकते हैं।
            </li>
            <li>
              इसीलिए हम कहते हैं — <strong>ख़रीदने से पहले counter पर आराम से देख
              लीजिए</strong>। जल्दी किसी बात की नहीं है।
            </li>
          </ul>

          <h2 id="doa">2. डिब्बा खोलते ही ख़राबी निकले तो</h2>
          <ul>
            <li>
              नया डिब्बा खोलते ही सामान में कोई बड़ी manufacturing ख़राबी निकल आए, तो
              उसे <strong>Dead on Arrival (DOA)</strong> कहा जाता है।
            </li>
            <li>
              ऐसे में replacement का official रास्ता{" "}
              <strong>brand के authorized service centre</strong> से ही जाता है —
              नियम भी वहीं के लागू होते हैं।
            </li>
            <li>
              हमारा काम इतना है कि आपको इस चक्कर में अकेला न छोड़ें। service centre
              तक बात पहुँचाने और आगे बढ़ाने में हमारी team पूरी मदद करती है। आगे क्या
              होगा, यह फ़ैसला service centre का ही होता है — हम उसका वादा नहीं कर सकते।
            </li>
          </ul>

          <h2 id="exchange">3. पुराने phone के Exchange की शर्तें</h2>
          <ul>
            <li>
              नया phone लेते समय पुराना phone exchange में दिया जा सकता है।
              <strong> Phone चेक करके, उसकी हालत के हिसाब से value लगती है</strong> —
              वो value नए के दाम में से कम हो जाती है और बचे हुए पैसे आप देते हैं।
            </li>
            <li>
              <strong>Bill या original डिब्बा — दोनों में से एक होना ज़रूरी है।</strong>
              {" "}दोनों में से कुछ भी न हो, तो हम वो phone नहीं ले पाएँगे।
            </li>
            <li>
              अपना पहचान पत्र (Aadhaar) भी साथ रखिए — पुराना सामान लेते समय यह
              ज़रूरी होता है।
            </li>
            <li>
              Value phone की हालत पर तय होती है, इसलिए पक्का दाम counter पर आपके
              सामने ही लगेगा।
            </li>
          </ul>

          <h2 id="accessories">4. Accessories और छोटा सामान</h2>
          <ul>
            <li>
              Screen guard, tempered glass, cover, charging cable और बिना warranty
              वाले earphone जैसे छोटे सामान — बिकने के बाद वापस या exchange नहीं होते।
            </li>
            <li>
              इसलिए ये चीज़ें भी counter पर ही लगवा लीजिए या चलाकर देख लीजिए।
            </li>
          </ul>

          <h2 id="counter">5. सामान counter पर ही चेक करवा लीजिए</h2>
          <p>
            हर सामान हम counter पर आपके सामने खोलकर, चलाकर दिखाते हैं। कोई शक हो तो
            वहीं पूछ लीजिए — बाद में परेशान होने से यह हमेशा अच्छा है।
          </p>
          <p>
            इन नियमों को लेकर कुछ भी पूछना हो, तो सीधे बात कर लीजिए:
          </p>

          <div className="btns" style={{ marginTop: 14 }}>
            <a className="btn btn-w" href={ask("Return और Exchange")} target="_blank" rel="noopener">
              <IconWhatsApp /> WhatsApp पर पूछिए
            </a>
            <a className="btn btn-d" href={shop.phone.tel}>
              <IconPhone /> {shop.phone.display}
            </a>
          </div>

          <p style={{ marginTop: 14 }}>
            दुकान के बाक़ी नियम — bill, brand warranty, delivery और timing —{" "}
            <Link href="/terms" style={{ color: "var(--brand)", fontWeight: 700 }}>
              Terms &amp; Conditions
            </Link>{" "}
            पर लिखे हैं।
          </p>
        </div>
      </section>

      <MoreLinks current="/returns" />
      <PageFoot />
      <FollowUs />
    </div>
  );
}
