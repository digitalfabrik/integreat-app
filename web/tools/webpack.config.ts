import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import AssetsPlugin from 'assets-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { readFileSync } from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { join, resolve } from 'path'
import ReactRefreshTypeScript from 'react-refresh-typescript'
import TerserPlugin from 'terser-webpack-plugin'
import { Configuration, DefinePlugin, LoaderOptionsPlugin, optimize, WebpackPluginInstance } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import 'webpack-dev-server'

import loadBuildConfig, { WEB } from 'build-configs'
import { WebBuildConfigType } from 'build-configs/BuildConfigType'

// reset the tsconfig to the default configuration
delete process.env.TS_NODE_PROJECT

const SHORT_COMMIT_SHA_LENGTH = 8

// A first performance budget, which should be improved in the future: Maximum bundle size in Bytes; 2^20 = 1 MiB
// eslint-disable-next-line no-magic-numbers
const MiB = 2 ** 20
// eslint-disable-next-line no-magic-numbers
const MAX_BUNDLE_SIZE = 2.1 * MiB
// eslint-disable-next-line no-magic-numbers
const MAX_ASSET_SIZE = 2.1 * MiB

const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf8'))

const readVersionName = () => {
  const versionFile = readJson(resolve(__dirname, '../../version.json'))
  return versionFile.versionName
}

// https://developer.android.com/training/app-links/verify-site-associations#manual-verification
const generateAssetLinks = (buildConfig: WebBuildConfigType) => {
  if (!buildConfig.apps) {
    throw Error('Cannot generate asset links if no apps are available!')
  }

  return JSON.stringify(
    [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: buildConfig.apps.android.applicationId,
          sha256_cert_fingerprints: [buildConfig.apps.android.sha256CertFingerprint],
        },
      },
      ...buildConfig.allowedLookalikes.map(lookalikeSite => ({
        relation: ['lookalikes/allowlist'],
        target: { namespace: 'web', site: lookalikeSite },
      })),
    ],
    null,
    2,
  )
}

const generateAppleAppSiteAssociation = (buildConfig: WebBuildConfigType) => {
  if (!buildConfig.apps) {
    throw Error('Cannot generate apple app site association if no apps are available!')
  }

  return JSON.stringify(
    {
      applinks: {
        apps: [],
        details: [
          {
            appIDs: buildConfig.apps.ios.appleAppSiteAssociationAppIds,
            paths: ['*', '/'],
          },
        ],
      },
    },
    null,
    2,
  )
}

const generateManifest = (content: Buffer, buildConfig: WebBuildConfigType) => {
  const manifest = JSON.parse(content.toString())

  manifest.version = readVersionName()
  manifest.homepage_url = buildConfig.aboutUrls.default
  manifest.theme_color = buildConfig.lightTheme.palette.secondary.main
  manifest.name = buildConfig.appName
  manifest.description = buildConfig.appDescription

  if (buildConfig.apps) {
    manifest.related_applications = [
      {
        platform: 'play',
        id: buildConfig.apps.android.applicationId,
        url: `https://play.google.com/store/apps/details?id=${buildConfig.apps.android.applicationId}`,
      },
      {
        platform: 'itunes',
        url: `https://apps.apple.com/de/app/${buildConfig.apps.ios.appStoreName}/id${buildConfig.apps.ios.appStoreId}`,
      },
    ]
  }
  manifest.short_name = manifest.name
  return JSON.stringify(manifest, null, 2)
}

const createConfig = (
  env: {
    config_name?: string
    dev_server?: boolean
    bundle_analyzer?: boolean
    version_name?: string
    commit_sha?: string
  } = {},
): Configuration => {
  const {
    config_name: buildConfigName,
    commit_sha: passedCommitSha,
    version_name: passedVersionName,
    dev_server: devServer,
    bundle_analyzer: bundleAnalyer,
  } = env

  if (!buildConfigName) {
    throw new Error('Please specify a build config name')
  }

  const buildConfig = loadBuildConfig(buildConfigName, WEB)

  const NODE_ENV = devServer ? '"development"' : '"production"'
  process.env.NODE_ENV = NODE_ENV

  // If version_name is not supplied read it from version file
  const versionName = passedVersionName || readVersionName()
  const shortCommitSha = passedCommitSha?.substring(0, SHORT_COMMIT_SHA_LENGTH) || 'Commit SHA unknown'
  console.log('Used config: ', buildConfigName)
  console.log('Version name: ', versionName)
  console.log('Commit SHA: ', shortCommitSha)
  if (devServer) {
    console.log('Configured for running in dev server')
  }

  const configAssets = resolve(__dirname, `../node_modules/build-configs/${buildConfigName}/assets`)

  const nodeModules = resolve(__dirname, '../node_modules')
  const rootNodeModules = resolve(__dirname, '../../node_modules')
  const wwwDirectory = resolve(__dirname, '../www')
  const distDirectory = resolve(__dirname, `../dist/${buildConfigName}`)
  const srcDirectory = resolve(__dirname, '../src')
  const wellKnownDirectory = resolve(distDirectory, '.well-known')
  const bundleReportDirectory = resolve(__dirname, '../reports/bundle')
  const manifestPreset = resolve(__dirname, 'manifest.json')
  const assetLinksPreset = resolve(__dirname, 'assetlinks.json')
  const appleAppSiteAssociationPreset = resolve(__dirname, 'apple-app-site-association')

  const plugins: WebpackPluginInstance[] = []
  if (devServer) {
    plugins.push(new ReactRefreshPlugin())
  }

  const config: Configuration = {
    mode: devServer ? 'development' : 'production',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      modules: [nodeModules, rootNodeModules],
      alias: {
        'mapbox-gl': 'maplibre-gl',
      },
    },
    // The base directory for resolving the entry option
    context: srcDirectory,
    // The entry point for the bundle
    entry: [
      '!!style-loader!css-loader!normalize.css/normalize.css',
      /* The main entry point of your JavaScript application */
      './index.tsx',
    ],
    // Options affecting the output of the compilation
    output: {
      path: distDirectory,
      publicPath: '/',
      filename: devServer ? '[name].js?[contenthash]' : '[name].[contenthash].js',
      chunkFilename: devServer ? '[id].js?[chunkhash]' : '[id].[chunkhash].js',
      sourcePrefix: '  ',
    },
    optimization: {
      usedExports: true,
      runtimeChunk: 'single',
      minimize: !devServer,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
    },
    devtool: 'source-map',
    devServer: {
      static: { directory: distDirectory },
      compress: true,
      port: 9000,
      host: '0.0.0.0', // This enables devices in the same network to connect to the dev server
      hot: true,
      client: {
        // At e2e-tests the overlay can prevent clicks on elements
        overlay: {
          errors: !process.env.CI,
          warnings: !process.env.CI,
        },
      },
      historyApiFallback: true,
    },
    // What information should be printed to the console
    stats: 'minimal',
    performance: {
      hints: !devServer ? 'error' : false,
      maxEntrypointSize: MAX_BUNDLE_SIZE,
      maxAssetSize: MAX_ASSET_SIZE,
    },
    // The list of plugins for Webpack compiler
    plugins: [
      // @ts-expect-error invalid type
      new BundleAnalyzerPlugin({
        analyzerMode: !bundleAnalyer ? 'disabled' : 'static',
        generateStatsFile: !devServer,
        openAnalyzer: false,
        reportFilename: join(bundleReportDirectory, 'report.html'),
        statsFilename: join(bundleReportDirectory, 'stats.json'),
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: buildConfig.appName,
        template: 'index.ejs',
        templateParameters: {
          config: buildConfig,
        },
      }),
      new CopyPlugin({
        patterns: [
          { context: wwwDirectory, from: '**/*', to: distDirectory },
          { context: configAssets, from: '**/*', to: distDirectory },
          {
            from: manifestPreset,
            to: distDirectory,
            transform: (content: Buffer) => generateManifest(content, buildConfig),
          },
          ...(buildConfig.apps
            ? [
                {
                  from: assetLinksPreset,
                  to: wellKnownDirectory,
                  transform: () => generateAssetLinks(buildConfig),
                },
                {
                  from: appleAppSiteAssociationPreset,
                  to: wellKnownDirectory,
                  transform: () => generateAppleAppSiteAssociation(buildConfig),
                },
              ]
            : []),
        ],
      }),
      new DefinePlugin({
        'process.env.NODE_ENV': NODE_ENV,
        __VERSION_NAME__: JSON.stringify(versionName),
        __COMMIT_SHA__: JSON.stringify(shortCommitSha),
        __BUILD_CONFIG_NAME__: JSON.stringify(buildConfigName),
        __BUILD_CONFIG__: JSON.stringify(buildConfig),
      }),
      // Emit a JSON file with assets paths
      // https://github.com/sporto/assets-webpack-plugin#options
      // @ts-expect-error invalid type
      new AssetsPlugin({
        path: distDirectory,
        filename: 'assets.json',
        prettyPrint: true,
      }),
      new LoaderOptionsPlugin({
        debug: devServer,
        minimize: !devServer,
      }),
      ...plugins,
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                ...(devServer && {
                  getCustomTransformers: () => ({
                    before: [ReactRefreshTypeScript()],
                  }),
                }),
              },
            },
          ],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { minimize: true },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
          type: 'javascript/auto',
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
              },
            },
            {
              loader: 'img-loader',
              options: {
                enabled: !devServer,
                gifsicle: {
                  interlaced: false,
                },
                mozjpeg: {
                  progressive: true,
                  arithmetic: false,
                },
                optipng: false,
                pngquant: {
                  floyd: 0.5,
                  speed: 2,
                },
                svgo: {
                  plugins: [{ removeTitle: true }, { convertPathData: false }],
                },
              },
            },
          ],
        },
        {
          test: /\.(eot|ttf|wav|mp3)$/,
          type: 'assets/resource',
        },
      ],
    },
  }

  if (!devServer) {
    config.plugins?.push(new optimize.AggressiveMergingPlugin())
  }

  return config
}

export default createConfig
