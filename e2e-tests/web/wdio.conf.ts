import { Capabilities } from '@wdio/types/build/Capabilities'
import { Testrunner } from '@wdio/types/build/Options'

import { browsers, ciCapabilities } from './capabilities'

const getCapabilities = (): Array<Capabilities> => {
  if (process.env.CI) {
    return [ciCapabilities]
  }
  const parsedCapabilies = browsers
    .filter(browser => process.argv.includes(`--${browser}`))
    .map(browser => ({ browserName: browser }))
  return parsedCapabilies.length > 0 ? parsedCapabilies : [{ browserName: 'chrome' }]
}

export const config: Testrunner = {
  runner: 'local',
  specs: ['./web/test/specs/**/*.e2e.ts'],
  exclude: [],
  maxInstancesPerCapability: 1,

  capabilities: getCapabilities(),
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost:9000',
  waitforTimeout: 2000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: process.env.CI ? [] : ['selenium-standalone'],
  framework: 'jasmine',
  reporters: ['spec'],

  jasmineOpts: {
    defaultTimeoutInterval: 300000
  },

  onPrepare: async (): Promise<void> => {
    if (process.env.CI) {
      const startupDelay = 20000
      await new Promise(resolve => {
        setTimeout(resolve, startupDelay)
      })
    }
  },

  before: async (): Promise<void> => {
    await browser.setTimeout({ implicit: 80000, pageLoad: 60000 })
  }
}
