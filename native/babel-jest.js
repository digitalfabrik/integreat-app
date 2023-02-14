// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
const babelJest = require('babel-jest')

module.exports = babelJest.createTransformer({
  rootMode: 'upward',
})
