const task = require('./task')
const glob = require('glob')
const fs = require('fs')

//
// Check if every .js file in src folder begins with '// (at)flow'
// -----------------------------------------------------------------------------
module.exports = task('check:flow-annotations', () => new Promise((resolve, reject) => {
  glob('src/**/*.js', (er, files) => {
    if (er) {
      return reject(er)
    }
    resolve(files)
  })
}).then(files => Promise.all(
  files.map(fileName => new Promise((resolve, reject) => fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      return reject(err)
    }
    if (!data.startsWith('// @flow')) {
      return resolve(fileName)
    }
    return resolve()
  })))
)).then(files => new Promise((resolve, reject) => {
  const missingAnnotationFiles = files.filter(file => !!file)
  if (missingAnnotationFiles.length === 0) {
    process.stdout.write('No files with missing flow annotation were found.\n')
    return resolve()
  } else {
    process.stdout.write('Flow annotation missing in following files:\n\n')
    const fileLog = `${missingAnnotationFiles.reduce((result, value) => { return `${result + value}\n` }, '')}\n`
    process.stdout.write(fileLog)
    reject(new Error('Found files without flow annotation.'))
  }
})))
