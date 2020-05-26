const path = require('path')
const webpack = require('webpack')
const AssetsPlugin = require('assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const babelConfig = require('../.babelrc.js')
const getVersion = require('git-repo-version')

const createConfig = (env = {}) => {
  const { config_name: appConfigName } = env
  const validConfigNames = ['integreat', 'integreat-debug', 'malte']

  if (!appConfigName) {
    throw new Error('You need to specify a config name!')
  } else if (!validConfigNames.includes(appConfigName)) {
    throw new Error(`Invalid config name! Allowed configs: ${validConfigNames}`)
  }

  const production = appConfigName === 'integreat'

  console.log('Used config: ', appConfigName)
  console.log('Production: ', production)

  const appConfig = require(`./configs/${appConfigName}`)
  const configAssets = path.resolve(__dirname, `./configs/${appConfigName}/assets`)

  const nodeModules = path.resolve('./node_modules')
  const wwwDirectory = path.resolve(__dirname, '../www')
  const distDirectory = path.resolve(__dirname, '../dist')
  const srcDirectory = path.resolve(__dirname, '../src')

  // Add new polyfills here instead of importing them in the JavaScript code.
  // This way it is ensured that polyfills are loaded before any other code which might require them.
  const polyfills = [
    '@babel/polyfill',
    'whatwg-fetch',
    'url-polyfill'
  ]

  const config = {
    mode: production ? 'production' : 'development',
    resolve: {
      modules: [nodeModules]
    },
    // The base directory for resolving the entry option
    context: srcDirectory,
    // The entry point for the bundle
    entry: [
      '!!style-loader!css-loader!normalize.css/normalize.css',
      ...polyfills,
      'react-hot-loader/patch',
      /* The main entry point of your JavaScript application */
      './main.js'
    ],
    // Options affecting the output of the compilation
    output: {
      path: distDirectory,
      publicPath: '/',
      filename: production ? '[name].[hash].js' : '[name].js?[hash]',
      chunkFilename: production ? '[id].[chunkhash].js' : '[id].js?[chunkhash]',
      sourcePrefix: '  '
    },
    // Developer tool to enhance debugging, source maps
    // http://webpack.github.io/docs/configuration.html#devtool
    devtool: production ? false : 'source-map',
    devServer: {
      contentBase: distDirectory,
      compress: true,
      port: 9000,
      host: '0.0.0.0', // This enables devices in the same network to connect to the dev server
      hot: true,
      http2: false,
      historyApiFallback: true,
      stats: 'minimal'
    },
    // What information should be printed to the console
    stats: 'minimal',
    // The list of plugins for Webpack compiler
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: appConfig.appTitle,
        // Load a custom template (lodash by default)
        template: 'index.ejs',
        templateParameters: {
          config: appConfig
        }
      }),
      new CopyPlugin([
        { from: wwwDirectory, to: distDirectory },
        { from: configAssets, to: distDirectory }
      ]),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': production ? '"production"' : '"development"',
        __DEV__: !production,
        __VERSION__: JSON.stringify(getVersion()),
        __CONFIG__: JSON.stringify(appConfig)
      }),
      // Emit a JSON file with assets paths
      // https://github.com/sporto/assets-webpack-plugin#options
      new AssetsPlugin({
        path: distDirectory,
        filename: 'assets.json',
        prettyPrint: true
      }),
      new webpack.LoaderOptionsPlugin({
        debug: !production,
        minimize: production
      })
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          // https://github.com/webpack/webpack/issues/2031#issuecomment-219040479
          // Packages mentioned here probably use ES6 syntax which IE11 does not support. This is a problem because
          // in development mode webpack bundles the mentioned packages
          exclude: /node_modules\/(?!(strict-uri-encode|strip-ansi)\/).*/,
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
                enabled: production,
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

  // Optimize the bundle in release (production) mode
  if (production) {
    config.plugins.push(new webpack.optimize.AggressiveMergingPlugin())
  }

  return config
}

module.exports = createConfig
