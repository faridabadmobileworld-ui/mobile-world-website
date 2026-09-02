import type { Metadata } from "next";
import Link from "next/link";
import { shop } from "@/data/shop";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { MoreLinks } from "@/components/MoreLinks";
import { PageFoot, Byline } from "@/components/PageFoot";
import { FollowUs } from "@/components/FollowUs";

export const metadata: Metadata = {
  title: "Terms & Conditions — दुकान के नियम",
  description:
    `${shop.name} ${shop.address.locality} के नियम और शर्तें — bill, brand ` +
    `warranty, exchange, delivery और timing की पूरी जानकारी।`,
  alternates: { canonical: "/terms" },
};

const toc: TocItem[] = [
  { id: "website", label: "Website सिर्फ़ जानकारी के लिए है" },
  { id: "price", label: "दाम, offer और stock" },
  { id: "bill", label: "पक्का bill और genuine सामान" },
  { id: "warranty", label: "Brand warranty और service" },
  { id: "exchange", label: "Return, Refund और Exchange" },
  { id: "delivery", label: "Delivery की शर्तें" },
  { id: "timing", label: "खुलने और बंद होने का समय" },
  { id: "ipr", label: "Content किसका है" },
  { id: "jaankari", label: "जानकारी में ग़लती या बदलाव" },
  { id: "kanoon", label: "क़ानूनी अधिकार क्षेत्र" },
  { id: "badlav", label: "इन शर्तों में बदलाव" },
  { id: "contact", label: "हमसे संपर्क कीजिए" },
];

export default function Terms() {
  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 10px" }}>
          Terms &amp; Conditions — हमारे नियम, आपका और हमारा साफ़ रिश्ता 📜
        </h1>
        <TableOfContents items={toc} />

        <div className="prose">
          <p>
            {shop.name} ({shop.address.locality}, {shop.address.city}) की website पर
            आपका स्वागत है।
          </p>
          <p>
            दुकान पर आने से पहले कृपया ये नियम और शर्तें एक बार पढ़ लीजिए। यहाँ हमारे
            काम करने का तरीक़ा, नियम और आपकी ज़िम्मेदारियाँ — सब साफ़-साफ़ लिखी हैं।
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="prose">
          <h2 id="website">1. Website सिर्फ़ जानकारी के लिए है</h2>
          <ul>
            <li>
              यह website ({shop.siteUrl.replace("https://", "")}) पूरी तरह जानकारी
              देने के लिए है।
            </li>
            <li>
              यहाँ <strong>कोई online ख़रीद-बिक्री या payment gateway नहीं है</strong>।
              न कोई cart, न कोई checkout।
            </li>
            <li>
              हर पूछताछ, stock check और ख़रीदारी सीधे {shop.address.road} वाली दुकान
              के counter पर, या हमारे WhatsApp / Call ({shop.phone.display}) पर होती है।
            </li>
          </ul>

          <h2 id="price">2. दाम, offer और stock</h2>
          <ul>
            <li>
              Smartphone, laptop और appliances के दाम market के हिसाब से बदलते रहते
              हैं। इसीलिए इस website पर कोई दाम नहीं लिखा जाता।
            </li>
            <li>
              आने से पहले WhatsApp पर product का नाम भेज दीजिए — हम बता देंगे कि वो
              आज दुकान पर मौजूद है या नहीं, ताकि आपका चक्कर बेकार न जाए।
            </li>
            <li>
              किसी भी सामान का दाम और उपलब्धता बिना बताए बदल सकती है।
            </li>
            <li>
              Website या social media पर कभी कोई offer दिखे, तो भी पक्का दाम और
              उपलब्धता वही होती है जो <strong>उस दिन counter पर</strong> लागू हो।
            </li>
          </ul>

          <h2 id="bill">3. पक्का bill और genuine सामान</h2>
          <ul>
            <li>
              दुकान पर मिलने वाला हर सामान <strong>पक्के GST Bill</strong> के साथ मिलता है।
            </li>
            <li>
              हम बिना bill या बिना पहचान वाले सामान में सौदा नहीं करते।
            </li>
            <li>
              <strong>Bill सँभालकर रखिए।</strong> Warranty, exchange और service —
              तीनों में वही काम आता है।
            </li>
          </ul>

          <h2 id="warranty">4. Brand warranty और service</h2>
          <ul>
            <li>
              दुकान पर बिकने वाले हर branded सामान पर <strong>बनाने वाली company
              (brand) की अपनी official warranty</strong> लागू होती है।
            </li>
            <li>
              अगर सामान में कोई manufacturing defect आता है, तो उसका official हल
              {" "}<strong>brand के authorized service centre</strong> के नियमों के
              हिसाब से ही मिलता है — दुकान से नहीं।
            </li>
            <li>
              छोटी-मोटी मदद, guidance और service centre तक पहुँचाने में हमारी team
              हमेशा counter पर मौजूद है।
            </li>
            <li>
              <strong>Warranty कब ख़त्म हो जाती है:</strong> सामान गिरने-टूटने
              (physical damage), पानी लगने, या किसी बाहर वाली जगह से खुलवा लेने पर
              brand की warranty अपने आप ख़त्म हो जाती है। यह नियम brand का है।
            </li>
            <li>
              EMI और finance की शर्तें अलग हैं — वो{" "}
              <Link href="/finance" style={{ color: "var(--brand)", fontWeight: 700 }}>
                Finance और EMI
              </Link>{" "}
              वाले page पर लिखी हैं।
            </li>
          </ul>

          <h2 id="exchange">5. Return, Refund और Exchange</h2>
          <p>
            सामान वापस करने, पैसे लौटने, डिब्बा खोलते ही ख़राबी निकलने (DOA) और पुराने
            phone के exchange — इन सबके पूरे नियम अलग page पर एक जगह लिखे हैं, ताकि
            ढूँढ़ना न पड़े:
          </p>
          <p>
            <Link href="/returns" style={{ color: "var(--brand)", fontWeight: 700 }}>
              Return, Refund और Exchange के नियम देखिए →
            </Link>
          </p>

          <h2 id="delivery">6. Delivery की शर्तें</h2>
          <ul>
            <li>
              {shop.address.city} में delivery की सुविधा है।
            </li>
            <li>
              <strong>Delivery मुफ़्त नहीं है।</strong> उसका ख़र्च ग्राहक को ही देना
              होता है।
            </li>
            <li>
              Auto-rickshaw या जो भी साधन ठीक रहे, उसका इंतज़ाम हम करवा देते हैं —
              भाड़ा ग्राहक देता है।
            </li>
            <li>
              कितना ख़र्च आएगा, यह दूरी और सामान पर तय होता है। पहले WhatsApp पर पूछ
              लीजिए।
            </li>
          </ul>

          <h2 id="timing">7. खुलने और बंद होने का समय</h2>
          <ul>
            <li>
              <strong>रोज़ सुबह 10:00 बजे से रात 10:00 बजे तक, सातों दिन।</strong>
            </li>
            <li>
              दुकान <strong>हर महीने की आख़िरी तारीख़</strong> को बंद रहती है — 28,
              29, 30 या 31, जो भी उस महीने की आख़िरी हो।
            </li>
            <li>
              किसी ख़ास छुट्टी की जानकारी के लिए WhatsApp पर पूछ लीजिए।
            </li>
          </ul>

          <h2 id="ipr">8. Content किसका है</h2>
          <ul>
            <li>
              इस website का सारा content, text, तस्वीरें और branding
              {" "}{shop.name} और proprietor {shop.owner} की संपत्ति है।
            </li>
            <li>
              बिना लिखित इजाज़त के इसे किसी दूसरी commercial website या platform पर
              इस्तेमाल करना मना है।
            </li>
          </ul>

          <h2 id="jaankari">9. जानकारी में ग़लती या बदलाव</h2>
          <ul>
            <li>
              हम पूरी कोशिश करते हैं कि website पर लिखी हर बात सही हो।
            </li>
            <li>
              फिर भी कहीं लिखने में ग़लती रह जाए, या brand अपनी तरफ़ से कुछ बदल दे, तो
              हम उस जानकारी को बिना पहले बताए ठीक कर सकते हैं।
            </li>
          </ul>

          <h2 id="kanoon">10. क़ानूनी अधिकार क्षेत्र</h2>
          <ul>
            <li>
              हमारे कारोबार से जुड़ा कोई भी विवाद हो, तो उस पर सुनवाई
              {" "}<strong>{shop.address.city}, {shop.address.state}</strong> के
              न्यायक्षेत्र में ही होगी।
            </li>
          </ul>

          <h2 id="badlav">11. इन शर्तों में बदलाव</h2>
          <ul>
            <li>
              कारोबार की ज़रूरत या क़ानूनी नियमों के हिसाब से हम इन शर्तों को
              समय-समय पर बदल सकते हैं।
            </li>
            <li>कोई भी बदलाव सबसे पहले इसी page पर दिखेगा।</li>
          </ul>

          <h2 id="contact">12. हमसे संपर्क कीजिए</h2>
          <p>
            इन शर्तों को लेकर कोई सवाल हो तो सीधे हमसे जुड़िए:
          </p>
          <p>
            <strong>Proprietor:</strong> {shop.owner}<br />
            <strong>Call / WhatsApp:</strong>{" "}
            <a href={shop.phone.tel} style={{ color: "var(--brand)", fontWeight: 700 }}>
              {shop.phone.display}
            </a><br />
            <strong>पता:</strong> {shop.address.street}, {shop.address.landmark},
            {" "}{shop.address.locality}, {shop.address.city}, {shop.address.state},
            {" "}India – {shop.address.postalCode}
          </p>
        </div>
      </section>

      <Byline />

      <MoreLinks current="/terms" />
      <PageFoot />
      <FollowUs />
    </div>
  );
}
