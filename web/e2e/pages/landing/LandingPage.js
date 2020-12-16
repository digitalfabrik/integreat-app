// @flow

import wd from 'wd'

export default class LandingPage {
  driver: wd.PromiseChainWebdriver
  language: string

  constructor (driver: wd.PromiseChainWebdriver, langugage: 'de' | 'en' = 'de') {
    this.driver = driver
    this.language = langugage
  }

  ready (): Promise<void> {
    return this.driver.get(`http://localhost:9000/landing/${this.language}`)
  }

  getUrl (): Promise<string> {
    return this.driver.url()
  }

  getSearchInput (): Promise<wd.Element> {
    return this.driver.waitForElementByXPath('//input')
  }
}
