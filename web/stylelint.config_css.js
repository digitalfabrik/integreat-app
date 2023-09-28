module.exports = {
  extends: require.resolve('stylelint-config-standard'),
  rules: {
    'unit-allowed-list': ['em', 'rem', 'px', '%'],
    'string-quotes': null,
  },
}
