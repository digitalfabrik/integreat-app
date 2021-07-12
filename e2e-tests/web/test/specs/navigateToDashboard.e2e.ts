import { URL } from 'url'
import LandingPage from '../pageobjects/landing.page'
import { openLink } from '../util'

describe('navigate to dashboard', () => {
  it('filter and navigate to City', async () => {
    const language = 'en'
    const filter = 'Augsburg'
    const dashboardPath = `/${filter.toLowerCase()}/en`
    LandingPage.language = language
    await LandingPage.open()

    const cities = await LandingPage.cities
    const search = await LandingPage.search
    await search.click()
    await browser.keys(filter)

    const filteredCities = await LandingPage.cities
    const filteredCity = await LandingPage.city(filter)

    expect(cities.length).toBeGreaterThan(0)
    expect(filteredCities.length).toBeLessThan(cities.length)
    expect(filteredCity).toBeDefined()

    // navigate to dashboard
    const dashboardUrl = await openLink(filteredCity)

    const parsedDashboardUrl = new URL(dashboardUrl)

    expect(parsedDashboardUrl.pathname).toContain(dashboardPath)
  })
})
