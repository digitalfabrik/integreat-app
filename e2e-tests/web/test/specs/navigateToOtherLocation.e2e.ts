import { URL } from 'url'

import { defaultCity, filter, Routes } from '../../../shared/constants'
import DashboardPage from '../pageobjects/dashboard.page'
import LandingPage from '../pageobjects/landing.page'

describe('navigate to other location', () => {
  it('filter and navigate to location', async () => {
    const dashboardPath = Routes.dashboard
    await LandingPage.open()

    const cities = await LandingPage.cities
    const search = await LandingPage.search
    await search.click()
    await browser.keys(filter)

    const filteredCities = await LandingPage.cities
    const filteredCity = await LandingPage.city(defaultCity)

    expect(cities.length).toBeGreaterThan(0)
    expect(filteredCities.length).toBeLessThan(cities.length)
    expect(await filteredCity.isDisplayed()).toBeTruthy()

    // navigate to dashboard
    await filteredCity.click()

    const dashboardUrl = await browser.getUrl()
    const parsedDashboardUrl = new URL(dashboardUrl)

    expect(parsedDashboardUrl.pathname).toContain(dashboardPath)
  })

  it('should open an other location', async () => {
    const landingPath = Routes.landing

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
