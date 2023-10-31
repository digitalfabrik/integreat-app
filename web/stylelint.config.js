module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-standard'],
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
