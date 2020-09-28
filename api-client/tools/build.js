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
  fs.copyFileSync('package.json', 'dist/package.json')
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
  shell.exec('yarn babel src --out-dir dist/ --source-maps --ignore \'**/*.spec.js\'')
})

const copyFlowSource = task('flow-copy', async () => {
  await flowCopySource(['src'], 'dist', { ignore: ['**/*.spec.js'] })

  fs.copyFileSync('dist/index.js.flow', 'dist/index-umd.js.flow')
})

module.exports = task('build', () => {
  global.DEBUG = process.argv.includes('--debug') || false
  rimraf.sync('www/dist/*', { nosort: true, dot: true })
  return Promise.resolve()
    .then(prepare)
    .then(transpileES6)
    .then(copyFlowSource)
    .then(bundleUmd)
})
