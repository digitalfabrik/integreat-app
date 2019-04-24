import { setupDriver, stopDriver } from './helpers/driver-util'

describe('Sample tests', () => {
  let driver

  beforeAll(async () => {
    driver = await setupDriver()
  })

  it('should be able to see search bar', async () => {
    await driver.waitForElementByAccessibilityId('Search-Input')
    expect(await driver.hasElementByAccessibilityId('Search-Input')).toBe(true)
    const element = await driver.elementByAccessibilityId('Search-Input')
    await driver.clickElement(element)
  })

  afterAll(async () => {
    await stopDriver(driver)
  })
})
