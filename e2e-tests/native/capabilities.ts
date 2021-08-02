import { Capabilities } from '@wdio/types/build/Capabilities'
import { getGitBranch, getGitHeadReference } from '../shared/git'

const browserstackCaps = (config: Capabilities): Capabilities => {
  // is set by circleci https://github.com/circleci/circleci-docs/blob/master/jekyll/_cci1/environment-variables.md
  const isCi = !!process.env.CI
  const prefix = isCi ? 'IG CI' : 'IG DEV'
  const app = process.env.E2E_BROWSERSTACK_APP
  return {
    'bstack:options': {
      buildName: `${prefix}: ${getGitBranch()}`,
      sessionName: `${config.browserName?.toLowerCase()}: ${getGitHeadReference()}`,
      projectName: 'integreat-app-native',
      local: true,
      debug: true,
      realMobile: isCi,
      appiumVersion: '1.17.0'
    },
    ...config,
    'appium:app': app
  }
}

export default {
  android: browserstackCaps({
    'appium:platformVersion': '9.0',
    'appium:deviceName': 'Google Pixel 3',
    'appium:automationName': 'UiAutomator2',
    platformName: 'android'
  }),
  ios: browserstackCaps({
    'appium:platformVersion': '12',
    'appium:deviceName': 'iPhone 8',
    'appium:automationName': 'XCUITest',
    platformName: 'ios'
  })
}
