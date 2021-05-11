import {Configuration, DefinePlugin, LoaderOptionsPlugin, optimize} from "webpack";
import {join, resolve} from 'path'
import {CleanWebpackPlugin} from 'clean-webpack-plugin'
import {readFileSync} from "fs";
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import MomentTimezoneDataPlugin from 'moment-timezone-data-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import AssetsPlugin from 'assets-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

// TODO IGAPP-607: Add information from other packages
// const loadBuildConfig = require('build-configs').default
// const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
// const babelConfig = require('../babel.config.js')
// const translations = require('translations')
// const { WEB, ANDROID, IOS } = require('build-configs')
// reset the tsconfig to the default configuration
delete process.env.TS_NODE_PROJECT
const currentYear = new Date().getFullYear()

const SHORT_COMMIT_SHA_LENGTH = 8

// A first performance budget, which should be improved in the future: Maximum bundle size in Bytes; 2^20 = 1 MiB
// eslint-disable-next-line no-magic-numbers
const MAX_BUNDLE_SIZE = 1.64 * Math.pow(2, 20)
// eslint-disable-next-line no-magic-numbers
const MAX_ASSET_SIZE = 2.1 * Math.pow(2, 20)

const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf8'))

const readVersionName = () => {
    const versionFile = readJson(resolve(__dirname, '../../version.json'))
    return versionFile.versionName
}

const generateManifest = (content: Buffer, buildConfigName: string) => {
    // TODO IGAPP-607: Generate Manifest dependand on buildConfig
    // const manifest = JSON.parse(content.toString())

    // const androidBuildConfig = loadBuildConfig(buildConfigName, ANDROID)
    // const iOSBuildConfig = loadBuildConfig(buildConfigName, IOS)
    // const webBuildConfig = loadBuildConfig(buildConfigName, WEB)

    // manifest.version = readVersionName()
    // manifest.homepage_url = webBuildConfig.aboutUrls.default
    // manifest.theme_color = webBuildConfig.lightTheme.colors.themeColor
    // manifest.name = webBuildConfig.appName
    // manifest.description = webBuildConfig.appDescription
    // manifest.related_applications = [
    //   {
    //     platform: 'play',
    //     id: androidBuildConfig.applicationId,
    //     url: `https://play.google.com/store/apps/details?id=${androidBuildConfig.applicationId}`
    //   },
    //   {
    //     platform: 'itunes',
    //     url: `https://apps.apple.com/de/app/${iOSBuildConfig.itunesAppName}/id${iOSBuildConfig.appleId}`
    //   }
    // ]
    // manifest.short_name = manifest.name
    // return JSON.stringify(manifest, null, 2)
    return '{}'
}

const createConfig = (
    // eslint-disable-next-line camelcase
    env: { config_name?: string, dev_server?: boolean, version_name?: string, commit_sha?: string } = {}
) => {
    const {
        config_name: buildConfigName,
        commit_sha: passedCommitSha,
        version_name: passedVersionName,
        dev_server: devServer
    } = env

    if (!buildConfigName) {
        throw new Error('Please specify a build config name')
    }

    // TODO IGAPP-607: Load build config
    // const buildConfig = loadBuildConfig(buildConfigName, WEB)

    // We have to override the env of the current process, such that babel-loader works with that.
    const NODE_ENV = devServer ? '"development"' : '"production"'
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    process.env.NODE_ENV = NODE_ENV

    // If version_name is not supplied read it from version file
    const versionName = passedVersionName || readVersionName()
    // TODO IGAPP-607: Process commit sha
    // const shortCommitSha = passedCommitSha.substring(0, SHORT_COMMIT_SHA_LENGTH) || 'Commit SHA unknown'
    const shortCommitSha = 'Commit SHA unknown'

    console.log('Used config: ', buildConfigName)
    console.log('Configured as running in dev server: ', !devServer)
    console.log('Version name: ', versionName)
    console.log('Commit SHA ', shortCommitSha)

    const configAssets = resolve(__dirname, `../node_modules/build-configs/${buildConfigName}/assets`)

    const nodeModules = resolve(__dirname, '../node_modules')
    const rootNodeModules = resolve(__dirname, '../../node_modules')
    const wwwDirectory = resolve(__dirname, '../www')
    const distDirectory = resolve(__dirname, `../dist/${buildConfigName}`)
    const srcDirectory = resolve(__dirname, '../src')
    const bundleReportDirectory = resolve(__dirname, '../reports/bundle')
    const manifestPreset = resolve(__dirname, 'manifest.json')

    // Add new polyfills here instead of importing them in the JavaScript code.
    // This way it is ensured that polyfills are loaded before any other code which might require them.
    const polyfills = ['whatwg-fetch', 'url-polyfill']
    
    const config: Configuration = {
        mode: devServer ? 'development' : 'production',
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
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
            './index.tsx'
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
        // @ts-ignore devServer is not available here
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
            maxAssetSize: MAX_ASSET_SIZE
        },
        // The list of plugins for Webpack compiler
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: devServer ? 'disabled' : 'static',
                generateStatsFile: !devServer,
                openAnalyzer: false,
                reportFilename: join(bundleReportDirectory, 'report.html'),
                statsFilename: join(bundleReportDirectory, 'stats.json')
            }),
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                // TODO IGAPP-607: Pass build config to index.ejs and set title correctly
                // title: buildConfig.appName,
                title: 'App Name',
                // Load a custom template (lodash by default)
                template: 'index.ejs',
                // templateParameters: {
                //   config: buildConfig
                // }
            }),
            new CopyPlugin({
                patterns: [
                    {from: wwwDirectory, to: distDirectory},
                    {from: configAssets, to: distDirectory},
                    {
                        from: manifestPreset,
                        to: distDirectory,
                        transform(content: Buffer) {
                            return generateManifest(content, buildConfigName)
                        }
                    }
                ]
            }),
            new DefinePlugin({
                'process.env.NODE_ENV': NODE_ENV,
                __VERSION_NAME__: JSON.stringify(versionName),
                __COMMIT_SHA__: JSON.stringify(shortCommitSha),
                __BUILD_CONFIG_NAME__: JSON.stringify(buildConfigName),
                // __BUILD_CONFIG__: JSON.stringify(buildConfig)
            }),
            // Emit a JSON file with assets paths
            // https://github.com/sporto/assets-webpack-plugin#options
            new AssetsPlugin({
                path: distDirectory,
                filename: 'assets.json',
                prettyPrint: true
            }),
            new LoaderOptionsPlugin({
                debug: devServer,
                minimize: !devServer
            }),
            // We use moment-timezone for parsing a limited range of years here with GTM data in the integreat-api-client
            new MomentTimezoneDataPlugin({
                startYear: currentYear,
                endYear: currentYear + 2
            }),
            // moment has no support for 'ti' (Tigrinya) and 'so' (Somali), hence we have to use the ignoreInvalidLocales flag
            // new MomentLocalesPlugin({
            //   localesToKeep: translations.config.getSupportedLanguageTags(),
            //   ignoreInvalidLocales: true
            // })
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                // TODO IGAPP-607: Think about what to do with *.js
                // {
                //   test: /\.jsx?$/,
                //   // https://github.com/webpack/webpack/issues/2031#issuecomment-219040479
                //   // Packages mentioned here probably use ES6 syntax which IE11 does not support. This is a problem because
                //   // in development mode webpack bundles the mentioned packages
                //   exclude: /node_modules\/(?!(strict-uri-encode|strip-ansi|build-configs|api-client)\/).*/,
                //   loader: 'babel-loader',
                //   options: babelConfig
                // },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {minimize: true}
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    include: /node_modules/,
                    loaders: [{loader: 'style-loader'}, {loader: 'css-loader'}]
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
                                    plugins: [{removeTitle: true}, {convertPathData: false}]
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
    if (!devServer && optimize) {
        config.plugins?.push(new optimize.AggressiveMergingPlugin())
    }

    return config
}

module.exports = createConfig
