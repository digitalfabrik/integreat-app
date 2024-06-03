import { defaultCity, filter } from '../../../shared/constants.js'
import Keyboard from '../helpers/Keyboard.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import LandingPage from '../pageobjects/landing.page.js'
import { allowNotifications } from './deviceUtils.js'

export const navigateToDashboard = async (): Promise<void> => {
  const landingPage = LandingPage
  await allowNotifications()
  await landingPage.get()
  const search = await LandingPage.search
  await search.click()
  await search.addValue(filter)
  await Keyboard.hide()
  const filteredCity = await LandingPage.city(defaultCity)
  await filteredCity.click()
  await DashboardPage.get()
}
