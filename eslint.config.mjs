import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { perfectionist },
    rules: { "perfectionist/sort-imports": "error" },
  },
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "generated/**",
      ".history/**",
      
      // Add any other files/folders you want to ignore
    ]
  },
  tseslint.configs.recommended,
]);
