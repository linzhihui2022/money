import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslint from "typescript-eslint";
import pluginPrettier from "eslint-plugin-prettier";
import prettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: [".sst"] },
  { files: ["infra/*.ts", "sst-env.d.ts", "sst.config.ts"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      "prettier/prettier": ["error", { config: "./prettier.config.json" }],
    },
  },
  prettier,
];
