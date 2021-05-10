import wd from 'wd'
export default class LandingPage {
  driver: wd.PromiseChainWebdriver

  constructor(driver: wd.PromiseChainWebdriver) {
    this.driver = driver
  }

  ready(): Promise<void> {
    return this.driver.waitForElementByAccessibilityId('Search-Input')
  }

  getSearchInput(): Promise<wd.Element> {
    return this.driver.elementByAccessibilityId('Search-Input')
  }
}
