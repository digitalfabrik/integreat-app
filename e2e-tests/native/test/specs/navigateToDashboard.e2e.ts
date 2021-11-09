import { defaultCity, filter } from '../../../shared/constants'
import Gestures from '../helpers/Gestures'
import Keyboard from '../helpers/Keyboard'
import DashboardPage from '../pageobjects/dashboard.page'
import LandingPage from '../pageobjects/landing.page'

const MAX_SCROLLS = 4

describe('navigate to dashboard', () => {
  it('filter and navigate to City', async () => {
    await expect(LandingPage.get()).toExist()

    const cities = await LandingPage.cities
    const search = await LandingPage.search

    expect(cities.length).toBeGreaterThan(0)
    await search.click()
    await search.addValue(filter)

    await Keyboard.hide()
    await Gestures.checkIfDisplayedWithSwipeUp(LandingPage.city(defaultCity), MAX_SCROLLS)

    const filteredCity = await LandingPage.city(defaultCity)

    expect(filteredCity).toExist()

    // navigate to dashboard
    await filteredCity.click()

    await expect(DashboardPage.get()).toExist()
  })
})
