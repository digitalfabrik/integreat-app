const fs = require('fs')
const rimraf = require('rimraf')
const ejs = require('ejs')
const webpack = require('webpack')
const fsExtra = require('fs-extra')
const task = require('./task')
const config = require('./integreat-config')

// Render html into the /www folder
const html = task('html', appConfigName => {
  const webpackConfig = require('./webpack.config')
  const assets = JSON.parse(fs.readFileSync('./www/dist/assets.json', 'utf8'))
  const template = fs.readFileSync('./tools/index.ejs', 'utf8')
  const render = ejs.compile(template, {filename: './tools/index.ejs'})
  const output = render({debug: webpackConfig.debug, bundle: assets.main.js, config})
  fs.writeFileSync('./www/index.html', output, 'utf8')
  return Promise.resolve(appConfigName)
})

// Bundle JavaScript, CSS and image files with Webpack
const bundle = task('bundle', appConfigName => {
  const appConfig = require(`./${appConfigName}-config`)
  const createWebpackConfig = require('./webpack.config')
  const webpackConfig = createWebpackConfig(appConfig)
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        reject(err)
      } else {
        console.log(stats.toString(webpackConfig.stats))
        resolve(appConfigName)
      }
    })
  })
})

const copyAssets = task('copyAssets', appConfigName => {
  fsExtra.copySync(`./tools/${appConfigName}-config/assets/`, './www/')
  return Promise.resolve(appConfigName)
})

//
// Build website into a distributable format
// -----------------------------------------------------------------------------
module.exports = task('build', (appConfigName = 'integreat') => {
  global.DEBUG = process.argv.includes('--debug') || false
  rimraf.sync('www/dist/*', {nosort: true, dot: true})
  return Promise.resolve(appConfigName)
    .then(bundle)
    .then(html)
    .then(copyAssets)
})
