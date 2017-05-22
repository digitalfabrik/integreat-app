const path = require('path');
const build = require('./build');
const task = require('./task');
const config = require('./config');

module.exports = task('deploy', () => Promise.resolve()
  .then(() => build())
  .then(() => {
    setTimeout(() => process.exit());
  }));
