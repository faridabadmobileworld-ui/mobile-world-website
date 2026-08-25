import type { Metadata } from "next";
import { shop } from "@/data/shop";

export const metadata: Metadata = {
  title: "Privacy",
  description: `${shop.name} kya jaankari rakhta hai aur kya nahi.`,
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <div className="wrap">
      <section className="sec">
        <div className="shead"><h1>Privacy</h1></div>
        <div className="panel rv in" style={{ maxWidth: 820 }}>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: "0 0 12px" }}>
            Ye website kuch bhi collect nahi karti. Koi account nahi, koi cart nahi,
            koi contact form nahi aur koi tracking pixel nahi. Search box poori tarah
            aapke apne browser mein chalta hai — jo aap likhte hain wo kahin nahi jaata.
          </p>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: "0 0 12px" }}>
            Jab aap WhatsApp ya Call dabate hain to aap un apps par chale jaate hain, aur
            wahan jo bhejte hain wo unki apni terms ke hisaab se chalta hai. Message mein
            di gayi jaankari — naam, number aur kya chahiye — sirf aapke sawaal ka jawab
            dene, aur kharidne par bill aur warranty record banane ke liye use hoti hai.
          </p>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
            Hum aapke baare mein kya rakhte hain ye poochhna ho, usse theek karwana ho ya
            hatwana ho to{" "}
            <a href={shop.phone.tel} style={{ color: "var(--brand)", fontWeight: 700 }}>
              {shop.phone.display}
            </a>{" "}
            par call kijiye.
          </p>
          <p style={{
            fontSize: 12.5, color: "var(--ink-3)", borderTop: "1px solid var(--line)",
            paddingTop: 14, marginTop: 18, marginBottom: 0,
          }}>
            <b>Note:</b> Site live karne se pehle owner ko ye page kisi CA ya vakil se
            DPDP Act ke hisaab se check karwana chahiye.
          </p>
        </div>
      </section>
    </div>
  );
}
