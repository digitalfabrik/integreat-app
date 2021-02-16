// @flow

// Transpile and load build-configs in root directory
require('@babel/register')({
  only: [/(build-configs|translations)/]
})
const loadBuildConfig = require('build-configs').default

const path = require('path')
const webpack = require('webpack')
const AssetsPlugin = require('assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const babelConfig = require('../babel.config.js')
const fs = require('fs')
const translations = require('translations')
const { WEB, ANDROID, COMMON } = require('build-configs')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const currentYear = new Date().getFullYear()

const SHORT_COMMIT_SHA_LENGTH = 8

// A first performance budget, which should be improved in the future: Maximum bundle size in Bytes; 2^20 = 1 MiB
// eslint-disable-next-line no-magic-numbers
const MAX_BUNDLE_SIZE = 1.64 * Math.pow(2, 20)

const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'))

const readVersionName = () => {
  const versionFile = readJson(path.resolve(__dirname, '../../version.json'))
  return versionFile.versionName
}

const generateManifest = (content: string, buildConfigName: string): string => {
  const manifest = JSON.parse(content.toString())

  const androidBuildConfig = loadBuildConfig(buildConfigName, ANDROID)
  const commonBuildConfig = loadBuildConfig(buildConfigName, COMMON)

  manifest.version = readVersionName()
  manifest.homepage_url = commonBuildConfig.aboutUrls.default
  manifest.theme_color = commonBuildConfig.lightTheme.colors.themeColor
  manifest.related_applications = [{
    platform: 'play',
    id: androidBuildConfig.applicationId,
    url: `https://play.google.com/store/apps/details?id=${androidBuildConfig.applicationId}`
  }]

  switch (buildConfigName) {
    case 'integreat':
    case 'integreat-test-cms':
      manifest.name = 'Integreat'
      manifest.description = 'Daily Guide for Refugees. Digital. Multilingual. Free.'
      break
    case 'aschaffenburg':
      manifest.name = 'Aschaffenburg App'
      manifest.description = 'App of the city Aschaffenburg to inform about social topics'
      break
    case 'malte':
      manifest.name = 'Malte'
      manifest.description = 'Guide of the Malteser Werke for Refugees. Digital. Multilingual. Free.'
      break
    default:
      throw Error('Manifest could not be created!')
  }

  manifest.short_name = manifest.name
  return JSON.stringify(manifest, null, 2)
}

const createConfig = (env: { config_name?: string, dev_server?: boolean, version_name?: string, commit_sha?: string } = {}) => {
  const { config_name: buildConfigName, commit_sha: commitSha, version_name: versionName, dev_server: devServer } = env

  if (!buildConfigName) {
    throw new Error('Please specificy build config name')
  }

  const buildConfig = loadBuildConfig(buildConfigName, WEB)

  // We have to override the env of the current process, such that babel-loader works with that.
  const NODE_ENV = devServer ? '"development"' : '"production"'
  process.env.NODE_ENV = NODE_ENV

  // If version_name is not supplied read it from version file
  let version = versionName || readVersionName()
  if (commitSha) {
    version = `${version}+${commitSha.substring(0, SHORT_COMMIT_SHA_LENGTH)}`
  }

  console.log('Used config: ', buildConfigName)
  console.log('Configured as running in dev server: ', !devServer)
  console.log('Version: ', version)

  const configAssets = path.resolve(__dirname, `../node_modules/build-configs/${buildConfigName}/assets`)

  const nodeModules = path.resolve(__dirname, '../node_modules')
  const rootNodeModules = path.resolve(__dirname, '../../node_modules')
  const wwwDirectory = path.resolve(__dirname, '../www')
  const distDirectory = path.resolve(__dirname, `../dist/${buildConfigName}`)
  const srcDirectory = path.resolve(__dirname, '../src')
  const bundleReportDirectory = path.resolve(__dirname, '../reports/bundle')
  const manifestPreset = path.resolve(__dirname, 'manifest.json')

  // Add new polyfills here instead of importing them in the JavaScript code.
  // This way it is ensured that polyfills are loaded before any other code which might require them.
  const polyfills = [
    '@babel/polyfill',
    'whatwg-fetch',
    'url-polyfill'
  ]

  const config = {
    mode: devServer ? 'development' : 'production',
    resolve: {
      modules: [nodeModules, rootNodeModules]
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
      filename: devServer ? '[name].js?[hash]' : '[name].[hash].js',
      chunkFilename: devServer ? '[id].js?[chunkhash]' : '[id].[chunkhash].js',
      sourcePrefix: '  '
    },
    optimization: {
      usedExports: true
    },
    devtool: 'source-map',
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
    performance: {
      hints: !devServer ? 'error' : false,
      maxEntrypointSize: MAX_BUNDLE_SIZE,
      maxAssetSize: MAX_BUNDLE_SIZE
    },
    // The list of plugins for Webpack compiler
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: devServer ? 'disabled' : 'static',
        generateStatsFile: !devServer,
        openAnalyzer: false,
        reportFilename: path.join(bundleReportDirectory, 'report.html'),
        statsFilename: path.join(bundleReportDirectory, 'stats.json')
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: buildConfig.appName,
        // Load a custom template (lodash by default)
        template: 'index.ejs',
        templateParameters: {
          config: buildConfig
        }
      }),
      new CopyPlugin({
        patterns: [
          { from: wwwDirectory, to: distDirectory },
          { from: configAssets, to: distDirectory },
          {
            from: manifestPreset,
            to: distDirectory,
            transform (content: string, path: any): string { return generateManifest(content, buildConfigName) }
          }
        ]
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': NODE_ENV,
        __VERSION__: JSON.stringify(version),
        __BUILD_CONFIG_NAME__: JSON.stringify(buildConfigName),
        __BUILD_CONFIG__: JSON.stringify(buildConfig)
      }),
      // Emit a JSON file with assets paths
      // https://github.com/sporto/assets-webpack-plugin#options
      new AssetsPlugin({
        path: distDirectory,
        filename: 'assets.json',
        prettyPrint: true
      }),
      // $FlowFixMe Unable to find "LoaderOptionsPlugin" in "webpack"
      new webpack.LoaderOptionsPlugin({
        debug: devServer,
        minimize: !devServer
      }),
      // We use moment-timezone for parsing a limited range of years here with GTM data in the integreat-api-client
      new MomentTimezoneDataPlugin({
        startYear: currentYear,
        endYear: currentYear + 2
      }),
      // moment has no support for 'ti' (Tigrinya) and 'so' (Somali), hence we have to use the ignoreInvalidLocales flag
      new MomentLocalesPlugin({
        localesToKeep: translations.config.getSupportedLanguageCodes(),
        ignoreInvalidLocales: true
      })
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          // https://github.com/webpack/webpack/issues/2031#issuecomment-219040479
          // Packages mentioned here probably use ES6 syntax which IE11 does not support. This is a problem because
          // in development mode webpack bundles the mentioned packages
          exclude: /node_modules\/(?!(strict-uri-encode|strip-ansi|build-configs|api-client)\/).*/,
          loader: 'babel-loader',
          options: babelConfig
        },
        {
          test: /\.html$/,
          use: [{
            loader: 'html-loader',
            options: { minimize: true }
          }]
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
                enabled: !devServer,
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

  // Optimize the bundle in production mode
  if (!devServer) {
    // $FlowFixMe Unable to find "optimize" in "webpack"
    config.plugins.push(new webpack.optimize.AggressiveMergingPlugin())
  }

  return config
}

module.exports = createConfig
