module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jest', 'prefer-arrow', 'styled-components-a11y'],
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:styled-components-a11y/strict',
  ],
  env: {
    es6: true,
    node: true,
    browser: true,
    'jest/globals': true,
  },
  ignorePatterns: [
    '**/reports/',
    '**/node_modules/',
    '**/ios/',
    '**/stylelint.config.js',
    '**/stylelint.config_css.js',
    '**/dist/',
    '**/lib-dist/',
    '.eslintrc.js',
    '**/babel.config.js',
    '**/react-native.config.js',
    '**/www/iframe.js',
  ],
  rules: {
    // Overly strict rules (for now)
    'class-methods-use-this': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'react/jsx-props-no-spreading': 'off',
    'jest/no-mocks-import': 'off',

    // Unwanted
    'lines-between-class-members': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'react/require-default-props': 'off',
    'jest/expect-expect': 'off',

    // Disabling since better @typescript-eslint rules available or they make no sense for ts projects
    'default-case': 'off',
    'no-use-before-define': 'off',
    'import/no-unresolved': 'off',
    'react/jsx-filename-extension': 'off',

    // Disabling since our class components are legacy anyway
    'react/sort-comp': 'off',
    'react/state-in-constructor': 'off',
    'react/static-property-placement': 'off',

    curly: ['error', 'all'],
    'no-console': 'error',
    'no-magic-numbers': [
      'error',
      {
        ignore: [-1, 0, 1, 2],
        ignoreArrayIndexes: true,
      },
    ],
    'prefer-destructuring': ['error', { array: false }],
    'prefer-object-spread': 'error',
    'func-names': 'error',

    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'react/no-did-mount-set-state': 'error',
    'react/no-unused-prop-types': 'warn',
    'react-hooks/exhaustive-deps': 'error',

    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '_(unused)?',
        varsIgnorePattern: '_(unused)?',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',

    'jest/consistent-test-it': 'error',
    'jest/no-alias-methods': 'error',

    'prefer-arrow/prefer-arrow-functions': 'error',

    // Force labels to have an id is important to connect them with input/text fields for screen reader
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
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  overrides: [
    {
      files: ['*.spec.{ts,tsx}', '**/__mocks__/*.{ts,tsx}', '**/testing/*.{ts,tsx}', 'jest.setup.ts', 'jest.config.ts'],
      rules: {
        'global-require': 'off',
        'no-console': 'off',
        'no-magic-numbers': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'import/no-extraneous-dependencies': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
      },
    },
    {
      files: ['**/native/**'],
      rules: {
        // This rule does not make sense in react native as we don't have normal anchor tags
        'jsx-a11y/anchor-is-valid': 'off',
      },
    },
    {
      files: ['**/tools/**', '**/translations/**', '**/e2e-tests/**'],
      rules: {
        'no-console': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
