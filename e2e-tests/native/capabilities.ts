import { Capabilities } from '@wdio/types/build/Capabilities'
import { execSync } from 'child_process'

const getGitBranch = () => {
  return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
}

const getGitHeadReference = () => {
  return execSync('git rev-parse --short HEAD').toString().trim()
}

const browserstackCaps = (config: Capabilities): Capabilities => {
  const isCi = !!process.env.E2E_CI
  const prefix = isCi ? 'IG CI' : 'IG DEV'
  const app =
    config.platformName === 'android' ? process.env.E2E_BROWSERSTACK_APP_ANDROID : process.env.E2E_BROWSERSTACK_APP_IOS
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
