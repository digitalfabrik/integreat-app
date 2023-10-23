import { defaultCity, filter } from '../../../shared/constants.js'
import Keyboard from '../helpers/Keyboard.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import LandingPage from '../pageobjects/landing.page.js'

const MAX_SCROLLS = 5

export const navigateToDashboard = async (): Promise<void> => {
  await LandingPage.get()
  const search = await LandingPage.search
  await search.click()
  await search.addValue(filter)
  await Keyboard.hide()
  const filteredCity = await LandingPage.city(defaultCity)
  await filteredCity.click()
  await DashboardPage.get()
}
