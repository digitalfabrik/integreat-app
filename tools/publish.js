const firebase = require('firebase-tools')
const build = require('./build')
const task = require('./task')

module.exports = task('deploy', () => Promise.resolve()
  .then(() => build())
  .then(() => firebase.deploy())
  .then(() => {
    setTimeout(() => process.exit())
  }))
