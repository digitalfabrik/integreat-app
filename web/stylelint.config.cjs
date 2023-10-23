module.exports = {
  extends: [require.resolve('stylelint-config-recommended'), require.resolve('stylelint-config-standard')],
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
