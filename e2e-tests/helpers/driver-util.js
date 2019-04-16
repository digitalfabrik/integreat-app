// @flow

import childProcess from 'child_process'
import wd from 'wd'
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
const IMPLICIT_WAIT_TIMEOUT = 2000
const INIT_RETRY_TIME = 3000
const STARTUP_DELAY = 3000

const timer = (ms: number) => new Promise<{}>(resolve => setTimeout(resolve, ms))

const isAndroid = () => {
  return platform.toLowerCase() === 'android'
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

const setupDriver = async () => {
  const serverConfig = serverConfigs[e2eServerConfigName.toLowerCase()]

  if (!serverConfig) {
    console.error(`Server config ${e2eServerConfigName} not found!`)
    process.exit(1)
  }

  const desiredCaps = clone(caps[capsName.toLowerCase()])

  if (!desiredCaps) {
    console.error(`Caps ${e2eServerConfigName} not found!`)
    process.exit(1)
  }

  if (isAndroid()) {
    if (serverConfig.local) {
      try {
        const androidVersion = childProcess
          .execSync('adb shell getprop ro.build.version.release')
          .toString()
          .replace(/^\s+|\s+$/g, '')
        if (!isNaN(androidVersion)) {
          console.log('Detected Android device running Android %s', androidVersion)
        }
      } catch (e) {
        throw new Error('Failed to get version from adb device. Do you have a device connected?')
      }
    }
  }

  desiredCaps.name = `Integreat [${platform}]`
  desiredCaps.tags = ['Integreat']

  const driver = await initDriver(serverConfig, desiredCaps)
  const status = await driver.status()

  console.log(`Driver status: ${JSON.stringify(status)}`)

  await driver.setImplicitWaitTimeout(IMPLICIT_WAIT_TIMEOUT)
  await timer(STARTUP_DELAY)
  return driver
}

const stopDriver = async (driver: wd.PromiseChainWebdriver) => {
  if (driver === undefined) {
    return
  }
  await driver.quit()
}

module.exports = {
  timer,
  setupDriver,
  isAndroid,
  stopDriver
}
