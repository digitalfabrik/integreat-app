import { Capabilities } from '@wdio/types'

import { config as defaultConfig } from './wdio.conf.js'

const iosCapabilities: Capabilities.DesiredCapabilities = {
  platformName: 'iOS',
  // http://appium.io/docs/en/2.1/guides/caps/
  'appium:deviceName': 'iPhone 14',
  'appium:platformVersion': '16.4',
  'appium:orientation': 'PORTRAIT',
  'appium:automationName': 'XCUITest',
  'appium:language': 'EN',
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
