module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-standard'],
  plugins: ['stylelint-use-logical'],
  customSyntax: 'postcss-styled-syntax',
  rules: {
    // Enforce better ltr / rtl handling
    'csstools/use-logical': [true, { except: [/bottom$/, /top$/, /width$/, /height$/] }],
  },
}
