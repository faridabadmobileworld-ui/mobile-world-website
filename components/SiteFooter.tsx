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
            <Link className="logo" href="/"><i>MW</i><span>{shop.name}<s>SINCE 2016</s></span></Link>
            <address style={{ marginTop: 12 }}>
              {shop.address.street}<br />
              {shop.address.landmark}<br />
              {shop.address.locality}, {shop.address.city}, {shop.address.state} {shop.address.postalCode}<br /><br />
              <a href={shop.phone.tel}><b>{shop.phone.display}</b></a><br />
              Open daily 10:00 AM – 10:00 PM
            </address>
            <div className="soc">
              <a href={shop.social.youtube} target="_blank" rel="noopener" aria-label="YouTube"><IconYouTube /></a>
              <a href={shop.social.instagram} target="_blank" rel="noopener" aria-label="Instagram"><IconInstagram /></a>
              <a href={shop.social.facebook} target="_blank" rel="noopener" aria-label="Facebook"><IconFacebook /></a>
            </div>
          </div>

          <div>
            <h2 className="fh">Company</h2>
            <ul>
              <li><Link href="/about">About the store</Link></li>
              <li><Link href="/products">What we stock</Link></li>
              <li><Link href="/posts">Latest posts</Link></li>
              <li><Link href="/visit">Visit us</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="fh">Shop</h2>
            <ul>
              {navCategories.slice(0, 6).map((c) => (
                <li key={c.slug}><Link href={`/products#${c.slug}`}>{c.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="fh">Help</h2>
            <ul>
              <li><Link href="/contact">Repairs</Link></li>
              <li><Link href="/contact">Installation</Link></li>
              <li><a href={ask("warranty support")} target="_blank" rel="noopener">Warranty support</a></li>
              <li><a href={ask("EMI options")} target="_blank" rel="noopener">EMI options</a></li>
              <li><a href={ask("delivery")} target="_blank" rel="noopener">Delivery</a></li>
            </ul>
          </div>

          <div>
            <h2 className="fh">Store info</h2>
            <ul>
              <li><LiveBadge /></li>
              <li>Closed on the last date of every month</li>
              <li>Next closure: <NextClosure /></li>
              <li>Proprietor: {shop.owner}</li>
            </ul>
          </div>
        </div>

        <div className="fbot">
          <span>© {new Date().getFullYear()} {shop.name} · {shop.registeredName}</span>
          <span>
            <Link href="/privacy">Privacy</Link> · Enquiries only — no online ordering, no accounts
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
      <Link href="/products"><IconGrid />Browse</Link>
      <a className="w" href={whatsappGeneral} target="_blank" rel="noopener"><IconWhatsApp />WhatsApp</a>
      <a href={shop.social.googleMaps} target="_blank" rel="noopener"><IconPin />Directions</a>
    </nav>
  );
}
