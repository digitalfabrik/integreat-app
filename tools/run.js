const fs = require('fs')
const ejs = require('ejs')
const rimraf = require('rimraf')
const webpack = require('webpack')
const Browsersync = require('browser-sync')
const task = require('./task')

global.HMR = !process.argv.includes('--no-hmr') // Hot Module Replacement (HMR)

// Build the app and launch it in a browser for testing via Browsersync
module.exports = task('run', (appConfigName = 'integreat') => new Promise(resolve => {
  rimraf.sync('www/dist/*', { nosort: true, dot: true })
  let count = 0
  const bs = Browsersync.create()
  const appConfig = require(`./${appConfigName}-config`)
  const createWebpackConfig = require('./webpack.config')
  const webpackConfig = createWebpackConfig(appConfig)
  const compiler = webpack(webpackConfig)

  // Node.js middleware that compiles application in watch mode with HMR support
  // http://webpack.github.io/docs/webpack-dev-middleware.html
  const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: webpackConfig.stats
  })

  compiler.hooks.done.tap('run.js', (stats, callback) => {
    // Generate index.html page
    const bundle = stats.compilation.chunks.find(x => x.name === 'main').files[0]
    const template = fs.readFileSync('./tools/index.ejs', 'utf8')
    const render = ejs.compile(template, { filename: './tools/index.ejs' })
    const output = render({ debug: true, bundle: `/dist/${bundle}`, config: appConfig })
    fs.writeFileSync('./www/index.html', output, 'utf8')
    // Launch Browsersync after the initial bundling is complete
    // For more information visit https://browsersync.io/docs/options
    count += 1
    if (count === 1) {
      const DEFAULT_PORT = 3000
      bs.init({
        open: false,
        port: process.env.PORT || DEFAULT_PORT,
        ui: { port: Number(process.env.PORT || DEFAULT_PORT) + 1 },
        serveStatic: ['./www', `./tools/${appConfigName}-config/assets`],
        server: {
          baseDir: 'www',
          middleware: [
            webpackDevMiddleware,
            require('webpack-hot-middleware')(compiler),
            require('connect-history-api-fallback')()
          ]
        }
      }, resolve)
    }
  })
}))
