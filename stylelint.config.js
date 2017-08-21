module.exports = {
  extends: 'stylelint-config-anfema',
  rules: {
    indentation: 2,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'else',
          'for',
          'function',
          'if',
          'include',
          'mixin',
          'define-mixin',
          'return',
          'while'
        ]
      }
    ]
  }
}
