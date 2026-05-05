import { augsburgRegion, defaultRegion, filter } from '../../../shared/constants.js'
import Keyboard from '../helpers/Keyboard.js'
import { Selector } from '../helpers/Selector.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import LandingPage from '../pageobjects/landing.page.js'
import { allowNotifications } from '../utils/deviceUtils.js'

describe('navigate to other location', () => {
  it('should open a region on location selection', async () => {
    await allowNotifications()
    const landingPage = LandingPage
    await landingPage.get()

    const regions = LandingPage.regions
    const search = LandingPage.search

    expect(await regions.length).toBeGreaterThan(0)
    await search.waitForDisplayed()
    await search.click()
    await search.addValue(filter)

    await Keyboard.hide()
    const filteredRegion = await LandingPage.region(defaultRegion)

    // navigate to dashboard
    await filteredRegion.waitForDisplayed({ timeout: 20000 })
    await filteredRegion.click()

    await DashboardPage.get()
  })

  it('should open a new region on location change', async () => {
    await DashboardPage.headerOverflowButton.waitForDisplayed({ timeout: 20000 })
    await DashboardPage.headerOverflowButton.click()
    const changeLocation = $(new Selector().ByText('Change location').build())
    await changeLocation.waitForDisplayed()
    await changeLocation.click()

    await LandingPage.get()

    await Keyboard.hide()
    const newRegion = await LandingPage.region(augsburgRegion)
    await newRegion.waitForDisplayed()
    await newRegion.click()

    await browser.waitUntil(async () => $(`~Dashboard-Page`).isDisplayed(), { timeout: 20000 })
    await DashboardPage.get()

    await $(new Selector().ByText('Augsburg (Stadt)').build()).waitForDisplayed()
  })
})
