// @flow

import type { WebDriver, WebElement } from 'selenium-webdriver'
import { By } from 'selenium-webdriver'
import type { EndToEndDriverType } from '../../driver/driver'

export default class LandingPage {
  driver: WebDriver
  baseUrl: string
  language: string

  constructor (e2eDriver: EndToEndDriverType, language: string = 'de') {
    this.driver = e2eDriver.driver
    this.baseUrl = e2eDriver.config.integreatBaseUrl
    this.language = language
  }

  ready (): Promise<void> {
    return this.driver.get(`${this.baseUrl}/landing/${this.language}`)
  }

  getSearchInput (): Promise<WebElement> {
    return this.driver.findElement(By.xpath('//input'))
  }

  getCity (name: string): Promise<WebElement> {
    return this.driver.findElement(By.xpath(`//span[@aria-label='${name}']`))
  }
}
