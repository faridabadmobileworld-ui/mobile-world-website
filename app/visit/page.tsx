import type { Metadata } from "next";
import Image from "next/image";
import { shop } from "@/data/shop";
import { whatsappGeneral } from "@/data/content";
import { IconWhatsApp, IconPin } from "@/components/Icons";
import { LiveBadge, NextClosure } from "@/components/StoreStatus";

export const metadata: Metadata = {
  title: "Visit the store",
  description:
    `${shop.address.street}, ${shop.address.landmark}, ${shop.address.locality}, ` +
    `${shop.address.city} ${shop.address.postalCode}. Roz 10 AM – 10 PM. ` +
    `Mahine ki aakhri tareekh ko band.`,
  alternates: { canonical: "/visit" },
};

export default function Visit() {
  return (
    <div className="wrap">
      <section className="sec">
        <div className="shead"><h1>Visit the store</h1></div>

        <div className="cband rv in">
          <h2>{shop.name}</h2>
          <p>
            {shop.address.street}<br />
            {shop.address.landmark}<br />
            {shop.address.locality}, {shop.address.city}, {shop.address.state} {shop.address.postalCode}
          </p>
          <p style={{ marginTop: 10 }}><LiveBadge /></p>
          <p style={{ marginTop: 6 }}>
            <b>Open daily 10:00 AM – 10:00 PM.</b> Closed on the last calendar date of every
            month — next closure <NextClosure />.
          </p>

          <div className="qr-card">
            <Image src="/images/qr-code-to-find-mobile-world-on-google-a899f382.webp"
              alt="QR code to find Mobile World on Google" width={280} height={280} />
            <span>
              <b>Find us on Google</b>
              <span>Scan to see the store on Google Maps, check the hours, or leave a
                review after your visit.</span>
            </span>
          </div>

          <div className="btns" style={{ justifyContent: "center" }}>
            <a className="btn btn-d" href={shop.social.googleMaps} target="_blank" rel="noopener">
              <IconPin /> Get directions
            </a>
            <a className="btn btn-o" href={shop.phone.tel}>{shop.phone.display}</a>
            <a className="btn btn-w" href={whatsappGeneral} target="_blank" rel="noopener">
              <IconWhatsApp /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="cols3">
          <div className="panel rv in">
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>Kab khuli hai</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
              Saaton din, subah 10 se raat 10. Koi weekly off nahi.
            </p>
          </div>
          <div className="panel rv in">
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>Kab band rehti hai</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
              Har mahine ki aakhri tareekh — 28, 29, 30 ya 31, jo bhi ho. Poora bazaar
              us din band rehta hai.
            </p>
          </div>
          <div className="panel rv in">
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 8px" }}>Landmark</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: 0 }}>
              {shop.address.landmark}. {shop.address.road} par, {shop.address.locality} mein.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
