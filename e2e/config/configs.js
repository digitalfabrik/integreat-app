// @flow

exports.local_android = {
  url: 'http://localhost:4723/wd/hub',
  prefix: 'IG LOCAL',
  platform: 'android',
  caps: {
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
}

exports.local_ios = {
  url: 'http://localhost:4723/wd/hub',
  prefix: 'IG LOCAL',
  platform: 'ios',
  caps: {
    browserName: '',
    platformName: 'iOS',
    platformVersion: '12.0',
    deviceName: 'iPhone Simulator',
    os: 'iOS',
    deviceOrientation: 'portrait',
    automationName: 'XCUITest'
  }
}

exports.browserstack_dev_android = {
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG DEV',
  platform: 'android',
  caps: {
    'browserstack.user': process.env.E2E_BROWSERSTACK_USER,
    'browserstack.key': process.env.E2E_BROWSERSTACK_KEY,
    project: 'integreat-react-native-app',
    os_version: '9.0',
    device: 'Google Pixel 3',
    real_mobile: 'true',
    'browserstack.appium_version': '1.17.0',
    app: process.env.E2E_BROWSERSTACK_APP,
    'browserstack.debug': true
  }
}

exports.browserstack_dev_ios = {
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG DEV',
  platform: 'ios',
  caps: {
    'browserstack.user': process.env.E2E_BROWSERSTACK_USER,
    'browserstack.key': process.env.E2E_BROWSERSTACK_KEY,
    project: 'integreat-react-native-app',
    os_version: '11',
    device: 'iPhone 8',
    real_mobile: 'true',
    'browserstack.appium_version': '1.16.0',
    app: process.env.E2E_BROWSERSTACK_APP,
    'browserstack.debug': true
  }
}

exports.browserstack_ci_android = {
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG CI',
  platform: 'android',
  caps: {
    'browserstack.user': process.env.E2E_BROWSERSTACK_USER,
    'browserstack.key': process.env.E2E_BROWSERSTACK_KEY,
    project: 'integreat-react-native-app',
    os_version: '9.0',
    device: 'Google Pixel 3',
    real_mobile: 'true',
    'browserstack.appium_version': '1.17.0',
    app: process.env.E2E_BROWSERSTACK_APP,
    'browserstack.debug': true
  }
}

exports.browserstack_ci_ios = {
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG CI',
  platform: 'ios',
  caps: {
    'browserstack.user': process.env.E2E_BROWSERSTACK_USER,
    'browserstack.key': process.env.E2E_BROWSERSTACK_KEY,
    project: 'integreat-react-native-app',
    os_version: '11',
    device: 'iPhone 8',
    real_mobile: 'true',
    'browserstack.appium_version': '1.16.0',
    app: process.env.E2E_BROWSERSTACK_APP,
    'browserstack.debug': true
  }
}
