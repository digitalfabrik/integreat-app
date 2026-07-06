import { config as defaultConfig } from './wdio.conf.js'

const iosCapabilities: WebdriverIO.Capabilities = {
  platformName: 'iOS',
  // http://appium.io/docs/en/2.1/guides/caps/
  'appium:deviceName': 'iPhone 16e',
  'appium:platformVersion': '18.5',
  'appium:orientation': 'PORTRAIT',
  'appium:automationName': 'XCUITest',
  'appium:language': 'EN',
  // the full reset is needed so that the permissions are requested with each test, not just once per test suite being run
  'appium:fullReset': true,
  /* how to get BUILD_DIR:
  XCode: Product -> "Copy Build Folder Path"
  Example BUILD_DIR= '/Users/afischer/Library/Developer/Xcode/DerivedData/Integreat-enomkojtzvcuyvfzikuktexfnnki/Build',
  */
  'appium:app': `${process.env.BUILD_DIR}/Products/Debug-iphonesimulator/Integreat.app`,
  'appium:newCommandTimeout': 240,
}

export const config: WebdriverIO.Config = {
  ...defaultConfig,
  capabilities: [iosCapabilities],
}
