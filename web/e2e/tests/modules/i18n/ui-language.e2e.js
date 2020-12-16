// @flow

import { select, setupDriver, stopDriver } from '../../../driver/driver'
import LandingPage from '../../../pages/landing/LandingPage'

describe('UI language', () => {


  it.only('should match the system language de', async () => {
    try {
        const e2eDriver = await setupDriver(select({
          windows: { language: 'DE' }
        }), language: 'de')
    } catch {
        return;
    }
    try {
      const landing = new LandingPage(e2eDriver.driver, 'de')

      await landing.ready()

      const url = await landing.getUrl()
      console.log(url)
      const parsedUrl = new URL(url)
      expect(parsedUrl.pathname).toEqual('/landing/de')

      const searchInput = await landing.getSearchInput()
      expect(await searchInput.text()).toEqual('Ort suchen')
    } finally {
      await stopDriver(e2edriver)
    }
  })

  it('should match the system language en', async () => {
    const e2edriver = await setupDriver(select({
      windows: { language: 'en', locale: 'US' }
    }))

    try {
      const searchText = await (
        await e2edriver.driver
          .get('http://localhost:9000/')
          .waitForElementByName('Search for a city')
      ).text()

      expect(searchText).toBe('Search for a city')
    } finally {
      await stopDriver(e2edriver)
    }
  })
})
