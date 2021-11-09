import { defaultCity, filter } from '../../../shared/constants'
import Gestures from '../helpers/Gestures'
import Keyboard from '../helpers/Keyboard'
import DashboardPage from '../pageobjects/dashboard.page'
import LandingPage from '../pageobjects/landing.page'

const MAX_SCROLLS = 4

export const navigateToDashboard = async (): Promise<void> => {
  await expect(LandingPage.get()).toExist()
  const search = await LandingPage.search
  await search.click()
  await search.addValue(filter)
  await Keyboard.hide()
  await Gestures.checkIfDisplayedWithSwipeUp(LandingPage.city(defaultCity), MAX_SCROLLS)
  const filteredCity = await LandingPage.city(defaultCity)
  await filteredCity.click()
  await expect(await DashboardPage.get()).toExist()
}
