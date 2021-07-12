import capabilities from './capabilities'

const getCapability = () => {
  const capability = process.env.E2E_CONFIG
  if (!capability) {
    throw new Error('E2E_CONFIG name is not set!')
  }

  if (!capabilities[capability]) {
    throw new Error('Value of E2E_CONFIG is invalid!')
  }

  return capabilities[capability]
}

export const config = {
  runner: 'local',
  specs: ['./native/test/specs/**/*.ts'],
  exclude: [],

  maxInstances: 2,

  user: process.env.E2E_BROWSERSTACK_USER,
  key: process.env.E2E_BROWSERSTACK_KEY,

  capabilities: [getCapability()],

  logLevel: 'info',
  coloredLogs: true,
  bail: 0,
  baseUrl: 'http://localhost:9000',
  waitforTimeout: 100000,
  waitforInterval: 2000,
  connectionRetryTimeout: 50000,
  connectionRetryCount: 3,
  services: [['browserstack', { browserstackLocal: true }]],
  host: 'hub.browserstack.com',
  framework: 'jasmine',
  reporters: ['junit'],

  jasmineOpts: {
    defaultTimeoutInterval: 200000
  }
}
