module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-standard'],
  plugins: ['stylelint-use-logical'],
  customSyntax: 'postcss-styled-syntax',
  rules: {
    // Enforce better ltr / rtl handling
    'csstools/use-logical': [true, { except: [/bottom$/, /top$/, /width$/, /height$/] }],

    // False positives for string interpolated values e.g. '@media screen and ${dimensions.smallViewport}'
    'media-query-no-invalid': null,
  },
}
