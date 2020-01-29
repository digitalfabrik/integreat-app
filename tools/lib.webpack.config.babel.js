const path = require('path')
const webpack = require('webpack')
const babelConfig = require('../.babelrc.js')
const getVersion = require('git-repo-version')
const nodeExternals = require('webpack-node-externals')
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin')

const basePackageValues = {
  'name': '@integreat-app/shared',
  'version': '0.0.4',
  'main': './index.js'
}

const versionsPackageFilename = path.resolve(__dirname, '../package.json')

module.exports = (env = {}) => {
  if (env.prod === undefined) {
    throw Error('You need to specify a mode!')
  }

  const isDebug = env.prod === 'false'
  console.log('isDebug: ', isDebug)

  return {
    mode: 'production',
    resolve: {
      modules: [
        path.resolve('./node_modules')
      ]
    },
    // The base directory for resolving the entry option
    context: path.resolve(__dirname, '../src'),
    // The entry point for the bundle
    entry: ['./lib.js'],

    externals: [nodeExternals()],
    // Options affecting the output of the compilation
    output: {
      path: path.resolve(__dirname, '../lib-dist'),
      publicPath: '/lib-dist/',
      filename: 'index.js',
      sourcePrefix: '  ',
      library: '@integreat/shared',
      libraryTarget: 'umd'
    },
    // Developer tool to enhance debugging, source maps
    // http://webpack.github.io/docs/configuration.html#devtool
    devtool: isDebug ? 'source-map' : false,
    // What information should be printed to the console
    stats: 'verbose',
    // The list of plugins for Webpack compiler
    plugins: [
      new GeneratePackageJsonPlugin(basePackageValues, versionsPackageFilename),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
        __DEV__: false,
        __VERSION__: JSON.stringify(getVersion())
      }),
      new webpack.LoaderOptionsPlugin({
        debug: false,
        minimize: true
      })
    ],
    // Options affecting the normal modules
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [path.resolve(__dirname, '../src')],
          loader: 'babel-loader',
          options: babelConfig
        },
        {
          test: /\.html$/,
          use: [{ loader: 'html-loader', options: { minimize: true } }]
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          loaders: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000
              }
            },
            {
              loader: 'img-loader',
              options: {
                enabled: !isDebug,
                gifsicle: {
                  interlaced: false
                },
                mozjpeg: {
                  progressive: true,
                  arithmetic: false
                },
                optipng: false,
                pngquant: {
                  floyd: 0.5,
                  speed: 2
                },
                svgo: {
                  plugins: [
                    { removeTitle: true },
                    { convertPathData: false }
                  ]
                }
              }
            }
          ]
        },
        {
          test: /\.(eot|ttf|wav|mp3)$/,
          loader: 'file-loader'
        }
      ]
    }
  }
}
