import { defaultCity, filter } from '../../../shared/constants'
import Keyboard from '../helpers/Keyboard'
import Gestures from '../helpers/Gestures'
import DashboardPage from '../pageobjects/dashboard.page'
import LandingPage from '../pageobjects/landing.page'

describe('navigate to dashboard', () => {
  it('filter and navigate to City', async () => {
    expect(await LandingPage.exists()).toBeTruthy()

    const cities = await LandingPage.cities
    const search = await LandingPage.search

    expect(cities.length).toBeGreaterThan(0)
    await search.click()
    await search.addValue(filter)

    await Keyboard.hide()
    await Gestures.checkIfDisplayedWithSwipeUp(await LandingPage.city(defaultCity), 3)

    const filteredCity = await LandingPage.city(defaultCity)

    expect(filteredCity).toBeDefined()

    // navigate to dashboard
    await filteredCity.click()

    expect(await DashboardPage.exists()).toBeTruthy()
  })
})
