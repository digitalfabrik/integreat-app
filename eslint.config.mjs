import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import { configs, plugins } from 'eslint-config-airbnb-extended';
import { rules as prettierConfigRules } from 'eslint-config-prettier';
import jest from "eslint-plugin-jest";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import preferArrow from "eslint-plugin-prefer-arrow";
import styledComponentsA11Y from "eslint-plugin-styled-components-a11y";
import globals from "globals";
import unicorn from "eslint-plugin-unicorn";

const jsConfig = defineConfig([
  {
    name: 'js/config',
    ...js.configs.recommended,
  },
  plugins.stylistic,
  plugins.importX,
  ...configs.base.recommended,
]);

const reactConfig = defineConfig([
  plugins.react,
  plugins.reactHooks,
  plugins.reactA11y,
  ...configs.react.recommended,
]);

const typescriptConfig = defineConfig([
  plugins.typescriptEslint,
  ...configs.base.typescript,
  ...configs.react.typescript,
]);

const prettierConfig = defineConfig([
  {
    name: 'prettier/config',
    rules: prettierConfigRules,
  },
]);

export default defineConfig([
  ...jsConfig,
  ...reactConfig,
  ...typescriptConfig,
  ...prettierConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...jest.environments.globals.globals,
      },
    },

    plugins: {
      jest,
      "prefer-arrow": preferArrow,
      "styled-components-a11y": styledComponentsA11Y,
    },

    rules: {
      "class-methods-use-this": "off",
      "@typescript-eslint/no-shadow": "off",
      "no-underscore-dangle": "off",
      "jest/no-mocks-import": "off",
      "@stylistic/lines-between-class-members": "off",
      "import-x/extensions": "off",
      "import-x/prefer-default-export": "off",
      "import-x/no-named-as-default": "off",
      "react/require-default-props": "off",
      "react/sort-comp": "off",
      "jest/expect-expect": "off",
      "default-case": "off",
      "import-x/no-unresolved": "off",
      "import-x/no-cycle": "off",
      "import-x/no-relative-packages": "off",
      "import-x/no-rename-default": "off",
      "import-x/no-useless-path-segments": "off",
      "react/jsx-filename-extension": "off",

      curly: ["error", "all"],
      "func-names": "error",
      "no-console": "error",

      "no-magic-numbers": ["error", {
        ignore: [-1, 0, 1, 2, 3, 4],
        ignoreArrayIndexes: true,
      }],

      "prefer-destructuring": ["error", {
        array: false,
      }],

      "no-restricted-imports": ["error", {
        paths: [{
          name: "@mui/material",
          message: "Use import from \"@mui/material/<your-component>\" instead.",
        }, {
          name: "@mui/icons-material",
          message: "Use import from \"@mui/icons-material/<your-icon>\" instead.",
        }],

        patterns: [{
          group: ["shared/*", "!shared/api"],
          message: "Use import from \"shared\" instead (you might need to add it as an export in index.ts).",
        }, {
          group: ["shared/api/*", "!shared/api/endpoints"],
          message: "Use import from \"shared/api\" instead (you might need to add it as an export in index.ts).",
        }, {
          group: ["shared/api/endpoints/*", "!shared/api/endpoints/testing"],
          message: "Use import from \"shared/api\" instead (you might need to add it as an export in index.ts).",
        }],
      }],

      "react/function-component-definition": ["error", {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      }],

      "react/no-did-mount-set-state": "error",
      "react/no-unused-prop-types": "warn",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",

      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "_(unused)?",
        varsIgnorePattern: "_(unused)?",
        ignoreRestSiblings: true,
        caughtErrorsIgnorePattern: "^(e|err|error|_)$",
      }],

      "@typescript-eslint/strict-boolean-expressions": ["error", {
        allowNullableBoolean: true,
        allowNullableString: true,
      }],


      "@typescript-eslint/consistent-indexed-object-style": "off",
      "@typescript-eslint/prefer-destructuring": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unnecessary-type-arguments": "off",

      "@typescript-eslint/array-type": ["error", {
        default: "array",
      }],

      "@typescript-eslint/switch-exhaustiveness-check": "off",
      "@typescript-eslint/no-non-null-assertion": "error",

      "jest/consistent-test-it": "error",
      "jest/no-alias-methods": "error",

      "prefer-arrow/prefer-arrow-functions": "error",

      "styled-components-a11y/label-has-for": ["error", {
        components: ["Label"],
        required: {
          every: ["id"],
        },
        allowChildren: false,
      }],

      "styled-components-a11y/no-noninteractive-element-to-interactive-role": ["error", {
        fieldset: ["radiogroup"],
      }],
    },

    linterOptions: {
      reportUnusedDisableDirectives: true,
    },

    settings: {
      react: {
        version: "19.1.1",
      },
    },
  },

  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      parser: plugins.typescriptEslint.parser,
      parserOptions: {
        // New typescript-eslint mode: uses a shared project service instead of per-file program creation.
        projectService: true,
      },
    },
  },

  {
    ignores: [
      "**/reports/",
      "**/ios/",
      "**/android/",
      "**/dist/",
      ".eslintrc.js",
      "eslint.config.mjs",
      "**/*.js",
      "web/www/",
      "build-configs/integreat-e2e/assets/",
      "build-configs/integreat-test-cms/assets/",
    ],
  },

  {
    files: [
      "**/*.spec.{ts,tsx}",
      "**/*.e2e.ts",
      "**/__mocks__/*.{ts,tsx}",
      "**/testing/*.{ts,tsx}",
      "**/jest.setup.ts",
      "**/jest.config.ts",
    ],

    rules: {
      "global-require": "off",
      "no-console": "off",
      "no-magic-numbers": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "import-x/no-extraneous-dependencies": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "react/jsx-no-constructed-context-values": "off",
      "jest/no-export": "warn",
    },
  },

  {
    files: ["e2e-tests/**/*.conf.ts"],

    rules: {
      "no-magic-numbers": "off",
    },
  },

  {
    files: ["native/**"],

    rules: {
      "jsx-a11y/anchor-is-valid": "off",
    },
  },

  {
    files: ["**/tools/**", "translations/**", "e2e-tests/**", "**/metro.config.js"],

    rules: {
      "no-console": "off",
      "import-x/no-extraneous-dependencies": "off",
    },
  },

  {
    files: ["tools/**", "e2e-tests/**"],

    plugins: {
      unicorn,
    },

    rules: {
      "import-x/no-commonjs": "error",
      "unicorn/prefer-node-protocol": "error",
    },
  },

  {
    files: ["e2e-tests/**"],

    rules: {
      "@typescript-eslint/await-thenable": "off",
    },
  },

  {
    files: ["web/**"],
    rules: {
      ...jsxA11Y.configs.strict.rules,
    },
  },
]);
