import { Capabilities } from '@wdio/types'

import { getGitBranch, getGitHeadReference } from '../shared/git'

const browserstackCaps = (
  config: Capabilities.AppiumW3CCapabilities | Capabilities.AppiumXCUITestCapabilities,
  platformName: 'ios' | 'android'
): Capabilities.Capabilities => {
  // is set by circleci https://github.com/circleci/circleci-docs/blob/master/jekyll/_cci1/environment-variables.md
  const isCi = !!process.env.CI
  const prefix = isCi ? 'IG CI' : 'IG DEV'
  const app = process.env.E2E_BROWSERSTACK_APP

  return {
    'bstack:options': {
      buildName: `${prefix}: ${getGitBranch()}`,
      sessionName: `${platformName.toLowerCase()}: ${getGitHeadReference()}`,
      projectName: 'integreat-app-native',
      debug: true,
      realMobile: isCi,
      appiumVersion: '2.0.0',
      idleTimeout: 10000,
    },
    ...config,
    'appium:app': app,
    platformName,
  }
}

export default {
  android: browserstackCaps(
    {
      'appium:platformVersion': '13.0',
      'appium:deviceName': 'Google Pixel 7',
    },
    'android'
  ),
  ios: browserstackCaps(
    {
      'appium:platformVersion': '16',
      'appium:deviceName': 'iPhone 14',
      'appium:waitForIdleTimeout': 10000,
    },
    'ios'
  ),
} as Record<string, Capabilities.Capabilities>
