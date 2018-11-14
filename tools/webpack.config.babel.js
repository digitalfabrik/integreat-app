const path = require('path')
const babelConfig = require('../.babelrc.js')

module.exports.default = () => ({
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js',
    library: 'integreatapiclient',
    libraryTarget: 'umd'
  },
  optimization: {
    minimizer: []
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: babelConfig
        }
      }
    ]
  }
})
