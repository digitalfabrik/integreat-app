import { URL } from 'node:url'

import { defaultRegion, filter, Routes } from '../../../shared/constants.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import LandingPage from '../pageobjects/landing.page.js'

describe('navigate to other location', () => {
  it('filter and navigate to location', async () => {
    const dashboardPath = Routes.dashboard
    await LandingPage.open()
    const search = LandingPage.search
    await search.waitForExist({ timeout: 2000 })
    await search.click()
    await browser.keys(filter)

    const filteredRegion = LandingPage.region(defaultRegion)
    await expect(filteredRegion).toBeDisplayed()

    await filteredRegion.click()

    await browser.waitUntil(async () => (await browser.getUrl()).includes(dashboardPath))
    const dashboardUrl = await browser.getUrl()
    const parsedDashboardUrl = new URL(dashboardUrl)
    expect(parsedDashboardUrl.pathname).toContain(dashboardPath)
  })

  it('should open an other location', async () => {
    const landingPath = Routes.landing

    await DashboardPage.locationIcon.click()
    await browser.waitUntil(async () => (await browser.getUrl()).includes(landingPath))

    const landingUrl = await browser.getUrl()
    const parsedLandingUrl = new URL(landingUrl)
    expect(parsedLandingUrl.pathname).toContain(landingPath)

    const filteredRegion = LandingPage.region('Stadt Augsburg')
    await filteredRegion.waitForExist({ timeout: 2000 })
    await expect(filteredRegion).toBeExisting()
    await filteredRegion.click()

    await browser.waitUntil(async () => (await browser.getUrl()).includes(Routes.dashboardAugsburg))
    const dashboardUrl = await browser.getUrl()
    const parsedDashboardUrl = new URL(dashboardUrl)
    expect(parsedDashboardUrl.pathname).toContain(Routes.dashboardAugsburg)
  })
})
