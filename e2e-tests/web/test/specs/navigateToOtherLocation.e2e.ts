import { URL } from 'node:url'

import { defaultRegion, filter, Routes } from '../../../shared/constants.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import RegionsPage from '../pageobjects/regions.page.js'

describe('navigate to other location', () => {
  it('filter and navigate to location', async () => {
    const dashboardPath = Routes.dashboard
    await RegionsPage.open()
    const search = RegionsPage.search
    await search.waitForExist({ timeout: 2000 })
    await search.click()
    await browser.keys(filter)

    const filteredRegion = RegionsPage.region(defaultRegion)
    await expect(filteredRegion).toBeDisplayed()

    await filteredRegion.click()

    await browser.waitUntil(async () => (await browser.getUrl()).includes(dashboardPath))
    const dashboardUrl = await browser.getUrl()
    const parsedDashboardUrl = new URL(dashboardUrl)
    expect(parsedDashboardUrl.pathname).toContain(dashboardPath)
  })

  it('should open an other location', async () => {
    const regionsPath = Routes.regions

    await DashboardPage.locationIcon.click()
    await browser.waitUntil(async () => (await browser.getUrl()).includes(regionsPath))

    const regionsUrl = await browser.getUrl()
    const parsedRegionsUrl = new URL(regionsUrl)
    expect(parsedRegionsUrl.pathname).toContain(regionsPath)

    const filteredRegion = RegionsPage.region('Stadt Augsburg')
    await filteredRegion.waitForExist({ timeout: 2000 })
    await expect(filteredRegion).toBeExisting()
    await filteredRegion.click()

    await browser.waitUntil(async () => (await browser.getUrl()).includes(Routes.dashboardAugsburg))
    const dashboardUrl = await browser.getUrl()
    const parsedDashboardUrl = new URL(dashboardUrl)
    expect(parsedDashboardUrl.pathname).toContain(Routes.dashboardAugsburg)
  })
})
