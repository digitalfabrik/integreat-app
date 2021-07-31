import LandingPage from '../pageobjects/landing.page'
import DashboardPage from '../pageobjects/dashboard.page'
import { hideKeyboard, swipe, SwipeDirection } from '../Action'
import { defaultCity, filter } from '../../../shared/constants'

describe('navigate to dashboard', () => {
  it('filter and navigate to City', async () => {
    expect(await LandingPage.exists()).toBeTruthy()

    const cities = await LandingPage.cities
    const search = await LandingPage.search

    expect(cities.length).toBeGreaterThan(0)
    await search.click()
    await search.addValue(filter)

    await hideKeyboard()
    await swipe(SwipeDirection.Down)

    const filteredCity = await LandingPage.city(defaultCity)

    expect(filteredCity).toBeDefined()

    // navigate to dashboard
    await filteredCity.click()

    expect(await DashboardPage.exists()).toBeTruthy()
  })
})
