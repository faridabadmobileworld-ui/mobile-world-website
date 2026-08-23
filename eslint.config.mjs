import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "preview/**", "next-env.d.ts"]),
  {
    /*
      नाम के आगे _ लगाना मतलब "यह जान-बूझकर छोड़ा गया है"।
      कुछ जगह किसी prop को सिर्फ़ इसलिए निकालना पड़ता है कि वो आगे न जाए —
      जैसे next/image के अपने props, जो असली <img> पर नहीं जाने चाहिए।
    */
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;
