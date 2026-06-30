import { augsburgRegion, defaultRegion, filter } from '../../../shared/constants.js'
import Keyboard from '../helpers/Keyboard.js'
import { Selector } from '../helpers/Selector.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import RegionsPage from '../pageobjects/regions.page.js'
import { allowNotifications } from '../utils/deviceUtils.js'

describe('navigate to other location', () => {
  it('should open a region on location selection', async () => {
    await allowNotifications()
    const regionsPage = RegionsPage
    await regionsPage.get()

    const regions = RegionsPage.regions
    const search = RegionsPage.search

    expect(await regions.length).toBeGreaterThan(0)
    await search.waitForDisplayed()
    await search.click()
    await search.addValue(filter)

    await Keyboard.hide()
    const filteredRegion = await RegionsPage.region(defaultRegion)

    // navigate to dashboard
    await filteredRegion.waitForDisplayed({ timeout: 20000 })
    await filteredRegion.click()

    await DashboardPage.get()
  })

  it('should open a new region on location change', async () => {
    await DashboardPage.headerOverflowButton.waitForDisplayed({ timeout: 20000 })
    await DashboardPage.headerOverflowButton.click()
    const changeLocation = $(new Selector().byText('Change location').build())
    await changeLocation.waitForDisplayed()
    await changeLocation.click()

    await RegionsPage.get()

    await Keyboard.hide()
    const newRegion = await RegionsPage.region(augsburgRegion)
    await newRegion.waitForDisplayed()
    await newRegion.click()

    await browser.waitUntil(async () => $(`~Dashboard-Page`).isDisplayed(), { timeout: 20000 })
    await DashboardPage.get()

    await $(new Selector().byText('Augsburg (Stadt)').build()).waitForDisplayed()
  })
})
