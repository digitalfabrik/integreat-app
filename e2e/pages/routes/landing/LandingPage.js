// @flow
import wd from 'wd'
import { stopDriver } from '../../../driver/driver'

export default class LandingPage {
  driver: wd.PromiseChainWebdriver

  constructor (driver: wd.PromiseChainWebdriver) {
    this.driver = driver
  }

  async ready () {
    try {
      await this.driver.waitForElementByAccessibilityId('Search-Input')
    } catch (e) {
      await stopDriver(this.driver)
      throw e
    }
  }

  getSearchInput (): Promise<wd.Element> {
    return this.driver.elementByAccessibilityId('Search-Input')
  }
}
