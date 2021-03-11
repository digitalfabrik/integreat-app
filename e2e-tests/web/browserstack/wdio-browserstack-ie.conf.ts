import { config as defaultConfig } from './wdio-browserstack.conf'

const config = { ...defaultConfig }
config.capabilities = config.capabilities.filter(cap =>
  cap.browserName?.toLowerCase() === 'ie'
)

export { config }
