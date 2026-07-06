import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

let __dirname = process.cwd(); // fallback for undefined

try {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = dirname(__filename);
} catch (err) {
  console.warn("ESLint config running outside ESM context, using cwd instead");
}

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "no-console": "warn",
      "eqeqeq": "error",
      "no-undef": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off"
    },
  },
];

export default eslintConfig;
