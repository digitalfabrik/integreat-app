import { Capabilities } from '@wdio/types/build/Capabilities'
import { Testrunner } from '@wdio/types/build/Options'

import { config as defaultConfig } from './wdio.conf'

const iosCapabilities: Capabilities = {
  platformName: 'iOS',
  // http://appium.io/docs/en/writing-running-appium/caps/
  'appium:deviceName': 'iPhone 13 Pro Max',
  'appium:platformVersion': '15.2',
  'appium:orientation': 'PORTRAIT',
  'appium:automationName': 'XCUITest',
  'appium:language': 'EN',
  /* how to get BUILD_DIR:
  XCode: Product -> "show build folder in finder" -> drag item in terminal window
  Command line (native/ios): xcodebuild -scheme integreat-e2e -workspace Integreat.xcworkspace ONLY_ACTIVE_ARCH=NO -sdk iphonesimulator -configuration Debug -showBuildSettings | grep -m 1 "BUILT_PRODUCTS_DIR" | grep -oEi "\/.*"
  Example BUILD_DIR= '/Users/afischer/Library/Developer/Xcode/DerivedData/Integreat-enomkojtzvcuyvfzikuktexfnnki/Build/Products/Debug-iphonesimulator',
  */
  'appium:app': `${process.env.BUILD_DIR}/Integreat.app`,
  'appium:newCommandTimeout': 240,
}

export const config: Testrunner = {
  ...defaultConfig,
  capabilities: [iosCapabilities],
}
