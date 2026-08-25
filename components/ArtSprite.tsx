/**
 * सारी code वाली drawings एक ही जगह।
 *
 * जिस चीज़ की असली photo नहीं है, उसके लिए यही इस्तेमाल होती हैं — कोई
 * placeholder नहीं, किसी और की image नहीं। ये कभी load होने में fail नहीं
 * होतीं क्योंकि ये page के अंदर ही हैं।
 *
 * इस्तेमाल: <Art id="a-phone" />
 */
export function ArtSprite() {
  return (
    <svg width="0" height="0" style={{position:"absolute"}} aria-hidden="true" focusable="false"><defs>
<linearGradient id="bgLav" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F3EFFE"/><stop offset="1" stopColor="#D8CEF6"/></linearGradient>
<linearGradient id="bgPeach" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FEF1E9"/><stop offset="1" stopColor="#F6D2BC"/></linearGradient>
<linearGradient id="bgSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF4FD"/><stop offset="1" stopColor="#C9DBF4"/></linearGradient>
<linearGradient id="bgMint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ECF8F2"/><stop offset="1" stopColor="#BFE6D3"/></linearGradient>
<linearGradient id="bgSand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FBF6EA"/><stop offset="1" stopColor="#EDDFC2"/></linearGradient>
<linearGradient id="bgSlate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F2F3F7"/><stop offset="1" stopColor="#D4D7E1"/></linearGradient>
<radialGradient id="spot" cx=".5" cy=".38" r=".62"><stop offset="0" stopColor="#fff" stopOpacity=".95"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>
<radialGradient id="drop"><stop offset="0" stopColor="#1A1A33" stopOpacity=".3"/><stop offset="1" stopColor="#1A1A33" stopOpacity="0"/></radialGradient>
<linearGradient id="mBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6C6C8C"/><stop offset=".28" stopColor="#2A2A44"/><stop offset=".62" stopColor="#45455F"/><stop offset="1" stopColor="#1C1C30"/></linearGradient>
<linearGradient id="mSteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#B9BECB"/><stop offset=".22" stopColor="#F2F4F8"/><stop offset=".5" stopColor="#C7CCD8"/><stop offset=".78" stopColor="#EEF1F6"/><stop offset="1" stopColor="#A9AFBD"/></linearGradient>
<linearGradient id="mWhite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF"/><stop offset=".55" stopColor="#F4F5F9"/><stop offset="1" stopColor="#D3D6E0"/></linearGradient>
<linearGradient id="scrA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8E6BFF"/><stop offset=".45" stopColor="#4B2ED4"/><stop offset="1" stopColor="#E8542F"/></linearGradient>
<linearGradient id="scrB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4FA8FF"/><stop offset=".5" stopColor="#5B3FD9"/><stop offset="1" stopColor="#191938"/></linearGradient>
<linearGradient id="scrC" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFB36B"/><stop offset=".5" stopColor="#E8542F"/><stop offset="1" stopColor="#6B1F45"/></linearGradient>
<linearGradient id="gloss" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".5"/><stop offset=".42" stopColor="#fff" stopOpacity=".04"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".28"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
</defs><symbol id="a-phone" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgLav)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="348" rx="92" ry="20" fill="url(#drop)"/>
<g transform="translate(0,-6)">
  <rect x="146" y="62" width="108" height="272" rx="26" fill="url(#mBody)"/>
  <rect x="152" y="68" width="96" height="260" rx="21" fill="#0A0A16"/>
  <rect x="157" y="73" width="86" height="250" rx="17" fill="url(#scrA)"/>
  <rect x="157" y="73" width="86" height="250" rx="17" fill="url(#gloss)"/>
  <rect x="180" y="83" width="40" height="11" rx="5.5" fill="#0A0A16"/>
  <rect x="170" y="238" width="60" height="9" rx="4.5" fill="#fff" opacity=".62"/>
  <rect x="170" y="256" width="40" height="9" rx="4.5" fill="#fff" opacity=".38"/>
  <rect x="176" y="306" width="48" height="5" rx="2.5" fill="#fff" opacity=".7"/>
  <rect x="254" y="128" width="5" height="40" rx="2.5" fill="#6C6C8C"/>
  <rect x="141" y="120" width="5" height="26" rx="2.5" fill="#6C6C8C"/>
  <rect x="141" y="156" width="5" height="26" rx="2.5" fill="#6C6C8C"/>
</g></symbol><symbol id="a-tablet" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgSky)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="344" rx="118" ry="20" fill="url(#drop)"/>
<rect x="104" y="76" width="192" height="252" rx="20" fill="url(#mBody)"/>
<rect x="112" y="84" width="176" height="236" rx="13" fill="#0A0A16"/>
<rect x="117" y="89" width="166" height="226" rx="9" fill="url(#scrB)"/>
<rect x="117" y="89" width="166" height="226" rx="9" fill="url(#gloss)"/>
<rect x="136" y="116" width="74" height="11" rx="5.5" fill="#fff" opacity=".55"/>
<rect x="136" y="138" width="118" height="7" rx="3.5" fill="#fff" opacity=".3"/>
<rect x="136" y="154" width="96" height="7" rx="3.5" fill="#fff" opacity=".24"/>
<rect x="136" y="184" width="62" height="48" rx="8" fill="#fff" opacity=".26"/>
<rect x="206" y="184" width="62" height="48" rx="8" fill="#fff" opacity=".16"/>
<rect x="136" y="248" width="132" height="7" rx="3.5" fill="#fff" opacity=".2"/></symbol><symbol id="a-laptop" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgSlate)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="322" rx="150" ry="18" fill="url(#drop)"/>
<rect x="86" y="86" width="228" height="156" rx="12" fill="url(#mSteel)"/>
<rect x="94" y="94" width="212" height="140" rx="6" fill="#0A0A16"/>
<rect x="99" y="99" width="202" height="130" rx="3" fill="url(#scrB)"/>
<rect x="99" y="99" width="202" height="130" rx="3" fill="url(#gloss)"/>
<rect x="118" y="122" width="76" height="10" rx="5" fill="#fff" opacity=".5"/>
<rect x="118" y="146" width="128" height="7" rx="3.5" fill="#fff" opacity=".26"/>
<rect x="118" y="162" width="104" height="7" rx="3.5" fill="#fff" opacity=".2"/>
<rect x="118" y="186" width="54" height="22" rx="6" fill="#E8542F" opacity=".9"/>
<path d="M56 246h288l22 40a9 9 0 0 1-8 13H42a9 9 0 0 1-8-13z" fill="url(#mSteel)"/>
<rect x="164" y="282" width="72" height="8" rx="4" fill="#0A0A16" opacity=".45"/>
<rect x="56" y="246" width="288" height="5" fill="#fff" opacity=".5"/></symbol><symbol id="a-tv" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgLav)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="340" rx="130" ry="18" fill="url(#drop)"/>
<rect x="34" y="70" width="332" height="204" rx="10" fill="url(#mBody)"/>
<rect x="42" y="78" width="316" height="188" rx="5" fill="#07070F"/>
<rect x="47" y="83" width="306" height="178" rx="3" fill="url(#scrA)"/>
<rect x="47" y="83" width="306" height="178" rx="3" fill="url(#gloss)"/>
<circle cx="200" cy="172" r="38" fill="#fff" opacity=".2"/>
<path d="M188 154l30 18-30 18z" fill="#fff" opacity=".9"/>
<rect x="182" y="274" width="36" height="30" fill="#3C3C56"/>
<rect x="126" y="304" width="148" height="12" rx="6" fill="url(#mSteel)"/></symbol><symbol id="a-ac" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgSky)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="330" rx="130" ry="16" fill="url(#drop)"/>
<rect x="40" y="112" width="320" height="98" rx="22" fill="url(#mWhite)"/>
<rect x="40" y="112" width="320" height="42" rx="22" fill="#fff"/>
<path d="M66 210h268l-24 32H90z" fill="#C2C7D4"/>
<rect x="82" y="170" width="236" height="7" rx="3.5" fill="#AEB4C4"/>
<rect x="82" y="186" width="236" height="7" rx="3.5" fill="#AEB4C4"/>
<circle cx="318" cy="132" r="8" fill="#12915A"/>
<rect x="236" y="125" width="56" height="14" rx="7" fill="#E0E4EC"/>
<path d="M118 268c22-18 44-18 66 0M176 292c22-18 44-18 66 0" stroke="#5B3FD9" strokeWidth="9" strokeLinecap="round" fill="none" opacity=".5"/>
<path d="M132 254c22-18 44-18 66 0" stroke="#5B3FD9" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".28"/></symbol><symbol id="a-wash" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgMint)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="352" rx="96" ry="18" fill="url(#drop)"/>
<rect x="96" y="52" width="208" height="292" rx="24" fill="url(#mWhite)"/>
<rect x="96" y="52" width="208" height="62" rx="24" fill="#F1F3F8"/>
<rect x="124" y="74" width="80" height="16" rx="8" fill="#BFC5D4"/>
<circle cx="268" cy="82" r="11" fill="#5B3FD9"/>
<circle cx="200" cy="228" r="82" fill="#DDE1EA"/>
<circle cx="200" cy="228" r="68" fill="#0E0E1E"/>
<circle cx="200" cy="228" r="56" fill="url(#scrB)" opacity=".92"/>
<circle cx="200" cy="228" r="56" fill="url(#gloss)"/>
<path d="M166 240c20 15 48 15 68 0" stroke="#fff" strokeWidth="9" strokeLinecap="round" fill="none" opacity=".45"/>
<circle cx="200" cy="228" r="68" fill="none" stroke="#fff" strokeWidth="3" opacity=".2"/></symbol><symbol id="a-fridge" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgSlate)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="356" rx="84" ry="16" fill="url(#drop)"/>
<rect x="118" y="38" width="164" height="310" rx="22" fill="url(#mWhite)"/>
<rect x="118" y="150" width="164" height="7" fill="#C6CAD6"/>
<rect x="252" y="82" width="11" height="50" rx="5.5" fill="#98A0B2"/>
<rect x="252" y="176" width="11" height="66" rx="5.5" fill="#98A0B2"/>
<rect x="142" y="188" width="58" height="88" rx="8" fill="#EDEFF5"/>
<circle cx="152" cy="68" r="7" fill="#5B3FD9"/>
<rect x="172" y="60" width="42" height="15" rx="7.5" fill="#E0E4EC"/>
<rect x="118" y="38" width="60" height="310" rx="22" fill="url(#fade)"/></symbol><symbol id="a-speaker" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgPeach)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="340" rx="84" ry="18" fill="url(#drop)"/>
<rect x="126" y="86" width="148" height="234" rx="38" fill="url(#mBody)"/>
<rect x="136" y="96" width="128" height="214" rx="30" fill="#16162C"/>
<circle cx="200" cy="166" r="46" fill="#2C2C4A"/>
<circle cx="200" cy="166" r="27" fill="#101024"/>
<circle cx="200" cy="166" r="11" fill="#E8542F"/>
<circle cx="200" cy="252" r="31" fill="#2C2C4A"/>
<circle cx="200" cy="252" r="16" fill="#101024"/>
<rect x="172" y="112" width="56" height="6" rx="3" fill="#fff" opacity=".16"/>
<rect x="126" y="86" width="46" height="234" rx="38" fill="url(#fade)"/></symbol><symbol id="a-buds" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgMint)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="336" rx="90" ry="18" fill="url(#drop)"/>
<rect x="126" y="186" width="148" height="122" rx="38" fill="url(#mWhite)"/>
<rect x="126" y="186" width="148" height="52" rx="38" fill="#fff"/>
<rect x="178" y="292" width="44" height="8" rx="4" fill="#BFC5D4"/>
<circle cx="200" cy="246" r="9" fill="#12915A"/>
<g><ellipse cx="112" cy="138" rx="30" ry="24" fill="#F6F7FB"/><path d="M100 152c0 28 4 52 16 60 10 6 18-4 16-20-2-20-8-34-16-42z" fill="#E4E7EF"/></g>
<g><ellipse cx="288" cy="138" rx="30" ry="24" fill="#F6F7FB"/><path d="M300 152c0 28-4 52-16 60-10 6-18-4-16-20 2-20 8-34 16-42z" fill="#E4E7EF"/></g></symbol><symbol id="a-watch" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgLav)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="348" rx="66" ry="14" fill="url(#drop)"/>
<rect x="160" y="40" width="80" height="104" rx="26" fill="#3C3C58"/>
<rect x="160" y="264" width="80" height="104" rx="26" fill="#3C3C58"/>
<rect x="112" y="122" width="176" height="180" rx="46" fill="url(#mBody)"/>
<rect x="124" y="134" width="152" height="156" rx="38" fill="#0A0A16"/>
<rect x="130" y="140" width="140" height="144" rx="33" fill="url(#scrA)"/>
<rect x="130" y="140" width="140" height="144" rx="33" fill="url(#gloss)"/>
<rect x="158" y="188" width="84" height="14" rx="7" fill="#fff" opacity=".7"/>
<rect x="170" y="216" width="60" height="10" rx="5" fill="#fff" opacity=".42"/>
<rect x="288" y="188" width="9" height="32" rx="4.5" fill="#6C6C8C"/></symbol><symbol id="a-headphone" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgPeach)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="346" rx="100" ry="18" fill="url(#drop)"/>
<path d="M92 236v-42a108 108 0 0 1 216 0v42" stroke="url(#mBody)" strokeWidth="28" fill="none" strokeLinecap="round"/>
<rect x="58" y="222" width="66" height="106" rx="30" fill="url(#mBody)"/>
<rect x="276" y="222" width="66" height="106" rx="30" fill="url(#mBody)"/>
<rect x="70" y="238" width="42" height="74" rx="21" fill="#E8542F" opacity=".9"/>
<rect x="288" y="238" width="42" height="74" rx="21" fill="#E8542F" opacity=".9"/>
<path d="M92 200v-6a108 108 0 0 1 216 0v6" stroke="#fff" strokeWidth="5" fill="none" opacity=".3" strokeLinecap="round"/></symbol><symbol id="a-inverter" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgSand)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="342" rx="130" ry="16" fill="url(#drop)"/>
<rect x="44" y="120" width="146" height="196" rx="18" fill="url(#mBody)"/>
<rect x="64" y="144" width="106" height="52" rx="8" fill="url(#scrA)" opacity=".92"/>
<rect x="64" y="216" width="66" height="11" rx="5.5" fill="#6C6C8C"/>
<rect x="64" y="240" width="86" height="11" rx="5.5" fill="#6C6C8C"/>
<circle cx="156" cy="276" r="13" fill="#12915A"/>
<rect x="212" y="164" width="150" height="152" rx="14" fill="url(#mWhite)"/>
<rect x="236" y="142" width="38" height="26" rx="6" fill="#8A90A2"/>
<rect x="300" y="142" width="38" height="26" rx="6" fill="#8A90A2"/>
<path d="M292 196l-28 50h28l-12 40" stroke="#E8542F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/></symbol><symbol id="a-kitchen" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgSand)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="350" rx="92" ry="16" fill="url(#drop)"/>
<path d="M126 152h148l-16 178a18 18 0 0 1-18 16h-80a18 18 0 0 1-18-16z" fill="url(#mWhite)"/>
<rect x="114" y="124" width="172" height="34" rx="17" fill="#E2E5ED"/>
<rect x="152" y="190" width="96" height="80" rx="12" fill="url(#scrB)" opacity=".85"/>
<circle cx="200" cy="300" r="17" fill="#E8542F"/>
<rect x="172" y="78" width="56" height="48" rx="12" fill="#C2C7D4"/>
<rect x="126" y="152" width="44" height="194" fill="url(#fade)"/></symbol><symbol id="a-router" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgSlate)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="336" rx="108" ry="16" fill="url(#drop)"/>
<rect x="92" y="242" width="216" height="78" rx="20" fill="url(#mBody)"/>
<circle cx="132" cy="282" r="8" fill="#12915A"/><circle cx="160" cy="282" r="8" fill="#5B3FD9"/><circle cx="188" cy="282" r="8" fill="#E8542F"/>
<rect x="124" y="148" width="12" height="98" rx="6" fill="#3C3C58"/>
<rect x="264" y="148" width="12" height="98" rx="6" fill="#3C3C58"/>
<path d="M200 216a52 52 0 0 1 52 52M200 172a96 96 0 0 1 96 96M200 128a140 140 0 0 1 140 140" stroke="#5B3FD9" strokeWidth="10" fill="none" strokeLinecap="round" opacity=".45"/></symbol><symbol id="a-charger" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgPeach)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="342" rx="84" ry="16" fill="url(#drop)"/>
<rect x="126" y="130" width="148" height="192" rx="30" fill="url(#mBody)"/>
<rect x="152" y="158" width="96" height="38" rx="9" fill="url(#scrA)" opacity=".92"/>
<rect x="152" y="218" width="96" height="11" rx="5.5" fill="#6C6C8C"/>
<rect x="152" y="244" width="64" height="11" rx="5.5" fill="#6C6C8C"/>
<path d="M208 62l-30 52h26l-8 40 34-56h-26z" fill="#E8542F"/>
<rect x="126" y="130" width="46" height="192" rx="30" fill="url(#fade)"/></symbol><symbol id="a-accessory" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="url(#bgLav)"/><ellipse cx="200" cy="150" rx="230" ry="180" fill="url(#spot)"/><rect y="300" width="400" height="100" fill="#000" opacity=".045"/><ellipse cx="200" cy="346" rx="96" ry="16" fill="url(#drop)"/>
<rect x="142" y="88" width="116" height="226" rx="28" fill="url(#mBody)"/>
<rect x="152" y="98" width="96" height="206" rx="20" fill="#EDEFF5"/>
<circle cx="200" cy="146" r="24" fill="#D2D6E0"/>
<circle cx="200" cy="146" r="12" fill="#98A0B2"/>
<path d="M62 208l48-48 20 20-48 48z" fill="#E8542F" opacity=".9"/>
<rect x="272" y="196" width="76" height="112" rx="14" fill="#fff" stroke="#D2D6E0" strokeWidth="5"/>
<rect x="288" y="216" width="44" height="6" rx="3" fill="#D2D6E0"/></symbol><symbol id="w-store" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice"><rect width="400" height="260" fill="url(#bgLav)"/><ellipse cx="200" cy="90" rx="230" ry="130" fill="url(#spot)"/>
<rect y="196" width="400" height="64" fill="#B9AEE0" opacity=".5"/>
<rect x="18" y="66" width="112" height="130" rx="6" fill="#fff" opacity=".85"/>
<rect x="28" y="82" width="92" height="30" rx="4" fill="#5B3FD9" opacity=".28"/>
<rect x="28" y="122" width="92" height="30" rx="4" fill="#5B3FD9" opacity=".2"/>
<rect x="28" y="162" width="92" height="24" rx="4" fill="#5B3FD9" opacity=".14"/>
<rect x="270" y="66" width="112" height="130" rx="6" fill="#fff" opacity=".85"/>
<rect x="280" y="82" width="92" height="30" rx="4" fill="#E8542F" opacity=".26"/>
<rect x="280" y="122" width="92" height="30" rx="4" fill="#E8542F" opacity=".18"/>
<rect x="280" y="162" width="92" height="24" rx="4" fill="#E8542F" opacity=".12"/>
<rect x="150" y="150" width="100" height="46" rx="6" fill="#3C3C58"/>
<rect x="158" y="94" width="84" height="52" rx="6" fill="#1C1C30"/>
<rect x="163" y="99" width="74" height="42" rx="3" fill="url(#scrA)"/>
<ellipse cx="200" cy="200" rx="70" ry="10" fill="url(#drop)"/></symbol><symbol id="w-shopfront" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice"><rect width="400" height="260" fill="url(#bgSky)"/><ellipse cx="200" cy="90" rx="230" ry="130" fill="url(#spot)"/>
<rect y="204" width="400" height="56" fill="#A8BEDD" opacity=".5"/>
<rect x="46" y="52" width="308" height="152" rx="8" fill="#fff" opacity=".9"/>
<rect x="46" y="52" width="308" height="40" rx="8" fill="#5B3FD9"/>
<rect x="86" y="66" width="150" height="13" rx="6.5" fill="#fff" opacity=".85"/>
<rect x="252" y="66" width="62" height="13" rx="6.5" fill="#E8542F"/>
<rect x="66" y="106" width="118" height="82" rx="5" fill="#C9DBF4"/>
<rect x="216" y="106" width="118" height="82" rx="5" fill="#C9DBF4"/>
<rect x="192" y="120" width="16" height="68" rx="3" fill="#8FA6C8"/>
<rect x="78" y="120" width="94" height="24" rx="3" fill="#fff" opacity=".7"/>
<rect x="228" y="120" width="94" height="24" rx="3" fill="#fff" opacity=".7"/></symbol><symbol id="w-service" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice"><rect width="400" height="260" fill="url(#bgMint)"/><ellipse cx="200" cy="90" rx="230" ry="130" fill="url(#spot)"/>
<rect y="200" width="400" height="60" fill="#9FD3BC" opacity=".5"/>
<rect x="52" y="152" width="296" height="50" rx="8" fill="#fff" opacity=".9"/>
<rect x="112" y="82" width="86" height="72" rx="10" fill="url(#mBody)"/>
<rect x="119" y="89" width="72" height="58" rx="6" fill="url(#scrA)"/>
<path d="M232 96l30-30 22 22-30 30z" fill="#E8542F"/>
<rect x="258" y="118" width="52" height="16" rx="8" fill="#3C3C58" transform="rotate(42 284 126)"/>
<circle cx="300" cy="76" r="15" fill="#12915A" opacity=".85"/>
<ellipse cx="200" cy="206" rx="120" ry="10" fill="url(#drop)"/></symbol><symbol id="w-delivery" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice"><rect width="400" height="260" fill="url(#bgPeach)"/><ellipse cx="200" cy="90" rx="230" ry="130" fill="url(#spot)"/>
<rect y="198" width="400" height="62" fill="#E9BFA5" opacity=".5"/>
<rect x="46" y="96" width="176" height="102" rx="10" fill="#fff" opacity=".92"/>
<path d="M222 128h52l42 46v24h-94z" fill="#E8542F" opacity=".9"/>
<rect x="238" y="140" width="42" height="26" rx="4" fill="#fff" opacity=".7"/>
<circle cx="106" cy="200" r="26" fill="#2A2A44"/><circle cx="106" cy="200" r="11" fill="#C2C7D4"/>
<circle cx="268" cy="200" r="26" fill="#2A2A44"/><circle cx="268" cy="200" r="11" fill="#C2C7D4"/>
<rect x="72" y="120" width="60" height="46" rx="5" fill="#EDDFC2"/>
<path d="M72 143h60M102 120v46" stroke="#D2B98E" strokeWidth="4"/></symbol><symbol id="w-counter" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice"><rect width="400" height="260" fill="url(#bgSand)"/><ellipse cx="200" cy="90" rx="230" ry="130" fill="url(#spot)"/>
<rect y="192" width="400" height="68" fill="#DCC9A2" opacity=".55"/>
<rect x="34" y="150" width="332" height="42" rx="7" fill="#fff" opacity=".92"/>
<rect x="34" y="150" width="332" height="10" rx="5" fill="#E8542F" opacity=".55"/>
<rect x="70" y="86" width="70" height="60" rx="7" fill="#3C3C58"/>
<rect x="76" y="92" width="58" height="48" rx="4" fill="url(#scrB)"/>
<rect x="168" y="102" width="60" height="44" rx="6" fill="#fff" opacity=".9"/>
<rect x="176" y="112" width="44" height="6" rx="3" fill="#C2C7D4"/>
<rect x="176" y="124" width="30" height="6" rx="3" fill="#C2C7D4"/>
<rect x="258" y="80" width="74" height="66" rx="8" fill="url(#mWhite)"/>
<circle cx="295" cy="113" r="20" fill="#5B3FD9" opacity=".3"/></symbol></svg>
  );
}

export function Art({ id, className = "art" }: { id: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}
