import { defaultRegion, filter } from '../../../shared/constants.js'
import Keyboard from '../helpers/Keyboard.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import RegionsPage from '../pageobjects/regions.page.js'
import { allowNotifications } from './deviceUtils.js'

export const navigateToDashboard = async (): Promise<void> => {
  await allowNotifications()
  const regionsPage = RegionsPage
  await regionsPage.get()
  const search = await RegionsPage.search
  await search.click()
  await search.addValue(filter)
  await Keyboard.hide()
  const filteredRegion = await RegionsPage.region(defaultRegion)
  await filteredRegion.click()
  await DashboardPage.get()
}
