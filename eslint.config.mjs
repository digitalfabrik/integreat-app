import { fixupPluginRules } from '@eslint/compat'
import jest from 'eslint-plugin-jest'
import jsxA11Y from 'eslint-plugin-jsx-a11y'
import preferArrow from 'eslint-plugin-prefer-arrow'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import styledComponentsA11Y from 'eslint-plugin-styled-components-a11y'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

// TODO import rules
const ignoredFiles = [
  '**/reports/',
  '**/node_modules/',
  '**/ios/',
  '**/android/',
  '**/dist/',
  'eslint.config.mjs',
  'web/www/',
  'build-configs/integreat-e2e/assets/',
  'build-configs/integreat-test-cms/assets/',
  // TODO remove
  '.eslintrc.js',
]

export default [
  ...tsEslint.configs.stylistic,
  ...tsEslint.configs.strict,
  react.configs.flat.recommended,
  jest.configs['flat/recommended'],
  jsxA11Y.flatConfigs.recommended,
  styledComponentsA11Y.flatConfigs.strict,
  // importPlugin.flatConfigs.recommended,
  // ...compat.extends('airbnb', 'airbnb/hooks'),
  {
    ignores: ignoredFiles,
  },
  {
    plugins: {
      '@typescript-eslint': tsEslint.plugin,
      'prefer-arrow': preferArrow,
      react,
      jest,
      'react-hooks': fixupPluginRules(reactHooks),
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // ...importPlugin.flatConfigs.recommended.rules,

      // Will be fixed soonish
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',

      'class-methods-use-this': 'off',
      'default-case': 'off',
      'no-shadow': 'off',
      'no-underscore-dangle': 'off',
      'no-use-before-define': 'off',
      'react/display-name': 'off',
      'react/jsx-filename-extension': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/sort-comp': 'off',
      'lines-between-class-members': 'off',
      'jest/expect-expect': 'off',
      'jest/no-mocks-import': 'off',

      curly: ['error', 'all'],
      'func-names': 'error',
      'no-console': 'error',
      'no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1, 2],
          ignoreArrayIndexes: true,
        },
      ],
      'prefer-destructuring': [
        'error',
        {
          array: false,
        },
      ],
      'prefer-object-spread': 'error',

      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-no-useless-fragment': [
        'error',
        {
          allowExpressions: true,
        },
      ],
      'react/no-did-mount-set-state': 'error',
      'react/no-unused-prop-types': 'warn',
      'react-hooks/exhaustive-deps': 'error',

      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '_(unused)?',
          varsIgnorePattern: '_(unused)?',
          caughtErrorsIgnorePattern: '_(unused)?',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/prefer-ts-expect-error': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowNullableBoolean: true,
          allowNullableString: true,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      'jest/consistent-test-it': 'error',
      'jest/no-alias-methods': 'error',

      'prefer-arrow/prefer-arrow-functions': 'error',

      'styled-components-a11y/label-has-for': [
        'error',
        {
          components: ['Label'],

          required: {
            every: ['id'],
          },

          allowChildren: false,
        },
      ],
      'styled-components-a11y/no-noninteractive-element-to-interactive-role': [
        'error',
        {
          fieldset: ['radiogroup'],
        },
      ],
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...jest.environments.globals.globals,
      },

      ecmaVersion: 'latest',
      parser: tsEslint.parser,
      parserOptions: {
        project: true,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    settings: {
      react: {
        version: '18.2.0',
      },
    },
  },
  {
    files: [
      '**/*.spec.{ts,tsx}',
      '**/*.e2e.ts',
      '**/__mocks__/*.{ts,tsx}',
      '**/testing/*.{ts,tsx}',
      '**/jest.setup.ts',
      '**/jest.config.ts',
    ],

    rules: {
      'global-require': 'off',
      'no-console': 'off',
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'react/jsx-no-constructed-context-values': 'off',
    },
  },
  {
    files: ['native/**'],

    rules: {
      'jsx-a11y/anchor-is-valid': 'off',
    },
  },
  {
    files: ['**/tools/**', 'translations/**', 'e2e-tests/**', '**/metro.config.js'],

    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['tools/**', 'e2e-tests/**'],

    plugins: {
      unicorn,
    },

    rules: {
      'unicorn/prefer-node-protocol': 'error',
    },
  },
]

//
// export default [
//   {
//     files: ['**/*.ts', '**/*.tsx'],
//   // ...fixupConfigRules(
//   //   compat.extends(
//   //     'airbnb',
//   //     'airbnb/hooks',
//   //     'plugin:typescript-eslint/recommended',
//   //     'plugin:react/recommended',
//   //     'plugin:react-hooks/recommended',
//   //     'prettier',
//   //     'plugin:jest/recommended',
//   //     'plugin:jest/style',
//   //     'plugin:styled-components-a11y/strict',
//   //   ),
//   // ),
//     plugins: {
//       'typescript-eslint': typescriptEslint,
//       jest,
//       'jsx-a11y': jsxA11Y,
//       'jsx-expressions': jsxExpressions,
//       'prefer-arrow': preferArrow,
//       react,
//       'react-hooks': reactHooks,
//       'styled-components-a11y': styledComponentsA11Y,
//     },
