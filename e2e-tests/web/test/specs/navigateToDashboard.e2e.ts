import { URL } from 'url'
import LandingPage from '../pageobjects/landing.page'
import { defaultCity, filter, language, Routes } from '../../../shared/constants'

describe('navigate to dashboard', () => {
  it('filter and navigate to City', async () => {
    const dashboardPath = Routes.dashboard
    LandingPage.language = language
    await LandingPage.open()

    const cities = await LandingPage.cities
    const search = await LandingPage.search
    await search.click()
    await browser.keys(filter)

    const filteredCities = await LandingPage.cities
    const filteredCity = await LandingPage.city(defaultCity)

    expect(cities.length).toBeGreaterThan(0)
    expect(filteredCities.length).toBeLessThan(cities.length)
    expect(filteredCity).toBeDefined()

    // navigate to dashboard
    await filteredCity.click()

    const dashboardUrl = await browser.getUrl()
    const parsedDashboardUrl = new URL(dashboardUrl)

    expect(parsedDashboardUrl.pathname).toContain(dashboardPath)
  })
})
