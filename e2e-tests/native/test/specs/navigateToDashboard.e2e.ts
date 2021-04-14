import LandingPage from '../pageobjects/landing.page'
import DashboardPage from '../pageobjects/dashboard.page'

describe('navigate to dashboard', () => {

  it('filter and navigate to City', async () => {
    const filter = 'Augsburg'

    expect(await LandingPage.exists()).toBeTruthy()

    const cities = await LandingPage.cities
    const search = await LandingPage.search

    expect(cities.length).toBeGreaterThan(0)

    await search.click()
    await search.addValue(filter)

    const filteredCities = await LandingPage.cities
    // could be either Stadt Augsburg or Landkreis Augsburg
    const filteredCity = await LandingPage.city('Stadt Augsburg')

    expect(filteredCities.length).toBeLessThan(cities.length)
    expect(filteredCity).toBeDefined()

    // navigate to dashboard
    await filteredCity.click()

    expect(await DashboardPage.exists()).toBeTruthy()
  })
})
