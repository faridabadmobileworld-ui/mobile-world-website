import type { Metadata } from "next";
import { shop } from "@/data/shop";
import { Banner } from "@/components/Banner";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { PageFoot } from "@/components/PageFoot";
import { FollowUs } from "@/components/FollowUs";
import { MoreLinks } from "@/components/MoreLinks";

export const metadata: Metadata = {
  title: "हमारी Team",
  description:
    `${shop.name} ${shop.address.locality} की team से मिलिए। Tarun Gupta जी की ` +
    `direct guidance में काम करने वाली team, जो हमेशा आपकी service के लिए तैयार है।`,
  alternates: { canonical: "/team" },
};

const toc: TocItem[] = [
  { id: "samarpan", label: "हमारी Team का समर्पण और आपका भरोसा" },
  { id: "leadership", label: "Leadership — Tarun Gupta जी" },
  { id: "values", label: "हमारी Team के Core Values" },
];

export default function Team() {
  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 10px" }}>
          हमारी Team — वो चेहरे जो {shop.name} की असली ताक़त हैं ❤️
        </h1>
        <TableOfContents items={toc} />

        <div className="prose">
          <p>
            एक बेहतरीन business सिर्फ़ walls या counters से नहीं बनता, उसे बनाने
            वाले लोगों के dedication से बनता है।
          </p>
          <p>
            जब आप {shop.address.locality} की हमारी दुकान पर आते हैं, तो आपको वही
            जाने-पहचाने चेहरे और अपनापन हमेशा मिलेगा।
          </p>
        </div>
      </section>

      <section className="sec">
        <Banner src="/images/mobile-world-team-people-behind-our-promise-v2-5f1d17e7.webp"
          alt={`${shop.name} की team — ${shop.address.road}, ${shop.address.locality}, ${shop.address.city} के showroom counter पर`} />
      </section>

      <section className="sec">
        <div className="prose">
          <h2 id="samarpan">हमारी Team का समर्पण और आपका भरोसा</h2>
          <p>
            हम दिल से अपनी entire team का शुक्रिया अदा करते हैं, जो रोज़ सुबह से
            रात तक पूरी honesty और energy के साथ customers की service में लगी रहती है।
          </p>
          <p>
            उनका यह प्यार और hard work ही है, जिसकी वजह से {shop.name} आज
            {" "}{shop.address.city} में लोगों की पहली पसंद बना हुआ है।
          </p>

          <h2 id="leadership">Leadership और Direct Oversight — Tarun Gupta जी</h2>
          <p>
            हमारे business की सबसे बड़ी ताक़त इसकी transparency और personal
            connection है।
          </p>
          <p>
            प्रोपराइटर <strong>{shop.owner} जी</strong> की direct guidance में हमारी
            पूरी team काम करती है। आपको किसी unknown call centre के चक्कर में नहीं
            पड़ना पड़ता।
          </p>
          <p>
            हर सवाल और हर support का जवाब आपको सीधे हमारे counter पर मिलता है।
          </p>

          <h2 id="values">हमारी Team के Core Values</h2>
          <ul>
            <li>
              <strong>Genuine Guidance:</strong> हमारी team कभी भी आपको extra sales
              के लिए ग़लत product recommend नहीं करती। आपकी असल ज़रूरत ही हमारी
              priority होती है।
            </li>
            <li>
              <strong>Warm और Friendly Approach:</strong> दुकान पर आने वाले हर
              customer को एक family member जैसा respect और comfort मिलता है।
            </li>
            <li>
              <strong>Complete After-Sale Support:</strong> सामान ख़रीदने के बाद data
              transfer, settings या चाहे किसी भी तरीक़े की support की ज़रूरत हो,
              हमारी team हमेशा ready रहती है।
            </li>
          </ul>

          <p style={{ marginTop: 18 }}>
            आइए, {shop.address.road} पर हमारी दुकान के counter पर मिलिए। हमारी पूरी
            team आपका हमेशा दिल से स्वागत करती है!
          </p>
        </div>
      </section>

      <MoreLinks current="/team" />
      <PageFoot />
      <FollowUs />
    </div>
  );
}
