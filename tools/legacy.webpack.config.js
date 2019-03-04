const path = require('path')
const nodeExternals = require('webpack-node-externals')
const fs = require('fs')

const dest = path.resolve(__dirname, '../dist')

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest)
}

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    path: dest,
    filename: 'index-legacy.js',
    library: 'integreatapiclient',
    libraryTarget: 'umd'
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
