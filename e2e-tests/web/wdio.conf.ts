export const config = {
  runner: 'local',
  specs: [
    './web/test/specs/**/*.ts'
  ],
  exclude: [],
  maxInstances: 10,

  capabilities: [{
    maxInstances: 5,
    browserName: 'chrome',
    acceptInsecureCerts: true
  }],
  logLevel: 'info',
  coloredLogs: true,
  bail: 0,
  baseUrl: 'http://localhost:9000',
  waitforTimeout: 100000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['selenium-standalone'],
  framework: 'jasmine',
  reporters: ['junit'],

  jasmineNodeOpts: {
    defaultTimeoutInterval: 120000,
    requires: ['tsconfig-paths/register']
  },

  onPrepare: async function (): Promise<void> {
    const startupDelay = 20000
    await new Promise(resolve => setTimeout(resolve, startupDelay))
  }
}
