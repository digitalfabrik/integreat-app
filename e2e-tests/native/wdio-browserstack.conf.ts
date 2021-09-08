import { Testrunner } from '@wdio/types/build/Options'

import capabilities from './capabilities'

const getCapability = () => {
  const capability = process.env.E2E_CONFIG
  if (!capability) {
    throw new Error(`E2E_CONFIG name is not set! It should be one of ${Object.keys(capabilities)}`)
  }

  if (!capabilities[capability]) {
    throw new Error(`Value of E2E_CONFIG is invalid! It should be one of ${Object.keys(capabilities)}`)
  }

  return capabilities[capability]
}

export const config: Testrunner = {
  runner: 'local',
  specs: ['./native/test/specs/**/*.ts'],
  exclude: [],

  maxInstances: 1,
  maxInstancesPerCapability: 1,
  user: process.env.E2E_BROWSERSTACK_USER,
  key: process.env.E2E_BROWSERSTACK_KEY,

  capabilities: [getCapability()],

  logLevel: 'info',

  bail: 1,
  baseUrl: 'http://localhost:9000',
  waitforTimeout: 100000,
  waitforInterval: 2000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,
  services: ['browserstack'],
  framework: 'jasmine',
  reporters: ['junit'],

  jasmineOpts: {
    defaultTimeoutInterval: 300000
  }
}
