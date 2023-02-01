import { BrowserStackCapabilities, Capabilities } from '@wdio/types/build/Capabilities'

import { getGitBranch, getGitHeadReference } from '../shared/git'

const browserstackCaps = (config: BrowserStackCapabilities): Capabilities => {
  const prefix = process.env.CI ? 'IG CI' : 'IG DEV'
  return {
    'bstack:options': {
      ...config,
      buildName: `${prefix}: ${getGitBranch()}`,
      sessionName: `${config.browserName?.toLowerCase()}: ${getGitHeadReference()}`,
      local: true,
      debug: true,
      projectName: 'integreat-app-web',
    },
    browserName: config.browserName,
  }
}

export const browsers = ['chrome', 'firefox', 'safari', 'edge'] as const

export const browserstackCapabilities = {
  chrome: browserstackCaps({
    browserVersion: '80',
    os: 'Windows',
    osVersion: '10',
    browserName: 'Chrome',
  }),
  firefox: browserstackCaps({
    os: 'Windows',
    osVersion: '10',
    browserName: 'Firefox',
    browserVersion: '84.0',
  }),
  safari: browserstackCaps({
    os: 'OS X',
    osVersion: 'Big Sur',
    browserName: 'Safari',
    browserVersion: '14.0',
  }),
} as Record<(typeof browsers)[number], Capabilities>

export const ciCapabilities = {
  browserName: 'chrome',
  'goog:chromeOptions': {
    args: ['--no-sandbox', '--disable-infobars', '--headless'],
  },
}
