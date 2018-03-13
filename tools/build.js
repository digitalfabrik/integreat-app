const fs = require('fs')
const rimraf = require('rimraf')
const ejs = require('ejs')
const webpack = require('webpack')
const task = require('./task')
const config = require('./config')

// Copy ..html into the /www folder
const html = task('html', () => {
  const webpackConfig = require('./webpack.config')
  const assets = JSON.parse(fs.readFileSync('./www/dist/assets.json', 'utf8'))
  const template = fs.readFileSync('./www/index.ejs', 'utf8')
  const render = ejs.compile(template, {filename: './www/index.ejs'})
  const output = render({debug: webpackConfig.debug, bundle: assets.main.js, config})
  fs.writeFileSync('./www/index.html', output, 'utf8')
})

// Bundle JavaScript, CSS and image files with Webpack
const bundle = task('bundle', () => {
  const webpackConfig = require('./webpack.config')
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        reject(err)
      } else {
        console.log(stats.toString(webpackConfig.stats))
        resolve()
      }
    })
  })
})

//
// Build website into a distributable format
// -----------------------------------------------------------------------------
module.exports = task('build', () => {
  global.DEBUG = process.argv.includes('--debug') || false
  rimraf.sync('www/dist/*', {nosort: true, dot: true})
  return Promise.resolve()
    .then(bundle)
    .then(html)
})
