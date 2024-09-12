import { Capabilities } from '@wdio/types'

const androidCapabilities: Capabilities.DesiredCapabilities = {
  platformName: 'android',
  'appium:app': '../native/android/app/build/outputs/apk/debug/app-debug.apk',
  'appium:automationName': 'UiAutomator2',
}

export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./test/specs/**/*.ts'],
  exclude: [],

  maxInstances: 1,

  capabilities: [androidCapabilities],

  logLevel: 'info',

  bail: 0,
  port: 4723, // default appium port
  waitforTimeout: 5000,
  waitforInterval: 2000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,
  services: ['appium'],
  framework: 'jasmine',
  reporters: ['spec'],

  jasmineOpts: {
    defaultTimeoutInterval: 100000,
  },

  before: async (): Promise<void> => {
    const startupDelay = 10000
    await new Promise(resolve => {
      setTimeout(resolve, startupDelay)
    })
  },
}
