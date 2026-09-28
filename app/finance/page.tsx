import type { Metadata } from "next";
import { shop } from "@/data/shop";
import { ask } from "@/data/content";
import { FinanceStrip } from "@/components/FinanceStrip";
import { MoreLinks } from "@/components/MoreLinks";
import { IconWhatsApp } from "@/components/Icons";

export const metadata: Metadata = {title:"Finance और EMI — options और शर्तें समझिए",description:"Mobile World पर Card EMI, paper finance और ज़रूरी documents की जानकारी। Approval और final terms bank या finance company तय करती है।",alternates:{canonical:"/finance"}};
const answers = [
  {id:"card",q:"Card पर EMI कैसे बनती है?",a:"दुकान पर credit card और कुछ banks के debit card पर EMI की सुविधा है। Card की eligibility, अवधि, interest और processing fee आपका bank तय करता है। Counter पर अपने card की सुविधा check कराइए।"},
  {id:"rules",q:"Approval, down payment और charges कौन तय करता है?",a:"Finance company या bank आपके credit record और अपनी policy के आधार पर approval, limit, down payment, interest और processing fee तय करता है। हमारी team system में उपलब्ध scheme समझने में मदद करती है; approval का वादा नहीं किया जाता।"},
  {id:"documents",q:"दुकान पर कौन से documents लाने हैं?",a:"Original Aadhaar, original PAN, जिस account से किश्त कटेगी उसकी bank details, और Aadhaar व bank से जुड़ा चालू mobile number साथ लाइए। आपकी scheme के लिए अतिरिक्त documents चाहिए हों तो team बताएगी।"},
  {id:"kyc",q:"जिसके नाम finance है, क्या उनका आना ज़रूरी है?",a:"हाँ। जिनके documents लगेंगे, उनका ख़ुद दुकान पर आना ज़रूरी है। Lender की KYC में live photo या biometric verification की ज़रूरत हो सकती है।"},
];
export default function Finance() {
  return <div className="wrap mw-finance"><header className="mw-page-heading"><p className="shopping-overline">FINANCE · पहले जानकारी लीजिए</p><h1>EMI के options.<br /><span>पूरी जानकारी, पहले।</span></h1><p>Card EMI, paper finance और ज़रूरी documents की जानकारी लीजिए। आपके लिए उपलब्ध scheme और charges हमारी team counter पर समझाएगी।</p></header>
    <a className="btn btn-w" href={ask("EMI scheme, interest और charges")} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> EMI के बारे में पूछिए</a>
    <section className="mw-section" id="partners"><div className="shopping-section-heading"><div><p className="shopping-overline">दुकान पर उपलब्ध · FINANCE सुविधा</p><h2>Paper finance के options</h2></div></div><FinanceStrip /><p className="mw-small">कौन सा plan आपके लिए उपलब्ध है, उसकी पुष्टि counter पर होती है।</p></section>
    <section className="mw-finance-faq"><h2>पहले इन बातों को समझ लीजिए।</h2>{answers.map((a) => <details key={a.id} id={a.id}><summary>{a.q}<span aria-hidden="true">+</span></summary><p>{a.a}</p></details>)}<p className="mw-small">दिखाए गए brand names और logos उनकी अपनी कंपनियों की संपत्ति हैं। ये दुकान पर financing सुविधा बताने के लिए हैं; {shop.name} की किसी विशेष endorsement का दावा नहीं है।</p></section><MoreLinks current="/finance" /></div>;
}
