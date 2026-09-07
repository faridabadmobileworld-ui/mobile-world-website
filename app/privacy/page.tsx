import type { Metadata } from "next";
import Link from "next/link";
import { shop } from "@/data/shop";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { MoreLinks } from "@/components/MoreLinks";
import { PageFoot, Byline } from "@/components/PageFoot";
import { FollowUs } from "@/components/FollowUs";

export const metadata: Metadata = {
  title: "Privacy Policy — आपका data सुरक्षित है",
  description:
    `${shop.name} ${shop.address.locality} की Privacy Policy। हम आपके personal ` +
    `data की पूरी respect करते हैं — साफ़ और पारदर्शी नियम।`,
  alternates: { canonical: "/privacy" },
};

const toc: TocItem[] = [
  { id: "collect", label: "हम कौन सी information collect करते हैं?" },
  { id: "use", label: "हम आपके data का use कैसे करते हैं?" },
  { id: "security", label: "Data protection और security" },
  { id: "cookies", label: "Cookies और tracking" },
  { id: "third-party", label: "Third-party links" },
  { id: "rights", label: "आपके अधिकार" },
  { id: "retention", label: "जानकारी कब तक रखी जाती है" },
  { id: "children", label: "बच्चों की जानकारी" },
  { id: "photos", label: "तस्वीरें और नाम" },
  { id: "updates", label: "इस policy में बदलाव" },
  { id: "contact", label: "शिकायत और संपर्क" },
];

export default function Privacy() {
  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 10px" }}>
          Privacy Policy — आपका data, हमारा पारिवारिक भरोसा 🔒
        </h1>
        <TableOfContents items={toc} />

        <div className="prose">
          <p>
            {shop.name} ({shop.address.locality}, {shop.address.city}) में आपका
            स्वागत है।
          </p>
          <p>
            जैसे {shop.legacyStartYear} से हमने आपके परिवार का भरोसा जीता है, वैसे ही
            digital world में भी हम आपकी privacy का पूरा सम्मान करते हैं।
          </p>
          <p>
            यह page आपको साफ़-साफ़ बताने के लिए है कि जब आप हमारी website
            {" "}({shop.siteUrl.replace("https://", "")}) पर आते हैं, तो आपका data कैसे
            संभाला जाता है।
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="prose">
          <h2 id="collect">1. हम कौन सी information collect करते हैं?</h2>
          <p>
            हमारी website पूरी तरह से जानकारी देने के लिए है। हम website के ज़रिए कोई
            online payment या order process नहीं करते।
          </p>
          <p>
            <strong>यह website ख़ुद आपसे कोई जानकारी नहीं लेती।</strong> यहाँ कोई
            contact form नहीं है, कोई account नहीं बनता, और कोई tracking नहीं चलती।
            जो आप हमारे search box में लिखते हैं, वो आपके अपने phone में ही रहता है —
            हम तक नहीं आता।
          </p>
          <p>
            हमें जानकारी सिर्फ़ तब मिलती है जब <strong>आप ख़ुद</strong> हमसे संपर्क
            करते हैं:
          </p>
          <ul>
            <li>
              <strong>आपका नाम और mobile number</strong> — जब आप WhatsApp पर message
              भेजते हैं या call करते हैं।
            </li>
            <li>
              <strong>आपकी ज़रूरत</strong> — किस product या gadget के बारे में आप
              पूछ रहे हैं।
            </li>
            <li>
              <strong>Bill का record</strong> — कुछ ख़रीदने पर GST bill और brand
              warranty के लिए जो जानकारी क़ानूनन ज़रूरी होती है।
            </li>
          </ul>

          <h2 id="use">2. हम आपके data का use कैसे करते हैं?</h2>
          <p>
            आपकी दी हुई जानकारी सिर्फ़ आपकी ही मदद के लिए इस्तेमाल होती है:
          </p>
          <ul>
            <li>आपके WhatsApp message या call का जवाब देने के लिए।</li>
            <li>Stock है या नहीं, यह बताने के लिए।</li>
            <li>Repairing या सामान लेने के बाद की मदद में आपसे बात करने के लिए।</li>
            <li>GST bill और warranty का record रखने के लिए।</li>
          </ul>

          <h2 id="security">3. Data protection और security</h2>
          <p>हम आपकी जानकारी की हिफ़ाज़त को सबसे ऊपर रखते हैं।</p>
          <p>
            आपका mobile number, WhatsApp chat या कोई भी personal जानकारी किसी
            third-party marketing company को <strong>न बेची जाती है, न share की
            जाती है</strong>। वो सिर्फ़ हमारी अपनी team तक सीमित रहती है।
          </p>
          <p>
            ध्यान रहे — WhatsApp और phone call उनकी अपनी apps हैं। वहाँ भेजे गए
            message उनकी अपनी terms के हिसाब से चलते हैं।
          </p>

          <h2 id="cookies">4. Cookies और tracking</h2>
          <p>
            <strong>यह website कोई cookie नहीं बनाती और कोई tracking नहीं चलाती।</strong>
            {" "}न Google Analytics, न Facebook pixel, न किसी और तरह का tracking script।
          </p>
          <p>
            इसका मतलब है कि आपकी browsing history, IP address या location हम इकट्ठा
            नहीं करते। आप यहाँ बिना किसी निशान के आ-जा सकते हैं।
          </p>
          <p>
            आगे कभी हमने analytics लगाया, तो यह बात <strong>पहले इसी page पर</strong>
            {" "}लिखी जाएगी।
          </p>

          <h2 id="third-party">5. Third-party links</h2>
          <p>
            हमारी website पर हमारे social media pages (Instagram, Facebook, YouTube),
            WhatsApp और Google Maps के links हैं।
          </p>
          <p>
            उन links पर click करके आप उन platforms पर चले जाते हैं, जहाँ उनकी अपनी
            privacy policy लागू होती है — हमारी नहीं।
          </p>
          <p>
            <strong>YouTube वाले video:</strong> home page पर video की पट्टी में
            पहले सिर्फ़ एक तस्वीर दिखती है। <strong>जब तक आप play नहीं दबाते, YouTube
            का player चलता ही नहीं</strong> — यानी तब तक कोई cookie नहीं बनती।
            Play दबाने पर video YouTube के <em>no-cookie</em> वाले पते से चलता है।
            तस्वीर ज़रूर YouTube के server से आती है।
          </p>
          <p>
            <strong>एक बात साफ़-साफ़:</strong> home page पर हमारी Instagram वाली पट्टी
            में जो तस्वीरें दिखती हैं, वो सीधे <strong>Instagram के server से</strong>
            {" "}आती हैं। यानी उतनी देर के लिए Instagram को इतना पता चल जाता है कि
            किसी ने वो तस्वीर खोली। यह हमारी तरफ़ से कोई tracking नहीं है — हम अब भी
            आपकी कोई जानकारी इकट्ठा नहीं करते।
          </p>

          <h2 id="rights">6. आपके अधिकार</h2>
          <p>
            भारत के <strong>Digital Personal Data Protection Act, 2023</strong> के
            तहत आपकी जानकारी पर आपके कुछ अधिकार हैं। हम उन्हें पूरा मानते हैं:
          </p>
          <ul>
            <li>
              <strong>जानने का हक़</strong> — हमारे पास आपकी कौन सी जानकारी है, यह
              आप कभी भी पूछ सकते हैं।
            </li>
            <li>
              <strong>सुधरवाने का हक़</strong> — नाम, नंबर या कोई और बात ग़लत लिखी
              गई हो तो ठीक करवा सकते हैं।
            </li>
            <li>
              <strong>हटवाने का हक़</strong> — जो जानकारी क़ानूनन रखना ज़रूरी नहीं है,
              वो हटवा सकते हैं। (GST bill जैसी चीज़ें क़ानून के हिसाब से रखनी पड़ती
              हैं — नीचे अगला हिस्सा देखिए।)
            </li>
            <li>
              <strong>शिकायत का हक़</strong> — कोई दिक़्क़त हो तो सीधे शिकायत कर सकते
              हैं। कहाँ करनी है, यह सबसे नीचे लिखा है।
            </li>
          </ul>
          <p>
            इनमें से कोई भी काम करवाने के लिए बस हमें call या WhatsApp कर दीजिए।
            कोई form भरने या fees देने की ज़रूरत नहीं।
          </p>

          <h2 id="retention">7. जानकारी कब तक रखी जाती है</h2>
          <ul>
            <li>
              <strong>WhatsApp की बातचीत</strong> — जब तक आपका काम चल रहा है, या
              आपके सामान की brand warranty चल रही है। उसके बाद ज़रूरत नहीं रहती।
            </li>
            <li>
              <strong>GST bill और warranty का record</strong> — जितने साल क़ानून
              कहता है, उतने साल। यह हमारी मर्ज़ी की बात नहीं है, GST के नियम में
              लिखा है।
            </li>
            <li>
              <strong>Repair का record</strong> — ताकि वही दिक़्क़त दोबारा आने पर हम
              पिछली बार का काम देख सकें।
            </li>
          </ul>
          <p>
            जो जानकारी किसी काम की नहीं रह जाती, उसे रखने का हमें कोई फ़ायदा नहीं —
            इसलिए हम उसे रखते भी नहीं।
          </p>

          <h2 id="children">8. बच्चों की जानकारी</h2>
          <p>
            हम जान-बूझकर 18 साल से कम उम्र के किसी बच्चे की कोई निजी जानकारी इकट्ठा
            नहीं करते। अगर कभी ग़लती से ऐसा हो जाए और उनके माता-पिता या अभिभावक हमें
            बता दें, तो हम वो जानकारी तुरंत हटा देंगे।
          </p>

          <h2 id="photos">9. तस्वीरें और नाम</h2>
          <p>
            हमारी website पर कुछ जगह ग्राहकों की असली तस्वीरें लगी हैं। <strong>हर
            तस्वीर उस ग्राहक से पूछकर, उनकी मर्ज़ी से ही लगाई जाती है।</strong> बिना
            पूछे किसी की तस्वीर या नाम हम कभी नहीं डालते।
          </p>
          <p>
            अगर आपकी तस्वीर website पर लगी है और आप उसे हटवाना चाहते हैं — तो बस एक
            message कर दीजिए। हम बिना कोई वजह पूछे हटा देंगे।
          </p>

          <h2 id="updates">10. इस policy में बदलाव</h2>
          <p>
            ज़रूरत या क़ानूनी नियमों के हिसाब से हम इस Privacy Policy को समय-समय पर
            बदल सकते हैं। कोई भी बदलाव सबसे पहले इसी page पर दिखेगा।
          </p>

          <h2 id="contact">11. शिकायत और संपर्क</h2>
          <p>
            आपकी privacy या data को लेकर कोई सवाल हो, या आप जानना चाहें कि हमारे पास
            आपकी कौन सी जानकारी है — उसे ठीक करवाना हो या हटवाना हो — तो बेझिझक
            संपर्क कीजिए:
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
          <p>
            अगर आपकी बात ऊपर वाले नंबर पर न सुनी जाए, या आप सीधे मालिक से शिकायत
            करना चाहें — तो उसके लिए अलग नंबर है, जो{" "}
            <Link href="/contact#grievance" style={{ color: "var(--brand)", fontWeight: 700 }}>
              Contact page
            </Link>{" "}
            पर दिया गया है।
          </p>
          <p style={{ color: "var(--ink-3)", fontSize: "13px" }}>
            आख़िरी बार बदला: 7 September 2026
          </p>
        </div>
      </section>

      <Byline />

      <MoreLinks current="/privacy" />
      <PageFoot />
      <FollowUs />
    </div>
  );
}
