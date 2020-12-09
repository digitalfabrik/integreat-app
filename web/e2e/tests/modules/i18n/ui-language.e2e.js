// @flow

import { select, setupDriver, stopDriver } from '../../../driver/driver'
import LandingPage from '../../../pages/routes/landing/LandingPage'

describe('UI language', () => {
  it('should match the system language de', async () => {
    const driver = await setupDriver(select({
      windows: { language: 'de', locale: 'DE' },
      osx: { language: 'de', locale: 'de_DE' }
    }))

    const landingPage = new LandingPage(driver)

    try {
      await landingPage.ready()

      expect(await (await landingPage.getSearchInput()).text()).toBe('Ort suchen')
    } finally {
      await stopDriver(driver)
    }
  })

  it('should match the system language en', async () => {
    const driver = await setupDriver(select({
      windows: { language: 'en', locale: 'US' },
      osx: { language: 'en', locale: 'en_US' }
    }))

    const landingPage = new LandingPage(driver)

    try {
      await landingPage.ready()

      expect(await (await landingPage.getSearchInput()).text()).toBe('Search for a city')
    } finally {
      await stopDriver(driver)
    }
  })
})
