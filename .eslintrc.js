module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jest', 'prefer-arrow'],
  extends: [
    'standard',
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  env: {
    es6: true,
    node: true,
    browser: true,
    'jest/globals': true
  },
  ignorePatterns: [
    '**/reports/',
    '**/node_modules/',
    '**/ios/',
    '**/stylelint.config.js',
    '**/dist/',
    '**/lib-dist/',
    '.eslintrc.js',
    '**/babel.config.js'
  ],
  rules: {
    // Overly strict rules (for now)
    'class-methods-use-this': 'off',
    'global-require': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'lines-between-class-members': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'react/display-name': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',

    // Disabling since better @typescript-eslint rules available
    'default-case': 'off',
    'no-use-before-define': 'off',

    // Disabling since our class components are legacy anyway
    'react/sort-comp': 'off',
    'react/state-in-constructor': 'off',
    'react/static-property-placement': 'off',

    curly: ['error', 'all'],
    'no-console': ['error', { allow: ['error', 'warn'] }],
    'no-magic-numbers': [
      'error',
      {
        ignore: [-1, 0, 1, 2],
        ignoreArrayIndexes: true
      }
    ],
    'prefer-destructuring': ['error', { array: false }],
    'prefer-object-spread': 'error',

    'react/no-did-mount-set-state': 'error',
    'react/no-unused-prop-types': 'warn',

    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '_(unused)?',
        varsIgnorePattern: '_(unused)?',
        ignoreRestSiblings: true
      }
    ],
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',

    'jest/consistent-test-it': 'error',
    'jest/no-disabled-tests': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/no-test-prefixes': 'error',
    'jest/prefer-to-be-null': 'error',
    'jest/prefer-to-have-length': 'error',
    'jest/valid-describe': 'error',
    'jest/valid-expect': 'error',

    'prefer-arrow/prefer-arrow-functions': 'error'
  },
  parserOptions: {
    project: './tsconfig.json'
  },
  overrides: [
    {
      files: ['*.spec.{ts,tsx}', '**/__mocks__/*.ts'],
      rules: {
        'no-magic-numbers': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off'
      }
    }
  ],
  settings: {
    react: {
      version: 'detect'
    }
  }
}
