import { defaultRegion, filter } from '../../../shared/constants.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import RegionsPage from '../pageobjects/regions.page.js'

export const navigateToDashboard = async (): Promise<void> => {
  const regionsPage = RegionsPage
  await regionsPage.get()
  const search = await RegionsPage.search
  await search.setValue(filter)
  const filteredRegion = await RegionsPage.region(defaultRegion)
  await filteredRegion.waitForDisplayed()
  await filteredRegion.click()
  await DashboardPage.get()
}
