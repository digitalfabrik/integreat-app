import { browsers, browserstackCapabilities } from './capabilities.js'
import { config as defaultConfig } from './wdio.conf.js'

const capabilities = browsers
  .filter(browser => process.argv.includes(`--${browser}`))
  .map(browser => browserstackCapabilities[browser])

export const config: WebdriverIO.Config = Object.assign(defaultConfig, {
  maxInstances: 1,

  user: process.env.E2E_BROWSERSTACK_USER,
  key: process.env.E2E_BROWSERSTACK_KEY,

  capabilities: capabilities.length > 0 ? capabilities : Object.values(browserstackCapabilities),

  services: [['browserstack', { browserstackLocal: true }]],
  host: 'hub.browserstack.com',
})
