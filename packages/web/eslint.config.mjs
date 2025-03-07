import pluginJs from "@eslint/js";
import pluginNext from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier/recommended";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tsEslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default tsEslint.config(
  { ignores: [".next", "prisma/client"] },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  tsEslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "18",
      },
    },
  },
  pluginReact.configs.flat["jsx-runtime"],
  pluginReactHooks.configs["recommended-latest"],
  pluginPrettier,
  { plugins: { next: pluginNext } },
  {
    rules: {
      "prettier/prettier": ["error"],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  prettier
);
