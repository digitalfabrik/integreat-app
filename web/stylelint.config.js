module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-standard'],
  plugins: ['stylelint-use-logical'],
  rules: {
    // Enforce better ltr / rtl handling
    'csstools/use-logical': true,
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      customSyntax: 'postcss-styled-syntax',
      rules: {
        'function-no-unknown': null,
        'at-rule-no-unknown': null,
        'no-extra-semicolons': null,
        'media-query-no-invalid': null,
      },
    },
  ],
}
