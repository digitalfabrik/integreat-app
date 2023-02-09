import { Capabilities } from '@wdio/types/build/Capabilities'

import { browsers, ciCapabilities } from './capabilities'
import waitForLocalhost from './waitForLocalhost'

const getCapabilities = (): Array<Capabilities> => {
  if (process.env.CI) {
    return [ciCapabilities]
  }
  const parsedCapabilies = browsers
    .filter(browser => process.argv.includes(`--${browser}`))
    .map(browser => ({ browserName: browser }))
  return parsedCapabilies.length > 0 ? parsedCapabilies : [{ browserName: 'chrome' }]
}

export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./test/specs/**'],
  exclude: [],
  maxInstancesPerCapability: 1,

  capabilities: getCapabilities(),
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost:9000',
  waitforTimeout: 2_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 3,
  services: process.env.CI ? [] : ['selenium-standalone'],
  framework: 'jasmine',
  reporters: ['spec'],

  jasmineOpts: {
    defaultTimeoutInterval: 300_000,
  },

  onPrepare: async (): Promise<void> => {
    if (process.env.CI) {
      const startupDelay = 10_000
      await new Promise(resolve => {
        setTimeout(resolve, startupDelay)
      })
    }
    const maxWaitTime = 100_000
    await waitForLocalhost(maxWaitTime)
  },

  before: async (): Promise<void> => {
    await browser.setTimeout({ implicit: 80_000, pageLoad: 60_000 })
  },
}
