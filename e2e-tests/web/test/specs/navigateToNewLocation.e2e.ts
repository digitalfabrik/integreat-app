import { URL } from 'url'

import { Routes } from '../../../shared/constants'
import DashboardPage from '../pageobjects/dashboard.page'
import LandingPage from '../pageobjects/landing.page'

describe('navigateToOtherLocation', () => {
  it('should open an other fullAddress', async () => {
    const landingPath = Routes.landing
    await DashboardPage.open()

    await DashboardPage.locationIcon.click()

    const landingUrl = await browser.getUrl()
    const parsedLandingUrl = new URL(landingUrl)
    expect(parsedLandingUrl.pathname).toContain(landingPath)

    const filteredCity = LandingPage.city('Stadt Augsburg')
    await expect(filteredCity).toExist()

    await filteredCity.click()

    const dashboardUrl = await browser.getUrl()
    const parsedDashboardUrl = new URL(dashboardUrl)
    expect(parsedDashboardUrl.pathname).toContain(Routes.dashboardAugsburg)
  })
})
