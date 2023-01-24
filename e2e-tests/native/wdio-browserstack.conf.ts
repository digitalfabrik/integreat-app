import capabilities from './capabilities'

const getCapability = () => {
  const capabilityName = process.env.E2E_CONFIG
  if (!capabilityName) {
    throw new Error(`E2E_CONFIG name is not set! It should be one of ${Object.keys(capabilities)}`)
  }
  const capability = capabilities[capabilityName]

  if (!capability) {
    throw new Error(`Value of E2E_CONFIG is invalid! It should be one of ${Object.keys(capabilities)}`)
  }

  return capability
}

export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./test/specs/**/*.ts'],
  exclude: [],

  maxInstances: 1,
  maxInstancesPerCapability: 1,
  user: process.env.E2E_BROWSERSTACK_USER,
  key: process.env.E2E_BROWSERSTACK_KEY,

  capabilities: [getCapability()],

  logLevel: 'info',

  baseUrl: 'http://localhost:9000',

  specFileRetries: 2,
  bail: 1,

  waitforTimeout: 100000,
  waitforInterval: 100000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,

  services: ['browserstack'],
  framework: 'jasmine',
  reporters: ['spec'],

  jasmineOpts: {
    defaultTimeoutInterval: 300000,
  },

  before: async (): Promise<void> => {
    // implicit: time the driver will wait searching for elements ($, $$)
    const implicitTimeout = 2000
    driver.setImplicitTimeout(implicitTimeout)
  },
}
