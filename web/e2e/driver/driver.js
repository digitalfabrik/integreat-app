// @flow

import { type WebDriver, Builder } from 'selenium-webdriver'
import fetch from 'node-fetch'
import childProcess from 'child_process'
import serverConfigs from '../config/configs'
import { clone } from 'lodash'
import type { EndToEndConfigType } from '../config/configs'

const BROWSERSTACK_EXHAUSTED_MESSAGE = 'All parallel tests are currently in use, including the queued tests. ' +
  'Please wait to finish or upgrade your plan to add more sessions.'
const IMPLICIT_WAIT_TIMEOUT = 80000
const STARTUP_DELAY = 10000

export const timer = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))
export type EndToEndDriverType = {| driver: WebDriver, config: EndToEndConfigType |}

const getConfig = (): EndToEndConfigType | null => {
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

const initDriver = async (config: EndToEndConfigType, desiredCaps): Promise<WebDriver> => {
  try {
    return new Builder()
      .usingServer(config.url)
      .withCapabilities(desiredCaps)
      .build()
  } catch (e) {
    if (e.message.includes(BROWSERSTACK_EXHAUSTED_MESSAGE)) {
      console.log('Browserstack Queue is full!')
    }

    throw e
  }
}

const fetchBrowserstackTestResults = async (driver: WebDriver) => {
  const user = process.env.E2E_BROWSERSTACK_USER
  const password = process.env.E2E_BROWSERSTACK_KEY

  if (!user || !password) {
    console.log('Can not fetch test results from BrowserStack as username or password is not set!')
    return
  }

  const auth = `Basic ${Buffer.from(
    `${user}:${password}`
  ).toString('base64')}`

  try {
    const session = await driver.getSession()
    const response = await fetch(
      `https://api.browserstack.com/automate/sessions/${session.getId()}.json`,
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

const getGitBranch = () => {
  return childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
}

const getGitHeadReference = () => {
  return childProcess.execSync('git rev-parse --short HEAD').toString().trim()
}

export const setupDriver = async (): Promise<EndToEndDriverType> => {
  const config = getConfig()

  if (!config) {
    throw Error('Failed to get config!')
  }

  console.log(`Trying to use ${config.url} ...`)

  const desiredCaps = {
    ...clone(config.caps),
    build: `${config.prefix}: ${getGitBranch()}`,
    name: `${config.caps.browserName.toLowerCase()}: ${getGitHeadReference()}`,
    tags: [config.prefix, config.caps.browserName.toLowerCase()],
    browserstack: !!(config?.browserstack)
  }

  const driver = await initDriver(config, desiredCaps)
  const session = await driver.getSession()

  console.log(`Session ID is ${session.getId()}`)

  driver.manage().timeouts().implicitlyWait(IMPLICIT_WAIT_TIMEOUT)
  await timer(STARTUP_DELAY)

  return { driver, config }
}

export const stopDriver = async (e2eDriver: EndToEndDriverType) => {
  const { driver, config } = e2eDriver
  if (config.browserstack) {
    await fetchBrowserstackTestResults(driver)
  }
  if (driver === undefined) {
    return
  }
  await driver.quit()
}
