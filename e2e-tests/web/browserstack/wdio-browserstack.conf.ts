import { config as defaultConfig } from '../wdio.conf'
import { browserstackCapabilities } from '../capabilities'

export const config = Object.assign(defaultConfig, {
  maxInstances: 1,

  user: process.env.E2E_BROWSERSTACK_USER,
  key: process.env.E2E_BROWSERSTACK_KEY,

  capabilities: Object.values(browserstackCapabilities),

  services: [['browserstack', { browserstackLocal: true }]],
  host: 'hub.browserstack.com'
})
