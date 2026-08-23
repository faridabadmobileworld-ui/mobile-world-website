import { Anton, Syne, Manrope, Noto_Sans_Devanagari } from "next/font/google";

/**
 * Website के तीन fonts।
 *
 * next/font इन्हें हमारे अपने server से भेजता है — Google से नहीं। इससे
 * page तेज़ खुलता है और visitor की जानकारी Google को नहीं जाती।
 */

/** पीछे की विशाल लिखाई — बहुत मोटा और सटा हुआ। */
export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

/** Headings — इसी से page का अपना मिज़ाज बनता है। */
export const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-head",
  display: "swap",
});

/** पढ़ने वाली लिखाई। */
export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-body",
  display: "swap",
});

/**
 * हिंदी के लिए अलग font ज़रूरी है। इसके बिना मात्राएँ और "।" फ़ोन के अपने
 * font से आते हैं, जो बाक़ी लिखाई से मेल नहीं खाते।
 */
export const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hi",
  display: "swap",
});

export const fontVars = [
  anton.variable,
  syne.variable,
  manrope.variable,
  devanagari.variable,
].join(" ");
