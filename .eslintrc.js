module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jest', 'prefer-arrow'],
  extends: [
    'standard',
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
    '**/ios/main.jsbundle',
    '**/stylelint.config.js',
    '**/dist/',
    '**/lib-dist/'
  ],
  rules: {
    'arrow-body-style': 'error',
    'arrow-parens': ['error', 'as-needed'],
    curly: ['error', 'all'],
    'no-console': ['error', { allow: ['error', 'warn'] }],
    'no-loop-func': 'error',
    'no-use-before-define': 'off',
    'prefer-const': 'error',
    'prefer-destructuring': ['error', { array: false }],
    'prefer-object-spread': 'error',
    'prefer-template': 'error',

    'react/display-name': 'off',
    'react/no-access-state-in-setstate': 'error',
    'react/no-did-mount-set-state': 'warn',
    'react/no-did-update-set-state': 'warn',
    'react/no-unescaped-entities': 'off',
    'react/no-unused-prop-types': 'warn',
    'react/no-typos': 'error',
    'react/prefer-es6-class': ['error', 'always'],

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '_(unused)?',
        varsIgnorePattern: '_(unused)?',
        ignoreRestSiblings: true
      }
    ],
    '@typescript-eslint/no-use-before-define': ['error'],

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
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      excludedFiles: ['*.spec.{ts,tsx}', '**/__mocks__/*.ts'],
      rules: {
        'no-magic-numbers': [
          'error',
          {
            ignore: [-1, 0, 1, 2],
            ignoreArrayIndexes: true
          }
        ],
        '@typescript-eslint/no-empty-function': 'off'
      }
    },
    {
      files: ['*.spec.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ],
  settings: {
    react: {
      version: 'detect'
    }
  }
}
