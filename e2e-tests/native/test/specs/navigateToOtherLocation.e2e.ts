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

    const cities = LandingPage.cities
    const search = LandingPage.search

    expect(await cities.length).toBeGreaterThan(0)
    await search.waitForDisplayed()
    await search.click()
    await search.addValue(filter)

    await Keyboard.hide()
    const filteredCity = await LandingPage.city(defaultCity)

    // navigate to dashboard
    await filteredCity.waitForDisplayed({ timeout: 20000 })
    await filteredCity.click()

    await DashboardPage.get()
  })

  it('should open a new city on location change', async () => {
    await DashboardPage.headerOverflowButton.waitForDisplayed({ timeout: 20000 })
    await DashboardPage.headerOverflowButton.click()
    const changeLocation = $(new Selector().ByText('Change location').build())
    await changeLocation.waitForDisplayed()
    await changeLocation.click()

    await LandingPage.get()

    await Keyboard.hide()
    const newCity = await LandingPage.city(augsburgCity)
    await newCity.waitForDisplayed()
    await newCity.click()

    await browser.waitUntil(async () => $(`~Dashboard-Page`).isDisplayed(), { timeout: 20000 })
    await DashboardPage.get()

    await $(new Selector().ByText('Augsburg (Stadt)').build()).waitForDisplayed()
  })
})
