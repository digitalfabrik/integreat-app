import { execSync } from 'child_process'
import { config as defaultConfig } from '../wdio.conf'
import { BrowserStackCapabilities, Capabilities } from '@wdio/types/build/Capabilities'

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
    browserName: config.browserName,
    acceptInsecureCerts: true
  }
}

export const config = Object.assign(defaultConfig, {
  maxInstances: 1,

  user: process.env.E2E_BROWSERSTACK_USER,
  key: process.env.E2E_BROWSERSTACK_KEY,

  capabilities: [
    browserstackCaps({
      browserVersion: '80',
      os: 'Windows',
      osVersion: '10',
      browserName: 'Chrome'
    }),
    browserstackCaps({
      os: 'Windows',
      osVersion: '10',
      browserName: 'Firefox',
      browserVersion: '84.0'
    }),
    browserstackCaps({
      os: 'OS X',
      osVersion: 'Big Sur',
      browserName: 'Safari',
      browserVersion: '14.0'
    }),
    browserstackCaps({
      os: 'Windows',
      osVersion: '10',
      browserName: 'IE',
      browserVersion: '11.0',
      ie: {
        driver: '3.141.59'
      },
      seleniumVersion: '3.141.59'
    })],

  services: [['browserstack', { browserstackLocal: true }]],
  host: 'hub.browserstack.com'
})
