import { localCapabilities } from './capabilities'

export const config = {
  runner: 'local',
  specs: ['./web/test/specs/**/*.ts'],
  exclude: [],
  maxInstances: 10,

  capabilities: [process.env.CI ? localCapabilities.ci : localCapabilities.browser],
  logLevel: 'info',
  coloredLogs: true,
  bail: 0,
  baseUrl: 'http://localhost:9000',
  waitforTimeout: 100000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: process.env.CI ? [] : ['selenium-standalone'],
  framework: 'jasmine',
  reporters: ['junit'],

  jasmineOpts: {
    defaultTimeoutInterval: 50000
  },

  onPrepare: async (): Promise<void> => {
    if (process.env.CI) {
      const startupDelay = 20000
      await new Promise(resolve => setTimeout(resolve, startupDelay))
    }
  },

  before: async (): Promise<void> => {
    await browser.setTimeout({ implicit: 80000, pageLoad: 60000 })
  }
}
