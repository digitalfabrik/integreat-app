import { augsburgCity, defaultCity, filter } from '../../../shared/constants.js'
import Keyboard from '../helpers/Keyboard.js'
import { Selector } from '../helpers/Selector.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import LandingPage from '../pageobjects/landing.page.js'
import { allowNotifications } from '../utils/deviceUtils.js'

describe('navigate to other location', () => {
  it('should open a city on location selection', async () => {
    await allowNotifications()
    const landingPage = LandingPage
    await landingPage.get()

    const cities = await LandingPage.cities
    const search = await LandingPage.search

    expect(cities.length).toBeGreaterThan(0)
    await search.click()
    await search.addValue(filter)

    await Keyboard.hide()
    const filteredCity = await LandingPage.city(defaultCity)

    // navigate to dashboard
    await filteredCity.click()

    await DashboardPage.get()
  })

  it('should open a new city on location change', async () => {
    await DashboardPage.headerOverflowButton.click()
    await $(new Selector().ByText('Change location').build()).click()
    await LandingPage.get()

    const newCity = await LandingPage.city(augsburgCity)
    await newCity.click()
    await DashboardPage.get()

    await $(new Selector().ByText('Augsburg (Stadt)').build()).waitForDisplayed()
  })
})
