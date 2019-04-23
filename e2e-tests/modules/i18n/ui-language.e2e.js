import { select, setupDriver, stopDriver } from '../../helpers/driver-util'

describe('UI language', () => {
  let driver

  it('should match the system language de', async () => {
    driver = await setupDriver(select({
      android: {language: 'de', locale: 'DE'},
      ios: {language: 'de', locale: 'de_DE'}
    }))

    await driver.waitForElementByAccessibilityId('Search-Input')
    const element = await driver.elementByAccessibilityId('Search-Input')

    expect(await element.text()).toBe('Suche nach deinem Ort')

    await stopDriver(driver)
  })

  it('should match the system language en', async () => {
    driver = await setupDriver(select({
      android: {language: 'en', locale: 'US'},
      ios: {language: 'en', locale: 'en_US'}
    }))

    await driver.waitForElementByAccessibilityId('Search-Input')
    const element = await driver.elementByAccessibilityId('Search-Input')

    expect(await element.text()).toBe('Search for your city')

    await stopDriver(driver)
  })

  afterAll(async () => {

  })
})
