const build = require('./build')
const task = require('./task')

module.exports = task('deploy', () => Promise.resolve()
  .then(() => build())
  .then(() => { throw new Error('Not yet implemented.') })
  .then(() => {
    setTimeout(() => process.exit())
  }))
