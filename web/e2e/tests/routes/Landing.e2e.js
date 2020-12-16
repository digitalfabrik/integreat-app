// @flow

import { setupDriver, stopDriver } from '../../driver/driver'
import LandingPage from '../../pages/landing/LandingPage'

describe('UI language', () => {
  it('should match the system language de', async () => {
    const e2eDriver = await setupDriver()

    try {
      const landing = new LandingPage(e2eDriver.driver)

      await landing.ready()

      const url = await e2eDriver.driver.url()
      const parsedUrl = new URL(url)
      expect(parsedUrl.pathname).toEqual('/landing/de')

      const searchInput = await landing.getSearchInput()
      expect(await searchInput.text()).toEqual('Ort suchen')
      await searchInput.setText('augsburg')

      const city = await landing.getCity('Augsburg')
      await city.click()

      const dashboardUrl = await e2eDriver.driver.url()
      const parsedDashboardUrl = new URL(dashboardUrl)
      expect(parsedDashboardUrl.pathname).toEqual('/augsburg/de')
    } finally {
      await stopDriver(e2eDriver)
    }
  })
})
