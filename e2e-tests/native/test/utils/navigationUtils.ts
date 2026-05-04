import { defaultRegion, filter } from '../../../shared/constants.js'
import Keyboard from '../helpers/Keyboard.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import LandingPage from '../pageobjects/landing.page.js'
import { allowNotifications } from './deviceUtils.js'

export const navigateToDashboard = async (): Promise<void> => {
  await allowNotifications()
  const landingPage = LandingPage
  await landingPage.get()
  const search = await LandingPage.search
  await search.click()
  await search.addValue(filter)
  await Keyboard.hide()
  const filteredRegion = await LandingPage.region(defaultRegion)
  await filteredRegion.click()
  await DashboardPage.get()
}
