/**
 * esbuild `.wasm` file को bytes की तरह import करने देता है (binary loader)।
 * TypeScript को यह बताना पड़ता है, वरना वो कहता है "ऐसा module नहीं मिला"।
 */
declare module "mw:rapier-wasm" {
  const bytes: Uint8Array;
  export default bytes;
}

declare module "*.wasm" {
  const bytes: Uint8Array;
  export default bytes;
}
