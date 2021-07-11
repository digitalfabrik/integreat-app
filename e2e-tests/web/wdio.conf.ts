import { localCapabilities } from './capabilities'

export const config = {
  runner: 'local',
  specs: ['./web/test/specs/**/*.ts'],
  exclude: [],
  maxInstances: 10,

  capabilities: [process.env.CI ? localCapabilities.ci : localCapabilities.chrome],
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

  jasmineNodeOpts: {
    defaultTimeoutInterval: 120000
  },

  before: async function (): Promise<void> {
    await browser.setTimeout({ implicit: 80000 })
  }
}
