import type { Metadata } from "next";
import { shop } from "@/data/shop";
import { ask } from "@/data/content";
import { financePartners } from "@/data/finance";
import { FinanceStrip } from "@/components/FinanceStrip";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { MoreLinks } from "@/components/MoreLinks";
import { PageFoot, Byline } from "@/components/PageFoot";
import { FollowUs } from "@/components/FollowUs";
import { IconWhatsApp, IconPhone } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Finance और EMI Options",
  description:
    `${shop.address.locality}, ${shop.address.city} में EMI पर mobile, laptop और ` +
    `electronics। Bajaj, IDFC, TVS, HDB और credit card EMI — पूरी साफ़ जानकारी।`,
  alternates: { canonical: "/finance" },
};

const toc: TocItem[] = [
  { id: "partners", label: "Paper Finance पर EMI किन-किन bank से मिलती है" },
  { id: "card", label: "Credit Card पर EMI" },
  { id: "rules", label: "Approval और rules — साफ़ बात" },
  { id: "documents", label: "Finance के लिए ज़रूरी documents" },
  { id: "kyc", label: "KYC का सबसे ज़रूरी नियम" },
  { id: "disclaimer", label: "Logo और trademark के बारे में" },
];

export default function Finance() {
  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 10px" }}>
          Finance और EMI — आपका मनपसंद gadget, अब आपके budget में ❤️
        </h1>
        <TableOfContents items={toc} />

        <div className="prose">
          <p>
            पैसे की वजह से अपने मन का smartphone या TV लेने से समझौता मत कीजिए।
          </p>
          <p>
            {shop.name} पर EMI की सुविधा है — आप अपनी सहूलियत के हिसाब से किश्तों में
            payment कर सकते हैं। यहाँ हम पूरा तरीक़ा साफ़-साफ़ लिख रहे हैं, ताकि दुकान
            पर आने से पहले ही आपको सब पता हो।
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="shead">
          <h2 id="partners">Paper Finance पर EMI किन-किन bank से मिलती है?</h2>
        </div>
        <div className="prose" style={{ marginBottom: 14 }}>
          <p>
            Aadhaar, PAN और bank की details देकर जो EMI बनवाई जाती है, दुकानदारी की
            भाषा में उसे <strong>paper finance</strong> कहते हैं। उसके लिए हमारी दुकान
            पर इन finance companies और bank की सुविधा उपलब्ध है:
          </p>
        </div>

        <FinanceStrip />

        <ul className="fin-list">
          {financePartners.map((f) => (
            <li key={f.name}>
              <b>{f.name}</b>
              {f.note && <s>{f.note}</s>}
            </li>
          ))}
        </ul>

        <div className="prose" style={{ marginTop: 14 }}>
          <p>
            Credit card वाली EMI इनसे अलग होती है — उसकी बात नीचे लिखी है।
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="prose">
          <h2 id="card">Credit Card पर EMI</h2>
          <p>
            अगर आपके पास credit card है, तो अपने card पर भी EMI बनवा सकते हैं।
            Debit card पर भी कुछ bank यह सुविधा देते हैं।
          </p>
          <p>
            HDFC, ICICI, SBI, Axis समेत लगभग सारे बड़े bank के credit card दुकान पर
            चलते हैं।
          </p>
          <p>
            आपके card पर EMI बनेगी या नहीं, कितने महीने की बनेगी, और उस पर interest
            या processing fee कितनी लगेगी — <strong>यह पूरी तरह आपके bank के नियमों
            पर तय होता है, दुकान पर नहीं</strong>। Card लेकर आइए, counter पर machine
            में check करके बता देंगे।
          </p>

          <h2 id="rules">Approval और rules — साफ़ बात</h2>
          <p>
            हमारी पहचान हमारी ईमानदारी है, इसलिए finance के नियम बिना घुमाए बता देते हैं:
          </p>
          <ul>
            <li>
              <strong>Approval और limit:</strong> कौन सा plan मिलेगा, down payment
              कितनी होगी, और loan approve होगा या नहीं — यह पूरी तरह finance company
              और आपके credit record पर तय होता है।
            </li>
            <li>
              <strong>Interest और fee:</strong> EMI पर लगने वाला interest और
              processing fee finance company या आपका bank तय करता है — दुकान नहीं।
            </li>
            <li>
              <strong>हमारा काम:</strong> हम system में check करके बता देते हैं कि आपके
              लिए कौन सी scheme बन रही है। पर आख़िरी फ़ैसला हमेशा finance company का
              ही होता है — हम उसका वादा नहीं कर सकते।
            </li>
          </ul>

          <h2 id="documents">Finance के लिए ज़रूरी documents</h2>
          <p>दुकान पर आते समय ये साथ ले आइए:</p>
          <ul>
            <li><strong>Aadhaar Card</strong> — original</li>
            <li><strong>PAN Card</strong> — original</li>
            <li>
              <strong>Bank account की details</strong> — जिस account से किश्त कटेगी
              (passbook, ATM card या cheque book)
            </li>
            <li>
              <strong>वही mobile number, चालू हालत में</strong> — जो Aadhaar और bank
              account दोनों से जुड़ा है। OTP उसी पर आता है, इसलिए वो phone साथ होना
              ज़रूरी है।
            </li>
          </ul>
          <p>
            ये चारों साथ हों तो काम एक ही चक्कर में हो जाता है। कुछ समझना हो तो पहले
            WhatsApp पर पूछ लीजिए।
          </p>

          <h2 id="kyc">KYC का सबसे ज़रूरी नियम</h2>
          <p>
            <strong>जिसके documents लग रहे हैं, उनका ख़ुद दुकान पर आना ज़रूरी है।</strong>
          </p>
          <p>
            Finance company KYC में live photo और biometric verification करती है — यह
            उसी इंसान के सामने होने पर ही हो सकता है। इसलिए किसी रिश्तेदार या दोस्त के
            documents पर, उनके बिना, finance नहीं हो पाता। यह नियम bank का है और आपकी
            अपनी सुरक्षा के लिए ही है।
          </p>

          <div className="btns" style={{ marginTop: 18 }}>
            <a className="btn btn-w" href={ask("EMI और finance")} target="_blank" rel="noopener">
              <IconWhatsApp /> EMI के बारे में पूछिए
            </a>
            <a className="btn btn-d" href={shop.phone.tel}>
              <IconPhone /> {shop.phone.display}
            </a>
          </div>
        </div>
      </section>

      {/*
        Trademark वाली बात सिर्फ़ इसी page पर है — यहीं दूसरी companies के नाम
        और logo आते हैं। Owner ने 1 Sep 2026 को कहा: "jahan zaroori ho wahin,
        sab jagah bina baat ke mat ghusana." इसलिए बाक़ी किसी page पर नहीं।
      */}
      <section className="sec">
        <div className="prose">
          <h2 id="disclaimer">Logo और trademark के बारे में</h2>
          <p className="fineprint">
            इस page पर दिखने वाले सभी trademark, logo और brand के नाम उनकी
            अपनी-अपनी कंपनियों की संपत्ति हैं। इनका इस्तेमाल सिर्फ़ यह बताने के लिए है
            कि हमारी दुकान पर इन कंपनियों की EMI सुविधा उपलब्ध है। इससे इन कंपनियों
            की तरफ़ से {shop.name} को किसी तरह का endorsement या partnership का दावा
            नहीं बनता।
          </p>
          <p className="fineprint">
            <em>
              All trademarks, logos and brand names shown on this page are the
              property of their respective owners. They are shown only to indicate
              the financing facility available at our store, and do not imply any
              endorsement beyond that.
            </em>
          </p>
        </div>
      </section>

      <Byline />

      <MoreLinks current="/finance" />
      <PageFoot />
      <FollowUs />
    </div>
  );
}
