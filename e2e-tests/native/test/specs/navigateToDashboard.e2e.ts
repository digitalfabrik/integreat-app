import LandingPage from '../pageobjects/landing.page'
import DashboardPage from '../pageobjects/dashboard.page'
import {hideKeyboard, swipe} from "../Action";

describe('navigate to dashboard', () => {

  it('filter and navigate to City', async () => {
    const filter = 'wirschaffendas'

    expect(await LandingPage.exists()).toBeTruthy()

    const cities = await LandingPage.cities
    const search = await LandingPage.search

    expect(cities.length).toBeGreaterThan(0)
    await search.click()
    await search.addValue(filter)

    await hideKeyboard()
    await swipe('DOWN')

    const filteredCity = await LandingPage.city('Testumgebung')

    expect(filteredCity).toBeDefined()

    // navigate to dashboard
    await filteredCity.click()

    expect(await DashboardPage.exists()).toBeTruthy()
  })
})
