import { defaultRegion, filter } from '../../../shared/constants.js'
import Keyboard from '../helpers/Keyboard.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import RegionsPage from '../pageobjects/regions.page.js'

export const navigateToDashboard = async (): Promise<void> => {
  await RegionsPage.get()
  const search = await RegionsPage.search
  await search.setValue(filter)
  await Keyboard.hide()
  const filteredRegion = await RegionsPage.region(defaultRegion)
  await filteredRegion.waitForDisplayed()
  await filteredRegion.click()
  await DashboardPage.get()
}
