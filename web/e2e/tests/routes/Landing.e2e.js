// @flow

import { setupDriver, stopDriver } from '../../driver/driver'
import LandingPage from '../../pages/landing/LandingPage'

describe('UI language', () => {
  it('should match the system language de', async () => {
    const driver = await setupDriver()

    try {
      const landing = new LandingPage(driver)

      await landing.ready()

      const url = await driver.getCurrentUrl()
      const parsedUrl = new URL(url)
      expect(parsedUrl.pathname).toEqual('/landing/de')

      const searchInput = await landing.getSearchInput()
      expect(await searchInput.getAttribute('aria-label')).toEqual('Ort suchen')
      await searchInput.sendKeys('augsburg')

      const city = await landing.getCity('Augsburg')
      await city.click()

      const dashboardUrl = await driver.getCurrentUrl()
      const parsedDashboardUrl = new URL(dashboardUrl)
      expect(parsedDashboardUrl.pathname).toEqual('/augsburg/de')
    } finally {
      await stopDriver(driver)
    }
  })
})
