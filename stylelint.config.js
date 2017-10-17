module.exports = {
  extends: 'stylelint-config-anfema',
  rules: {
    indentation: 2,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'mixin',
          'define-mixin'
        ]
      }
    ]
  }
}
