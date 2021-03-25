import LandingPage from '../pageobjects/landing.page'

describe('navigate to dashboard', () => {
  it('filter and navigate to City', async () => {
    const language = 'en'
    const filter = 'Augsburg'
    const dashboardPath = `/${filter.toLowerCase()}/en`
    LandingPage.language = language

    const cities = await LandingPage.cities
    const search = await LandingPage.search
    await search.click()
    await search.keys(filter)

    const filteredCities = await LandingPage.cities
    const filteredCity = await LandingPage.city(filter)

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
