const defaultConfig = require('./wdio-browserstack.conf')

const config = { ...defaultConfig.config }
config.capabilities = config.capabilities.filter(cap =>
  cap.browserName.toLowerCase() === 'safari'
)
exports.config = config
