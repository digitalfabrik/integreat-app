module.exports = {
  extends: require.resolve('stylelint-config-recommended'),
  customSyntax: require.resolve('postcss-jsx'),
  rules: {
    'function-no-unknown': null,
    'at-rule-no-unknown': null,
    'no-extra-semicolons': null,
    'media-query-no-invalid': null,
  },
}
