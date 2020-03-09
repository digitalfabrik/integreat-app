// @flow

exports.local_ios12 = {
  browserName: '',
  platformName: 'iOS',
  platformVersion: '12.0',
  deviceName: 'iPhone Simulator',
  os: 'iOS',
  deviceOrientation: 'portrait',
  automationName: 'XCUITest'
}

exports.local_android9 = {
  browserName: '',
  platformName: 'Android',
  platformVersion: '9',
  deviceName: 'Android Emulator',
  automationName: 'UiAutomator2',
  os: 'Android',
  appPackage: 'com.integreat',
  appActivity: 'com.integreat.MainActivity',
  deviceOrientation: 'portrait'
}

exports.browserstack = {
  'browserstack.user': process.env.E2E_BROWSERSTACK_USER,
  'browserstack.key': process.env.E2E_BROWSERSTACK_KEY,
  build: 'Development Android',
  name: 'single_test',
  device: 'Google Pixel',
  app: process.env.E2E_BROWSERSTACK_APP,
  'browserstack.debug': true
}

exports.browserstack_ios = {
  'browserstack.user': process.env.E2E_BROWSERSTACK_USER,
  'browserstack.key': process.env.E2E_BROWSERSTACK_KEY,
  build: 'Development iOS',
  name: 'single_test',
  device: 'iPhone XS',
  app: process.env.E2E_BROWSERSTACK_APP,
  'browserstack.debug': true
}

exports.ci_browserstack = {
  'browserstack.user': process.env.E2E_BROWSERSTACK_USER,
  'browserstack.key': process.env.E2E_BROWSERSTACK_KEY,
  project: 'integreat-react-native-app',
  build: 'CI Android',
  name: 'single_test',
  device: 'Google Pixel',
  app: process.env.E2E_BROWSERSTACK_APP,
  'browserstack.debug': true
}

exports.ci_browserstack_ios = {
  'browserstack.user': process.env.E2E_BROWSERSTACK_USER,
  'browserstack.key': process.env.E2E_BROWSERSTACK_KEY,
  project: 'integreat-react-native-app',
  build: 'CI iOS',
  name: 'single_test',
  device: 'iPhone XS',
  app: process.env.E2E_BROWSERSTACK_APP,
  'browserstack.debug': true
}
