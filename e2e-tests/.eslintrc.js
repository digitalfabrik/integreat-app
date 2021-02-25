module.exports = {
  plugins: [
    'wdio'
  ],
  extends: [
    'eslint:recommended',
    'plugin:wdio/recommended'
  ],
  env: {
    es6: true,
    node: true,
    jasmine: true
  },
  globals: {
    browser: true
  },
  ignorePatterns: [
    '**/node_modules/'
  ],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    curly: ['error', 'all'],
    'jsx-quotes': ['error', 'prefer-single'],
    'max-len': ['warn', { code: 120 }],
    'no-loop-func': 'error',
    'prefer-const': 'error',
    'prefer-object-spread': 'error',
    'prefer-template': 'error'
  },
  overrides: [{
    files: ['*.ts'],
    parser: '@typescript-eslint/parser',
    plugins: [
      'jasmine',
      '@typescript-eslint'
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    rules: {
      'jasmine/no-disabled-tests': 'error',
      'jasmine/no-focused-tests': 'error',
      'jasmine/prefer-toBeUndefined': 'error',
      'jasmine/valid-expect': 'error'
    }
  }]
}
