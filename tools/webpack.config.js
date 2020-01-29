const path = require('path')
const webpack = require('webpack')
const AssetsPlugin = require('assets-webpack-plugin')
const babelConfig = require('../.babelrc.js')
const getVersion = require('git-repo-version')

const isDebug = global.DEBUG === false ? false : !process.argv.includes('--release')
const useHMR = !!global.HMR // Hot Module Replacement (HMR)

const createConfig = appConfig => {
  // Webpack configuration (main.js => www/dist/main.{hash}.js)
  // http://webpack.github.io/docs/configuration.html
  const config = {
    mode: isDebug ? 'development' : 'production',
    resolve: {
      modules: [
        path.resolve('./node_modules')
      ]
    },
    // The base directory for resolving the entry option
    context: path.resolve(__dirname, '../src'),
    // The entry point for the bundle
    entry: [
      '!!style-loader!css-loader!normalize.css/normalize.css',
      /* The main entry point of your JavaScript application */
      './main.js'
    ],
    // Options affecting the output of the compilation
    output: {
      path: path.resolve(__dirname, '../www/dist'),
      publicPath: '/dist/',
      filename: isDebug ? '[name].js?[hash]' : '[name].[hash].js',
      chunkFilename: isDebug ? '[id].js?[chunkhash]' : '[id].[chunkhash].js',
      sourcePrefix: '  '
    },
    // Developer tool to enhance debugging, source maps
    // http://webpack.github.io/docs/configuration.html#devtool
    devtool: isDebug ? 'source-map' : false,
    // What information should be printed to the console
    stats: 'minimal',
    // The list of plugins for Webpack compiler
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
        __DEV__: isDebug,
        __VERSION__: JSON.stringify(getVersion()),
        __CONFIG__: JSON.stringify(appConfig)
      }),
      // Emit a JSON file with assets paths
      // https://github.com/sporto/assets-webpack-plugin#options
      new AssetsPlugin({
        path: path.resolve(__dirname, '../www/dist'),
        filename: 'assets.json',
        prettyPrint: true
      }),
      new webpack.LoaderOptionsPlugin({
        debug: isDebug,
        minimize: !isDebug
      })
    ],
    // Options affecting the normal modules
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          // https://github.com/webpack/webpack/issues/2031#issuecomment-219040479
          exclude: /node_modules\/(?!(strict-uri-encode)\/).*/,
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

  // Optimize the bundle in release (production) mode
  if (!isDebug) {
    config.plugins.push(new webpack.optimize.AggressiveMergingPlugin())
  }

  // Hot Module Replacement (HMR) + React Hot Reload
  if (isDebug && useHMR) {
    config.entry.unshift('react-hot-loader/patch', 'webpack-hot-middleware/client')
    config.plugins.push(new webpack.NoEmitOnErrorsPlugin())
  }

  return config
}

module.exports = createConfig
