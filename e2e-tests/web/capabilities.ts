import { BrowserStackCapabilities, Capabilities } from '@wdio/types/build/Capabilities'
import { execSync } from 'child_process'

const getGitBranch = () => {
  return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
}

const getGitHeadReference = () => {
  return execSync('git rev-parse --short HEAD').toString().trim()
}

const browserstackCaps = (config: BrowserStackCapabilities): Capabilities => {
  const prefix = 'IG DEV'
  return {
    'bstack:options': {
      ...config,
      buildName: `${prefix}: ${getGitBranch()}`,
      sessionName: `${config.browserName?.toLowerCase()}: ${getGitHeadReference()}`,
      local: true,
      debug: true,
      projectName: 'integreat-app-web'
    },
    browserName: config.browserName
  }
}

export const browserstackCapabilities = {
  chrome: browserstackCaps({
    browserVersion: '80',
    os: 'Windows',
    osVersion: '10',
    browserName: 'Chrome'
  }),
  firefox: browserstackCaps({
    os: 'Windows',
    osVersion: '10',
    browserName: 'Firefox',
    browserVersion: '84.0'
  }),
  safari: browserstackCaps({
    os: 'OS X',
    osVersion: 'Big Sur',
    browserName: 'Safari',
    browserVersion: '14.0'
  }),
  windows: browserstackCaps({
    os: 'Windows',
    osVersion: '10',
    browserName: 'IE',
    browserVersion: '11.0',
    ie: {
      driver: '3.141.59'
    },
    seleniumVersion: '3.141.59'
  })
}

export const localCapabilities = {
  chrome: {
    maxInstances: 5,
    browserName: 'chrome'
  },
  ci: {
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--no-sandbox', '--disable-infobars', '--headless']
    }
  }
}
