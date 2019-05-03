import { select, setupDriver, stopDriver } from '../../../driver/driver'
import LandingPage from '../../../pages/routes/landing/LandingPage'

describe('UI language', () => {
  it('should match the system language de', async () => {
    const driver = await setupDriver(select({
      android: {language: 'de', locale: 'DE'},
      ios: {language: 'de', locale: 'de_DE'}
    }))

    const landingPage = new LandingPage(driver)
    await landingPage.ready()

    expect(await landingPage.getSearchInput().text()).toBe('Suche nach deinem Ort')

    await stopDriver(driver)
  })

  it('should match the system language en', async () => {
    const driver = await setupDriver(select({
      android: {language: 'en', locale: 'US'},
      ios: {language: 'en', locale: 'en_US'}
    }))

    const landingPage = new LandingPage(driver)
    await landingPage.ready()

    expect(await landingPage.getSearchInput().text()).toBe('Search for your city')

    await stopDriver(driver)
  })
})
