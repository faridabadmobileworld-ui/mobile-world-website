/**
 * "EMI किन-किन से मिलता है" — चलती हुई पट्टी, home page के बीच में।
 *
 * Owner ने 1 Sep 2026 को यह list दी और कहा कि chalti hui slides में दिखे।
 *
 * कैसे चलती है: list दो बार लिखी जाती है और CSS उसे बाएँ खिसकाती रहती है।
 * आधा खिसकने पर animation दोबारा शुरू हो जाती है — इसलिए जोड़ कहीं दिखता
 * नहीं, पट्टी लगातार चलती लगती है। JavaScript बिलकुल नहीं लगता।
 *
 * ⚠️ जिस phone में "reduce motion" चालू है, वहाँ यह अपने आप रुक जाती है
 * और उँगली से खिसकाई जा सकती है — कुछ लोगों को चलती चीज़ों से चक्कर आता है।
 *
 * Owner ने 1 Sep 2026 को असली logo भेज दिए, इसलिए अब पट्टी में नाम नहीं,
 * logo चलते हैं। किसी company का logo न हो तो उसका नाम अपने आप दिखने लगेगा।
 */

import Image from "next/image";
import { financePartners, LOGO_W, LOGO_H } from "@/data/finance";

export function FinanceStrip() {
  // एक ही list दो बार — इसी से पट्टी बिना रुके चलती दिखती है।
  const loop = [...financePartners, ...financePartners];

  return (
    <div className="fin">
      <div
        className="fin-t"
        role="list"
        aria-label="EMI और finance की सुविधा देने वाली कंपनियाँ"
      >
        {loop.map((f, i) => (
          <span
            className="fin-c"
            role="listitem"
            key={`${f.name}-${i}`}
            /* दूसरी बार वाली list सिर्फ़ दिखाने के लिए है — screen reader
               उसे दोबारा न पढ़े, वरना हर नाम दो बार सुनाई देगा। */
            aria-hidden={i >= financePartners.length || undefined}
          >
            {f.logo ? (
              /* पट्टी चलती रहती है, इसलिए logo "बाद में" नहीं आ सकते — वरना
                 खिसकते-खिसकते खाली जगह दिखती है। सातों मिलाकर 30 KB से भी कम
                 हैं और दोनों बार वही file है, इसलिए request भी सात ही जाती हैं। */
              <Image src={f.logo} alt={f.name} width={LOGO_W} height={LOGO_H}
                     sizes="140px" loading="eager" />
            ) : (
              <span className="fin-n">
                {f.name}
                {f.note && <s>{f.note}</s>}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
