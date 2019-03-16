const fs = require('fs')
const rimraf = require('rimraf')
const webpack = require('webpack')
const task = require('./task')
const path = require('path')
const flowCopySource = require('flow-copy-source')
const shell = require('shelljs')

const prepare = task('prepare', () => {
  const dest = path.resolve(__dirname, '../dist')

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest)
  }
  fs.createReadStream('package.json').pipe(fs.createWriteStream('dist/package.json'))
})

const bundleUmd = task('bundle-umd', () => {
  const webpackConfig = require('./umd.webpack.config.js')
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

const transpileES6 = task('transpile-es6', () => {
  shell.exec('node node_modules/.bin/babel src --out-dir dist/ --source-maps --ignore \'**/*.spec.js\'')
})

const copyFlowSource = task('flow-copy', () => {
  return flowCopySource(['src'], 'dist', {ignore: ['**/*.spec.js']})
})

module.exports = task('build', () => {
  global.DEBUG = process.argv.includes('--debug') || false
  rimraf.sync('www/dist/*', {nosort: true, dot: true})
  return Promise.resolve()
    .then(prepare)
    .then(transpileES6)
    .then(copyFlowSource)
    .then(bundleUmd)
})
