// @flow

import wd from 'wd'
import fetch from 'node-fetch'
import childProcess from 'child_process'
import serverConfigs from '../config/server-configs'
import caps from '../config/caps'
import { clone } from 'lodash'

const defaultPlatform = 'android'
const platform = process.env.E2E_PLATFORM || defaultPlatform

const defaultServer = 'local'
const e2eServerConfigName = process.env.E2E_SERVER || defaultServer

const defaultCaps = 'local_android9'
const capsName = process.env.E2E_CAPS || defaultCaps

const BROWSERSTACK_EXHAUSTED_MESSAGE = 'All parallel tests are currently in use, including the queued tests. ' +
  'Please wait to finish or upgrade your plan to add more sessions.'
const IMPLICIT_WAIT_TIMEOUT = 80000
const INIT_RETRY_TIME = 3000
const STARTUP_DELAY = 3000

const ADDITIONAL_ENV_VARIABLES = ['CIRCLE_BUILD_URL', 'CIRCLE_BUILD_NUM']

export const timer = (ms: number) => new Promise<{}>(resolve => setTimeout(resolve, ms))

export const isAndroid = () => {
  return platform.toLowerCase() === 'android'
}

export const isIOS = () => {
  return platform.toLowerCase() === 'ios'
}

const getAdditionalTags = () => {
  return ADDITIONAL_ENV_VARIABLES.map(variable => process.env[variable]).filter(value => !!value)
}

export const select = <T, K> (input: { android: T, ios: K }): T | K => {
  if (isAndroid()) {
    return input.android
  } else if (isIOS()) {
    return input.ios
  }

  throw new Error('Unknown platform.')
}

const initDriver = async (serverConfig, desiredCaps) => {
  try {
    const driver = wd.promiseChainRemote(serverConfig.url)
    await driver.init(desiredCaps)
    return driver
  } catch (e) {
    if (e.message.includes(BROWSERSTACK_EXHAUSTED_MESSAGE)) {
      console.log('Waiting because queue is full!')
      await timer(INIT_RETRY_TIME)
      await initDriver(serverConfig, desiredCaps)
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
    console.log('Can not fetch test results from BrowserStack as no username is set!')
    return
  }

  const auth = `Basic ${Buffer.from(
    `${user}:${password}`
  ).toString('base64')}`

  try {
    const response = await fetch(
      `https://api.browserstack.com/app-automate/sessions/${driver.sessionID}.json`,
      {
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

export const setupDriver = async (additionalCaps: {} = {}) => {
  const serverConfig = serverConfigs[e2eServerConfigName.toLowerCase()]

  if (!serverConfig) {
    console.error(`Server config ${e2eServerConfigName} not found!`)
    process.exit(1)
  }

  console.log(`Trying to use ${serverConfig.url} ...`)

  const desiredCaps = { ...clone(caps[capsName.toLowerCase()]), ...additionalCaps }

  if (!desiredCaps) {
    console.error(`Caps ${e2eServerConfigName} not found!`)
    process.exit(1)
  }

  desiredCaps.name = childProcess.execSync('git rev-parse HEAD').toString().trim()
  desiredCaps.tags = ['Integreat', platform, ...getAdditionalTags()]

  const driver = await initDriver(serverConfig, desiredCaps)
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
