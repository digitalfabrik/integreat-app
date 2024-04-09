module.exports = {
  extends: ['stylelint-react-native', 'stylelint-config-recommended', 'stylelint-config-standard'],
  customSyntax: 'postcss-styled-syntax',
  rules: {
    // Properties like shadow-radius are valid properties (while only supported on iOS)
    // Also text-align-vertical is valid (but only on android)
    'property-no-unknown': [true, { ignoreProperties: [/shadow-.*/, 'text-align-vertical'] }],

    // inset shorthand doesn't work on react-native
    'declaration-block-no-redundant-longhand-properties': [true, { ignoreShorthands: ['inset'] }],

    'alpha-value-notation': 'number',

    // not working on native
    'color-function-notation': null,
  },
}
