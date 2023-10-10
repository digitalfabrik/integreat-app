module.exports = {
  extends: [require.resolve('stylelint-config-recommended'), require.resolve('stylelint-config-standard')],
  overrides: [
    {
      files: ['**/*.css'],
      rules: {
        'unit-allowed-list': ['em', 'rem', 'px', '%'],
        'string-quotes': null,
      },
    },
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      customSyntax: require.resolve('postcss-styled-syntax'),
      rules: {
        'function-no-unknown': null,
        'at-rule-no-unknown': null,
        'no-extra-semicolons': null,
        'media-query-no-invalid': null,
        'alpha-value-notation': null,
        'color-function-notation': null,
        'keyframes-name-pattern': null,
      },
    },
  ],
}
