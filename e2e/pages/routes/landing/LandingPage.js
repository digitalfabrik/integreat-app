// @flow
import wd from 'wd'

export default class LandingPage {
  driver: wd.PromiseChainWebdriver

  constructor (driver: wd.PromiseChainWebdriver) {
    this.driver = driver
  }

  async ready () {
    await this.driver.waitForElementByAccessibilityId('Search-Input')
  }

  async getSearchInput (): wd.Element {
    return this.driver.elementByAccessibilityId('Search-Input')
  }
}
