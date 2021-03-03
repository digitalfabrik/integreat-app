module.exports = {
  plugins: [
    'wdio'
  ],
  extends: [
    '../.eslintrc.js',
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

  overrides: [{
    files: ['*.ts'],
    parser: '@typescript-eslint/parser',
    plugins: [
      'jasmine',
      '@typescript-eslint'
    ],
    extends: [
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
