import { URL } from 'url'

import { Routes } from '../../../shared/constants'
import DashboardPage from '../pageobjects/dashboard.page'
import LandingPage from '../pageobjects/landing.page'

describe('navigateToOtherLocation', () => {
  it('should open an other location', async () => {
    const landingPath = Routes.landing
    await DashboardPage.open()

    const locationIcon = await DashboardPage.locationIcon
    await locationIcon.click()

    const landingUrl = await browser.getUrl()
    const parsedLandingUrl = new URL(landingUrl)
    expect(parsedLandingUrl.pathname).toContain(landingPath)

    const filteredCity = await LandingPage.city('Stadt Augsburg')
    expect(filteredCity).toBeDefined()

    await filteredCity.click()

    const dashboardUrl = await browser.getUrl()
    const parsedDashboardUrl = new URL(dashboardUrl)
    expect(parsedDashboardUrl.pathname).toContain(Routes.dashboardAugsburg)
  })
})
