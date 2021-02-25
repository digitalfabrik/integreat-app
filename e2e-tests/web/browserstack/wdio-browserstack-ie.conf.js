const defaultBrowserstackConfig = require('./wdio-browserstack.conf')

const config = { ...defaultBrowserstackConfig.config }
config.capabilities = config.capabilities.filter(cap =>
  cap.browserName?.toLowerCase() === 'ie'
)

exports.config = config
