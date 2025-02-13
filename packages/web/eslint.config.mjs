import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginPrettier from "eslint-plugin-prettier";
import prettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import pluginNext from "@next/eslint-plugin-next";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: [".next", "prisma/client"] },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  // pluginNext.configs.flat.recommended,
  // pluginReactHooks.configs.recommended,
  {
    plugins: {
      prettier: pluginPrettier,
      import: pluginImport,
      reactHooks: pluginReactHooks,
      next: pluginNext,
    },
    rules: {
      "prettier/prettier": ["error", { config: "./prettier.config.json" }],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  prettier,
];
