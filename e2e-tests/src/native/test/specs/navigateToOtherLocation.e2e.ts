import { augsburgRegion, defaultRegion, filter } from '../../../shared/constants.js'
import Keyboard from '../helpers/Keyboard.js'
import { Selector } from '../helpers/Selector.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import RegionsPage from '../pageobjects/regions.page.js'

describe('navigate to other location', () => {
  it('should open a region on location selection', async () => {
    await RegionsPage.get()

    const search = RegionsPage.search
    Keyboard.hide()

    // check whether regions exist
    await $(`~StädteRegion Aachen`).waitForDisplayed({ timeout: 10000 })
    await $(`~Landkreis Aichach-Friedberg`).waitForDisplayed({ timeout: 10000 })

    await search.waitForDisplayed()
    await search.click()
    await search.setValue(filter)
    await Keyboard.hide()

    const filteredRegion = await RegionsPage.region(defaultRegion)

    // navigate to dashboard
    await filteredRegion.waitForDisplayed({ timeout: 20000 })
    await filteredRegion.click()

    await DashboardPage.get()
  })

  it('should open a new region on location change', async () => {
    const changeLocation = $(new Selector().byContentDesc(`${defaultRegion} Change location`).build())
    await changeLocation.waitForDisplayed()
    await changeLocation.click()

    await RegionsPage.get()
    await Keyboard.hide()
    const newRegion = await RegionsPage.region(augsburgRegion)
    await newRegion.waitForDisplayed({ timeout: 30000 })
    await newRegion.click()

    const welcomeDashboardCategory = $(new Selector().byContentDesc(`Welcome to Augsburg`).build())
    await welcomeDashboardCategory.waitForDisplayed({ timeout: 40000 })

    await $(new Selector().byContentDesc('Stadt Augsburg Change location').build()).waitForDisplayed()
  })
})
