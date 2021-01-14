// @flow

import type { WebDriver, WebElement } from 'selenium-webdriver'
import { By } from 'selenium-webdriver'

export default class LandingPage {
  driver: WebDriver
  language: string

  constructor (driver: WebDriver, langugage: 'de' | 'en' = 'de') {
    this.driver = driver
    this.language = langugage
  }

  ready (): Promise<void> {
    return this.driver.get(`http://localhost:9000/landing/${this.language}`)
  }

  getSearchInput (): Promise<WebElement> {
    return this.driver.findElement(By.xpath('//input'))
  }

  getCity (name: string): Promise<WebElement> {
    return this.driver.findElement(By.xpath(`//span[@aria-label='${name}']`))
  }
}
