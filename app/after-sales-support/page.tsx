import type { Metadata } from "next";
import { shop } from "@/data/shop";
import { ask } from "@/data/content";
import { Banner } from "@/components/Banner";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { PageFoot, Byline } from "@/components/PageFoot";
import { FollowUs } from "@/components/FollowUs";
import { IconWhatsApp } from "@/components/Icons";

export const metadata: Metadata = {
  title: "After Sales Service और Support",
  description:
    `${shop.name} ${shop.address.locality} में सामान लेने के बाद भी पूरा support ` +
    `मिलता है। Data transfer, settings और honest guidance के लिए दुकान पर आइए।`,
  alternates: { canonical: "/after-sales-support" },
};

const toc: TocItem[] = [
  { id: "madad", label: "सामान लेने के बाद हम किस तरह मदद करते हैं" },
  { id: "warranty", label: "Brand Warranty और Service Centre — पूरी पारदर्शिता" },
  { id: "vaada", label: "हमारा वादा — honest guidance" },
];

export default function AfterSalesSupport() {
  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 10px" }}>
          After Sales Service और Support — सामान बिकने के बाद भी, हमारा साथ आपके साथ ❤️
        </h1>
        <Byline />
        <TableOfContents items={toc} />

        <div className="prose">
          <p>
            हमारे लिए customer relationship सिर्फ़ तब तक नहीं होता जब तक cash counter
            पर payment होती है।
          </p>
          <p>
            असली business और भरोसा तब शुरू होता है जब आप सामान लेकर घर जाते हैं और
            आपको किसी support की ज़रूरत होती है।
          </p>
        </div>
      </section>

      <section className="sec">
        <Banner src="/images/mobile-world-team-people-behind-our-promise-v2-5f1d17e7.webp"
          alt={`${shop.name} पर customer support और after sales assistance — ${shop.address.road}, ${shop.address.locality}, ${shop.address.city}`} />
      </section>

      <section className="sec">
        <div className="prose">
          <h2 id="madad">सामान लेने के बाद, हम आपकी किस तरह मदद करते हैं?</h2>
          <p>
            जब आप {shop.address.locality} की हमारी दुकान से कोई product ख़रीदते हैं,
            तो हमारी team इन सभी चीज़ों में आपकी पूरी assistance करती है:
          </p>
          <ul>
            <li>
              <strong>Data Transfer और Setup:</strong> पुराने phone से नए phone में
              contacts, photos, WhatsApp chats और सारा data safely transfer करने की
              complete guidance।
            </li>
            <li>
              <strong>Device Settings और Features की मदद:</strong> नए smartphone,
              laptop या home appliance को operate करने और उसकी settings समझने में
              पूरी मदद।
            </li>
            <li>
              <strong>Accessories और Protection:</strong> Screen guard, tempered glass
              और cover की proper fitting, ताकि आपका product पूरी तरह secure रहे।
            </li>
            <li>
              <strong>Friendly Consultation:</strong> product को लेकर आपके मन में कोई
              भी सवाल या confusion हो, तो counter पर आकर honest advice ले सकते हैं।
            </li>
          </ul>

          <h2 id="warranty">Brand Warranty और Service Centre के बारे में पारदर्शिता</h2>
          <p>हम हमेशा अपने customers के साथ 100% transparent रहते हैं:</p>
          <p>
            अगर आपका कोई भी product brand warranty के अंदर है और उसमें hardware या
            software से जुड़ा कोई गंभीर issue आता है, तो उसका official solution
            {" "}<strong>brand के authorized service centre से ही मिलता है</strong>।
          </p>
          <p>
            लेकिन हमारी तरफ़ से यह पक्का वादा है कि service centre पर भी अगर आपको कोई
            issue आता है, तो हम अपनी तरफ़ से आपकी best possible support करवाने और
            मामला हल कराने की पूरी कोशिश करेंगे।
          </p>

          <h2 id="vaada">हमारा वादा — honest guidance और पक्का भरोसा</h2>
          <p>हम कभी भी आपको false promises नहीं करते।</p>
          <p>
            जो support और guidance हमारी दुकान से पूरी honesty के साथ दी जा सकती है,
            उसके लिए हमारी team हमेशा ready है।
          </p>
          <p>
            सामान लेने के बाद किसी भी तरह के support या guidance के लिए सीधे
            {" "}{shop.address.road} वाली हमारी दुकान पर आइए!
          </p>

          <div className="btns" style={{ marginTop: 18 }}>
            <a className="btn btn-w" href={ask("सामान लेने के बाद की support")}
               target="_blank" rel="noopener">
              <IconWhatsApp /> Support के बारे में पूछिए
            </a>
          </div>
        </div>
      </section>

      <PageFoot />
      <FollowUs />
    </div>
  );
}
