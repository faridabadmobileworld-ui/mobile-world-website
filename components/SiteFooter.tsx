import Image from "next/image";
import Link from "next/link";
import { shop } from "@/data/shop";
import { ask, navCategories } from "@/data/content";
import { LiveBadge, NextClosure } from "./StoreStatus";
import { IconYouTube, IconInstagram, IconFacebook, IconHome, IconGrid, IconWhatsApp, IconPin } from "./Icons";
import { whatsappGeneral } from "@/data/content";

export function SiteFooter() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="fgrid">
          <div>
            <Link className="logo" href="/"><i><Image src="/images/mobile-world-logo-87f0b7f5.webp" alt="" width={240} height={240} sizes="40px" /></i><span>{shop.name}<s>{shop.tagline}</s></span></Link>
            <address style={{ marginTop: 12 }}>
              {shop.address.street}<br />
              {shop.address.landmark}<br />
              {shop.address.locality}, {shop.address.city}, {shop.address.state} {shop.address.postalCode}<br /><br />
              <a href={shop.phone.tel}><b>{shop.phone.display}</b></a><br />
              रोज़ सुबह 10 से रात 10
            </address>
            <div className="soc">
              <a href={shop.social.youtube} target="_blank" rel="noopener" aria-label="YouTube"><IconYouTube /></a>
              <a href={shop.social.instagram} target="_blank" rel="noopener" aria-label="Instagram"><IconInstagram /></a>
              <a href={shop.social.facebook} target="_blank" rel="noopener" aria-label="Facebook"><IconFacebook /></a>
            </div>
          </div>

          <div>
            <h2 className="fh">दुकान</h2>
            <ul>
              <li><Link href="/about">हमारे बारे में</Link></li>
              <li><Link href="/team">हमारी Team</Link></li>
              <li><Link href="/products">क्या-क्या मिलता है</Link></li>
              <li><Link href="/posts">Tech Blog &amp; Guides</Link></li>
              <li><Link href="/visit">दुकान पर आइए</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="fh">सामान</h2>
            <ul>
              {navCategories.slice(0, 6).map((c) => (
                <li key={c.slug}><Link href={`/products#${c.slug}`}>{c.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="fh">मदद</h2>
            <ul>
              <li><Link href="/repairing">Repairing Services</Link></li>
              <li><Link href="/after-sales-support">After Sales Support</Link></li>
              <li><Link href="/finance">Finance और EMI</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/returns">Return और Exchange</Link></li>
              <li><a href={ask("पुराने phone के Exchange")} target="_blank" rel="noopener">Exchange</a></li>
              <li><a href={ask("EMI")} target="_blank" rel="noopener">EMI</a></li>
              <li><a href={ask("Delivery")} target="_blank" rel="noopener">Delivery</a></li>
            </ul>
          </div>

          <div>
            <h2 className="fh">दुकान की जानकारी</h2>
            <ul>
              <li><LiveBadge /></li>
              <li>हर महीने की आख़िरी तारीख़ को बंद</li>
              <li>अगली छुट्टी: <NextClosure /></li>
              <li>Proprietor: {shop.owner}</li>
            </ul>
          </div>
        </div>

        <div className="fbot">
          <span>© {new Date().getFullYear()} {shop.name} · {shop.registeredName}</span>
          <span>
            <Link href="/terms">Terms &amp; Conditions</Link> · <Link href="/returns">Return और Exchange</Link> · <Link href="/privacy">Privacy</Link> · सिर्फ़ पूछताछ के लिए — यहाँ से order नहीं होता
          </span>
        </div>
      </div>
    </footer>
  );
}

/** Phone पर नीचे चिपकी quick actions bar। */
export function MobileBar() {
  return (
    <nav className="mbar" aria-label="Quick actions">
      <Link href="/"><IconHome />Home</Link>
      <Link href="/products"><IconGrid />सामान</Link>
      <a className="w" href={whatsappGeneral} target="_blank" rel="noopener"><IconWhatsApp />WhatsApp</a>
      <a href={shop.social.googleMaps} target="_blank" rel="noopener"><IconPin />रास्ता</a>
    </nav>
  );
}
