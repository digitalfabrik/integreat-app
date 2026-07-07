import { augsburgRegion, defaultRegion, filter } from '../../../shared/constants.js'
import { Selector } from '../helpers/Selector.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import RegionsPage from '../pageobjects/regions.page.js'

describe('navigate to other location', () => {
  it('should open a region on location selection', async () => {
    const regionsPage = RegionsPage
    await regionsPage.get()

    const regions = RegionsPage.regions
    const search = RegionsPage.search

    expect(await regions.length).toBeGreaterThan(0)
    await search.waitForDisplayed()
    await search.click()
    await search.setValue(filter)

    const filteredRegion = await RegionsPage.region(defaultRegion)

    // navigate to dashboard
    await filteredRegion.waitForDisplayed({ timeout: 20000 })
    await filteredRegion.click()

    await DashboardPage.get()
  })

  it('should open a new region on location change', async () => {
    const changeLocation = $(new Selector().byContentDesc(`${defaultRegion} Change location`).build())
    await changeLocation.waitForDisplayed({ timeout: 20000 })
    await changeLocation.click()

    await RegionsPage.get()

    const newRegion = await RegionsPage.region(augsburgRegion)
    await newRegion.waitForDisplayed({ timeout: 30000 })
    await newRegion.click()

    await DashboardPage.get()

    await $(new Selector().byText('Stadt Augsburg').build()).waitForDisplayed({ timeout: 2000 })
  })
})
