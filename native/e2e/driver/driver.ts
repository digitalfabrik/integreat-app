// @flow

import wd from 'wd'
import fetch from 'node-fetch'
import childProcess from 'child_process'
import serverConfigs from '../config/configs'
import { clone } from 'lodash'

const BROWSERSTACK_EXHAUSTED_MESSAGE =
  'All parallel tests are currently in use, including the queued tests. ' +
  'Please wait to finish or upgrade your plan to add more sessions.'
const IMPLICIT_WAIT_TIMEOUT = 80000
const INIT_RETRY_TIME = 3000
const STARTUP_DELAY = 3000

const ADDITIONAL_ENV_VARIABLES = ['CIRCLE_BUILD_URL', 'CIRCLE_BUILD_NUM']

export const timer = (ms: number) => new Promise<{}>(resolve => setTimeout(resolve, ms))

type ConfigType = { url: string, platform: string, prefix: string, caps: {} }

const getConfig = (): ConfigType | null => {
  const configName: ?string = process.env.E2E_CONFIG

  if (!configName) {
    console.error('E2E_CONFIG name is not set!')
    return null
  }

  const config = serverConfigs[configName.toLowerCase()]

  if (!config) {
    console.error(`Server config ${configName} not found!`)
    return null
  }

  return config
}

export const isAndroid = (config: ConfigType) => {
  return config.platform.toLowerCase() === 'android'
}

export const isIOS = (config: ConfigType) => {
  return config.platform.toLowerCase() === 'ios'
}

const getAdditionalTags = () => {
  return ADDITIONAL_ENV_VARIABLES.map(variable => process.env[variable]).filter(value => !!value)
}

export const select = <T, K>(input: { android: T, ios: K }): T | K => {
  const config = getConfig()

  if (!config) {
    throw Error('Failed to get config!')
  }

  if (isAndroid(config)) {
    return input.android
  } else if (isIOS(config)) {
    return input.ios
  }

  throw new Error('Unknown platform.')
}

const initDriver = async (config, desiredCaps) => {
  try {
    const driver = wd.promiseChainRemote(config.url)
    await driver.init(desiredCaps)
    return driver
  } catch (e) {
    if (e.message.includes(BROWSERSTACK_EXHAUSTED_MESSAGE)) {
      console.log('Waiting because queue is full!')
      await timer(INIT_RETRY_TIME)
      await initDriver(config, desiredCaps)
    }

    throw e
  }
}

const fetchTestResults = async (driver: wd.PromiseChainWebdriver) => {
  if (!driver.sessionID) {
    // We are not using BrowserStack probably
    return
  }

  const user = process.env.E2E_BROWSERSTACK_USER
  const password = process.env.E2E_BROWSERSTACK_KEY

  if (!user || !password) {
    console.log('Can not fetch test results from BrowserStack as username or password is not set!')
    return
  }

  const auth = `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`

  try {
    const response = await fetch(`https://api.browserstack.com/app-automate/sessions/${driver.sessionID}.json`, {
      method: 'GET',
      headers: {
        Authorization: auth
      }
    })
    const json = await response.json()
    console.log(`View the results here: ${json.automation_session.public_url}`)
  } catch (error) {
    console.error(error)
  }
}

const getGitBranch = () => {
  return childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
}

const getGitHeadReference = () => {
  return childProcess.execSync('git rev-parse --short HEAD').toString().trim()
}

export const setupDriver = async (additionalCaps: any = {}) => {
  const config = getConfig()

  if (!config) {
    throw Error('Failed to get config!')
  }

  console.log(`Trying to use ${config.url} ...`)

  const desiredCaps = {
    ...clone(config.caps),
    build: `${config.prefix}: ${getGitBranch()}`,
    name: `${config.platform}: ${getGitHeadReference()}`,
    tags: [config.prefix, config.platform, ...getAdditionalTags()],
    ...additionalCaps
  }

  const driver = await initDriver(config, desiredCaps)
  const status = await driver.status()

  console.log(`Session ID is ${JSON.stringify(driver.sessionID)}`)
  console.log(`Status of Driver is ${JSON.stringify(status)}`)

  await driver.setImplicitWaitTimeout(IMPLICIT_WAIT_TIMEOUT)
  await timer(STARTUP_DELAY)
  return driver
}

export const stopDriver = async (driver: wd.PromiseChainWebdriver) => {
  await fetchTestResults(driver)
  if (driver === undefined) {
    return
  }
  await driver.quit()
}
